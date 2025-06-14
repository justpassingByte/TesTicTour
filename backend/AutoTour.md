# Thiết kế Backend Auto Tournament – TesTicTour

## 1. Kiến trúc tổng quan & Thư mục dự án

```
backend/
├── src/
│   ├── controllers/      # Xử lý logic cho từng route
│   ├── routes/           # Định nghĩa API endpoints
│   ├── models/           # Định nghĩa schema ORM
│   ├── services/         # Business logic, gọi DB, gọi Riot API, v.v.
│   ├── jobs/             # BullMQ jobs (fetch match, update points)
│   ├── sockets/          # Socket.IO handlers
│   ├── middlewares/      # Auth, rate limit, validate, error handler
│   ├── utils/            # Helper functions
│   └── app.ts            # Khởi tạo app Express
├── prisma/               # Nếu dùng Prisma ORM
│   └── schema.prisma
├── package.json
├── tsconfig.json
└── .env
```

## 2. Thiết kế Database

### Bảng chính & giải thích:
- **users**: Thông tin user, liên kết participant, balance, transaction
- **tournament_templates**: Mẫu giải auto (admin tạo, hệ thống sinh giải). Lưu `prize_structure` (có thể là số tiền hoặc tỉ lệ cho từng hạng, *dự kiến ban đầu*), `hostFeePercent` (tối thiểu 10%), `expected_participants` (số người tham gia dự kiến).
- **tournaments**: Thông tin giải, liên kết template, auto, trạng thái. Khi tạo giải từ template, copy `hostFeePercent`, `prize_structure` gốc, `expected_participants` vào tournament. Lưu thêm `actual_participants_count` và `adjusted_prize_structure` (cơ cấu giải thưởng đã điều chỉnh dựa trên số người thực tế).
- **participants**: User tham gia giải, trạng thái, điểm, đã trả phí chưa
- **rewards**: Phần thưởng từng participant
- **rounds**: Vòng đấu của giải
- **lobbies**: Bảng đấu nhỏ trong round
- **matches**: Trận đấu thực tế (liên kết Riot API)
- **match_results**: Kết quả từng trận, từng user
- **balances**: Số dư user
- **transactions**: Lịch sử giao dịch (nạp, rút, entry_fee, reward, refund)

## 3. Model Prisma (ví dụ)

```prisma
model User {
  id           String   @id @default(uuid())
  username     String   @unique
  email        String   @unique
  riotGameName String
  riotGameTag  String
  region       String
  createdAt    DateTime @default(now())
  participants Participant[]
  balance      Balance?
  transactions Transaction[]
  createdTournamentTemplates TournamentTemplate[] @relation("UserCreatedTournamentTemplates")
  organizedTournaments Tournament[] @relation("UserOrganizedTournaments")
  matchResults MatchResult[]
}

model TournamentTemplate {
  id                  String   @id @default(uuid())
  name                String
  roundsTotal         Int
  maxPlayers          Int
  entryFee            Float
  prizeStructure      Json // Cấu trúc giải thưởng dự kiến (số tiền hoặc tỉ lệ)
  hostFeePercent      Float    @default(0.1) // 10% tối thiểu
  expectedParticipants Int
  scheduleType        String
  startTime           String // Thời gian bắt đầu dự kiến (ví dụ: "18:00" cho giải hàng ngày) - sẽ được kết hợp với ngày hiện tại khi tạo Tournament thực tế.
  createdBy           User   @relation("UserCreatedTournamentTemplates", fields: [createdById], references: [id])
  createdById         String
  createdAt           DateTime @default(now())
  tournaments         Tournament[]
}

model Tournament {
  id                    String   @id @default(uuid())
  name                  String
  description           String?
  startTime             DateTime
  organizer             User     @relation("UserOrganizedTournaments", fields: [organizerId], references: [id])
  organizerId           String
  status                String
  maxPlayers            Int
  roundsTotal           Int
  config                Json?
  createdAt             DateTime @default(now())
  template              TournamentTemplate? @relation(fields: [templateId], references: [id])
  templateId            String?
  auto                  Boolean  @default(false)
  registrationDeadline  DateTime
  participants          Participant[]
  rounds                Round[]
  rewards               Reward[]
  prizeStructure        Json // Cấu trúc giải thưởng gốc từ template
  hostFeePercent        Float    @default(0.1)
  expectedParticipants  Int
  actualParticipantsCount Int? // Số người tham gia thực tế
  adjustedPrizeStructure Json? // Cơ cấu giải thưởng đã điều chỉnh
}

model Participant {
  id           String   @id @default(uuid())
  tournament   Tournament @relation(fields: [tournamentId], references: [id])
  tournamentId String
  user         User     @relation(fields: [userId], references: [id])
  userId       String
  joinedAt     DateTime @default(now())
  scoreTotal   Float    @default(0)
  eliminated   Boolean  @default(false)
  paid         Boolean  @default(false)
  rewarded     Boolean  @default(false)
  rewards      Reward[]
}

model Reward {
  id           String   @id @default(uuid())
  participant  Participant @relation(fields: [participantId], references: [id])
  participantId String
  tournament   Tournament @relation(fields: [tournamentId], references: [id])
  tournamentId String
  amount       Float
  status       String
  sentAt       DateTime?
}

model Round {
  id           String   @id @default(uuid())
  tournament   Tournament @relation(fields: [tournamentId], references: [id])
  tournamentId String
  roundNumber  Int
  startTime    DateTime
  endTime      DateTime?
  status       String
  lobbies      Lobby[]
}

model Lobby {
  id           String   @id @default(uuid())
  round        Round    @relation(fields: [roundId], references: [id])
  roundId      String
  name         String
  participants Json
  matchId      String?
  fetchedResult Boolean @default(false)
  matches      Match[]
}

model Match {
  id           String   @id @default(uuid())
  matchIdRiotApi String
  lobby        Lobby    @relation(fields: [lobbyId], references: [id])
  lobbyId      String
  fetchedAt    DateTime?
  matchData    Json?
  matchResults MatchResult[]
}

model MatchResult {
  id           String   @id @default(uuid())
  match        Match    @relation(fields: [matchId], references: [id])
  matchId      String
  user         User     @relation(fields: [userId], references: [id])
  userId       String
  placement    Int
  points       Float
}

model Balance {
  id        String   @id @default(uuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String   @unique
  amount    Float    @default(0)
  updatedAt DateTime @updatedAt
}

model Transaction {
  id        String   @id @default(uuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  type      String   // deposit, withdraw, refund, entry_fee, reward
  amount    Float
  status    String   // pending, success, failed
  refId     String?  // tournamentId, rewardId, ...
  createdAt DateTime @default(now())
}
```

## 4. API Endpoints (RESTful)

### Auth & User
- `POST /api/auth/register` – Đăng ký
- `POST /api/auth/login` – Đăng nhập
- `GET /api/auth/me` – Lấy thông tin user hiện tại
- `GET /api/users/:id` – Lấy thông tin user
- `PUT /api/users/:id` – Cập nhật thông tin user

### Tournament & Template
- `GET /api/tournaments` – Danh sách giải
- `POST /api/tournaments` – Tạo giải (admin)
- `GET /api/tournaments/:id` – Chi tiết giải
- `PUT /api/tournaments/:id` – Sửa giải (admin)
- `DELETE /api/tournaments/:id` – Xóa giải (admin)
- `GET /api/tournament-templates` – Danh sách template
  - `POST /api/tournament-templates` – Tạo template giải đấu
  - `POST /api/tournaments/auto` – (admin) Trigger tạo giải auto (nếu muốn manual)

### Participant, Round, Lobby, Match
- `POST /api/tournaments/:id/join` – User đăng ký tham gia giải (tự động kiểm tra & trừ tiền)
- `GET /api/tournaments/:id/participants` – Danh sách người chơi
- `GET /api/tournaments/:id/rounds` – Danh sách vòng
- `POST /api/tournaments/:id/rounds` – Tạo vòng (admin)
- `GET /api/rounds/:roundId/lobbies` – Danh sách lobby của vòng
- `POST /api/rounds/:roundId/lobbies` – Tạo lobby (admin)
- `GET /api/lobbies/:lobbyId/matches` – Danh sách trận của lobby
- `POST /api/lobbies/:lobbyId/matches` – Tạo trận (admin)
- `GET /api/matches/:matchId/results` – Kết quả trận
- `POST /api/matches/:matchId/results` – Cập nhật kết quả (tự động hoặc admin)
- `POST /api/rounds/:roundId/auto-advance` – Tự động advance round, chia lobby, loại player
- `GET /api/rounds/:roundId/next-lobbies` – Xem trước kết quả chia lobby tiếp theo

### Balance & Transaction
- `POST /api/balance/deposit` – Nạp tiền (Stripe/Momo webhook)
- `GET /api/balance` – Xem số dư
- `GET /api/transactions` – Lịch sử giao dịch
- `POST /api/tournaments/:id/cancel` – Hủy giải (tự động hoàn tiền)

### Realtime (Socket.IO)
- `match_result_update` – Push kết quả trận cho client
- `tournament_update` – Push cập nhật giải đấu

## 5. Service Layer

- **UserService:** Đăng ký, đăng nhập, xác thực, quản lý user
- **TournamentService:** CRUD giải đấu, chia lobby, tạo rounds. Khi tạo giải, copy `prize_structure`, `hostFeePercent`, `expected_participants` từ template. Khi kết thúc đăng ký, tính `actual_participants_count` và gọi `PrizeCalculationService.autoAdjustPrizeStructure` để tạo `adjusted_prize_structure` và lưu vào tournament. Khi kết thúc giải, tính toán prize pool và payout theo số người thực tế, đảm bảo `hostFeePercent` >= 0.1.
- **ParticipantService:** Đăng ký giải, tính điểm, loại người chơi, xử lý balance
- **RiotApiService:** Quản lý việc gọi Riot API để lấy thông tin user (puuid), fetch dữ liệu trận đấu (match data), và lấy kết quả chi tiết của trận. Xử lý rate limit và retry logic.
- **MatchService:** Lưu match, lưu kết quả thô từ Riot API (`match_data`).
- **MatchResultService:** Xử lý phân tích dữ liệu `match_data` để trích xuất `placement`, `points` của từng user trong trận, cập nhật vào bảng `match_results` và `participant.score_total`.
- **JobService:** Quản lý các job queue (BullMQ/Redis) để fetch match, update points, xử lý các tác vụ gọi Riot API không đồng bộ.
- **SocketService:** Push realtime cho client (kết quả, bảng điểm, trạng thái giải).
- **LobbyService:** Tự động chia lobby, loại player
- **BalanceService:** getBalance, deposit, withdraw, refund, transferReward
- **TransactionService:** Ghi nhận, cập nhật trạng thái transaction, đảm bảo atomicity
- **PrizeCalculationService:** Chứa logic `autoAdjustPrizeStructure` để điều chỉnh giải thưởng dựa trên số người tham gia thực tế và lợi nhuận host.

## 6. Luồng tự động hóa giải đấu & xử lý balance

### 6.1. Auto Tournament Flow
1. Admin tạo template giải đấu với `name`, `roundsTotal`, `maxPlayers`, `entryFee`, `prize_structure` (dự kiến ban đầu), `hostFeePercent` (tối thiểu 10%), `expected_participants`, `scheduleType`, và `startTime`.
2. Đến giờ (hoặc theo lịch): Cronjob tự tạo giải mới từ template, copy các thông số. Đối với `scheduleType` là 'daily', `startTime` (string từ template) sẽ được kết hợp với ngày hiện tại để tạo `DateTime` cho `Tournament.startTime`.
3. Mở đăng ký: User đăng ký, đóng khi đủ người hoặc hết hạn.
4. **Sau khi đóng đăng ký**: Hệ thống tính `actual_participants_count`. Nếu `actual_participants_count` < `expected_participants`, hệ thống tự động gọi `PrizeCalculationService.autoAdjustPrizeStructure` để điều chỉnh `prize_structure` và lưu vào `adjusted_prize_structure` của tournament.
5. Tự động bắt đầu: Đến giờ, hệ thống tự chia lobby, tạo round đầu tiên.
6. Sau mỗi round: Tự động tính điểm, loại, chia lại lobby, advance round tiếp theo.
7. Kết thúc: Khi hết round cuối, hệ thống tự động tổng kết, phát thưởng cho người thắng dựa trên `adjusted_prize_structure`.
8. Realtime: Push thông báo cho user về trạng thái giải, lobby, kết quả, phần thưởng.

### 6.2. Đăng ký giải bằng balance
- Khi user đăng ký giải:
  - Kiểm tra balance ≥ entry_fee
  - Nếu đủ, trừ tiền, tạo participant, participant.paid=true
  - Nếu không đủ, trả lỗi "Insufficient balance"
- Nếu giải bị hủy hoặc user bị loại trước khi giải bắt đầu:
  - Tự động hoàn tiền
- Khi giải kết thúc:
  - Tự động phát thưởng cho các participant thắng cuộc
- Tất cả đều chạy trong transaction, đảm bảo an toàn, không double-spend

### 6.3. Phát thưởng tự động & lợi nhuận host
- Khi kết thúc đăng ký và **trước khi giải bắt đầu**, hệ thống sẽ tự động tính toán lại cơ cấu giải thưởng (`adjusted_prize_structure`) dựa trên số lượng người tham gia thực tế (`actual_participants_count`).
- `prizePool` thực tế = `entryFee` * `actual_participants_count` * (1 - `hostFeePercent`)
- **Logic điều chỉnh giải thưởng**: Nếu tổng giải thưởng dự kiến (từ `prize_structure` gốc) vượt quá `prizePool` thực tế (90% tổng phí thực thu), hệ thống sẽ giảm giá trị các hạng mục giải thưởng. Ưu tiên giữ nguyên hoặc giảm ít nhất cho các hạng cao (ví dụ: hạng 1, 2) và giảm nhiều hơn hoặc loại bỏ các hạng thấp (ví dụ: hạng 4, 5) để đảm bảo `hostFeePercent` luôn được duy trì và tổng payout không vượt quá `prizePool` thực tế.
- Host nhận: `entryFee` * `actual_participants_count` * `hostFeePercent`.
- Hệ thống validate: `hostFeePercent` >= 0.1, tổng payout từ `adjusted_prize_structure` không vượt quá `prizePool` thực tế.

#### Ví dụ (bổ sung):
- Admin tạo giải: dự kiến 100 người, phí 10k/người. Giải thưởng: Hạng 1: 400k, Hạng 2: 300k, Hạng 3: 200k, Hạng 4: 100k (Tổng dự kiến 1tr).
- Thực tế chỉ có 50 người tham gia, tổng thu = 500k. Host fee 10% => Host nhận 50k. Prize Pool tối đa = 450k.
- Hệ thống tự động điều chỉnh `adjusted_prize_structure` sao cho tổng payout ≤ 450k. Ví dụ: Hạng 1: 250k, Hạng 2: 150k, Hạng 3: 50k (Tổng 450k), bỏ hạng 4.

### 6.4. Xử lý kết quả trận đấu & Tích hợp Riot API
- **Khi trận đấu kết thúc (hoặc được hệ thống xác định là đã diễn ra):**
  1.  Hệ thống tạo một job trong **JobService** để fetch dữ liệu trận đấu từ Riot API.
  2.  **JobService** gọi **RiotApiService** để lấy `match_data` (dữ liệu thô của trận).
  3.  **MatchService** lưu `match_data` này vào bảng `matches`.
  4.  Một job khác (hoặc cùng job) sẽ trigger **MatchResultService** để phân tích `match_data`.
  5.  **MatchResultService** trích xuất `placement` và `points` của từng user, sau đó cập nhật vào bảng `match_results` và tổng điểm (`score_total`) của `participant`.
  6.  **SocketService** push event `match_result_update` cho các client trong lobby đó, cập nhật bảng điểm realtime.
  7.  Nếu là vòng cuối cùng, trigger quá trình tính toán giải thưởng và phát thưởng.

### 6.5. Realtime
- Khi có kết quả mới, server emit event cho client:
  - `match_result_update` (gửi cho user trong lobby)
  - `tournament_update` (gửi cho admin/dashboard)
- Client subscribe theo tournamentId, userId, lobbyId

## 7. Bảo mật & tối ưu
- **JWT cho Auth** (Bearer token)
- **Rate limit** khi gọi Riot API (quan trọng để tránh bị block, nên có queue và retry với backoff)
- **Redis cache** cho puuid, match data (giảm tải cho Riot API và DB)
- **Role-based access** (admin, user)
- **Validation** (Joi, Zod, hoặc class-validator)
- **Error handling** chuẩn REST
- **Index các trường FK** để tăng tốc truy vấn
- **Job queue**: Mỗi giải nên có job riêng (BullMQ/Redis) để xử lý các tác vụ không đồng bộ như gọi Riot API, phát thưởng, advance round.
- **Transaction**: Advance round, chia lobby, phát thưởng đều dùng transaction
- **Lock balance row** khi update balance
- **Webhook xác thực** khi nhận tiền từ cổng thanh toán
- **Audit log** mọi thay đổi balance, transaction
- **Monitoring & Alerting**: Theo dõi queue, transaction pending, error log, event bất thường.
- **Scale database**: Nếu số lượng giải lớn, cân nhắc sharding/phân vùng bảng

## 8. Mở rộng
- **Thanh toán:** Stripe/Momo webhook, lưu transaction, xác thực callback
- **Phần thưởng:** Tự động phát thưởng khi giải kết thúc
- **Admin dashboard:** Thống kê, quản lý, export dữ liệu
- **Export/Import:** Dữ liệu giải, user, transaction
- **Tích hợp thêm game, rule mới**

## 9. Checklist kiểm thử bảo mật & nhất quán dữ liệu

### 9.1. Transaction & Lock
- [ ] Tất cả thao tác trừ tiền, hoàn tiền, phát thưởng đều nằm trong transaction DB.
- [ ] Khi update balance, lock row theo user_id (ví dụ: SELECT ... FOR UPDATE nếu dùng SQL).
- [ ] Nếu transaction thất bại, rollback toàn bộ thao tác liên quan.
- [ ] Khi advance round, chia lobby, phát thưởng: tất cả thay đổi liên quan phải nằm trong 1 transaction hoặc rollback nếu lỗi.

#### Ví dụ (pseudo-code):
```ts
await db.transaction(async (tx) => {
  // Lock balance row
  const balance = await tx.balance.findUnique({ where: { userId }, lock: 'FOR UPDATE' });
  if (balance.amount < entryFee) throw new Error('Insufficient balance');
  await tx.balance.update({ where: { userId }, data: { amount: { decrement: entryFee } } });
  await tx.transaction.create({ ... });
  await tx.participant.create({ ... });
});
```

### 9.2. Queue & Retry
- [ ] Các thao tác phát thưởng, hoàn tiền, update điểm, và **fetch match data từ Riot API** đều chạy qua job queue (BullMQ/Redis).
- [ ] Nếu job thất bại, có cơ chế retry tự động, log lỗi, cảnh báo admin nếu retry quá số lần.

### 9.3. Xác thực webhook thanh toán
- [ ] Chỉ cộng tiền khi xác thực callback từ Stripe/Momo thành công (kiểm tra signature, trạng thái payment).
- [ ] Log lại toàn bộ request webhook để audit.

### 9.4. Phân quyền API
- [ ] API admin (tạo/xóa giải, template) phải kiểm tra role.
- [ ] API user (join, xem balance, transaction) phải xác thực user, không cho truy cập chéo.

### 9.5. Rate limit & Riot API
- [ ] Có rate limit cho từng user, từng giải, tổng hệ thống khi gọi Riot API.
- [ ] Nếu bị block, tự động retry sau delay (với exponential backoff), log cảnh báo.
- [ ] Sử dụng Redis cache để lưu các kết quả Riot API thường xuyên truy cập (ví dụ: puuid, match data mới fetch).

### 9.6. Monitoring & Alerting
- [ ] Theo dõi queue, transaction pending, error log, event bất thường.
- [ ] Cảnh báo khi queue nghẽn, transaction pending quá lâu, hoặc có lỗi bất thường.

### 9.7. Realtime event leak
- [ ] Khi emit event realtime, chỉ gửi đúng user/lobby/tournament, không broadcast toàn hệ thống.
- [ ] Kiểm tra quyền trước khi emit event sensitive.

### 9.8. Data consistency khi scale
- [ ] Nếu scale DB (sharding, partition), đảm bảo transaction liên bảng vẫn nhất quán.
- [ ] Test rollback khi 1 bước trong flow auto tournament lỗi giữa chừng.

### 9.9. Logic tính toán & điều chỉnh giải thưởng
- [ ] Khi chốt danh sách đăng ký, hệ thống luôn tính `actual_participants_count`.
- [ ] Gọi `PrizeCalculationService.autoAdjustPrizeStructure` để tạo `adjusted_prize_structure` và lưu vào tournament.
- [ ] Tổng payout từ `adjusted_prize_structure` không vượt quá 90% tổng phí thực thu (`entryFee` * `actual_participants_count`).
- [ ] `hostFeePercent` luôn >= 0.1 (10%) tổng phí thực thu.
- [ ] Logic điều chỉnh giải thưởng ưu tiên hạng cao, giảm dần hoặc loại bỏ hạng thấp nếu cần.
- [ ] Khi phát thưởng, luôn sử dụng `adjusted_prize_structure`.

### 9.10. Theo dõi kết quả trận đấu & Cập nhật điểm
- [ ] Dữ liệu trận đấu từ Riot API (`match_data`) được fetch và lưu trữ đầy đủ.
- [ ] `MatchResultService` phân tích chính xác `placement` và `points` cho từng user trong trận.
- [ ] Bảng `match_results` được cập nhật đầy đủ, chính xác sau mỗi trận.
- [ ] Tổng điểm (`score_total`) của `participant` được cập nhật đúng sau mỗi trận đấu.
- [ ] Realtime event `match_result_update` được push kịp thời cho client.
- [ ] Hệ thống xử lý được các trường hợp trận đấu bị hủy, không có kết quả, hoặc lỗi từ Riot API.

---

Thiết kế này đảm bảo hệ thống auto tournament luôn tự động tính toán và điều chỉnh giải thưởng theo số người tham gia thực tế, host luôn có lời tối thiểu 10% tổng phí, không bao giờ lỗ. 