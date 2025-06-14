# Hướng Dẫn Kiểm Thử Luồng Giải Đấu Tự Động (Auto Tournament Flow)

Để kiểm thử toàn bộ luồng giải đấu tự động (từ tạo template đến tự động tạo giải, chia lobby, xử lý kết quả và phát thưởng) mà không cần tích hợp trực tiếp với Riot API, bạn có thể sử dụng cơ chế mô phỏng (mocking) Riot API đã được triển khai.

## Bước 0: Thiết lập môi trường và khởi động lại Server

1.  **Bật chế độ Mock API:**
    *   Mở file `.env` của bạn (nếu chưa có, bạn có thể tạo một file `.env` ở thư mục gốc `TesTicTour/backend/`).
    *   Thêm dòng sau vào file `.env`:
        ```
        MOCK_RIOT_API=true
        ```
    *   Nếu bạn có `RIOT_API_KEY`, bạn vẫn có thể giữ nó, nhưng khi `MOCK_RIOT_API` là `true`, các cuộc gọi API Riot thật sẽ bị bỏ qua và thay bằng dữ liệu giả lập.

2.  **Rebuild và Khởi động lại Server:**
    *   Sau khi thay đổi `.env` và mã nguồn, bạn cần rebuild và khởi động lại server để các thay đổi có hiệu lực:
        ```bash
        npm run build
        npm start
        ```

3.  **Khởi động Worker (QUAN TRỌNG):**
    *   Để các tác vụ xử lý dữ liệu trận đấu (fetch match data) được thực thi, bạn cần chạy một worker riêng biệt. Mở một terminal mới và chạy lệnh sau:
        ```bash
        cd TesTicTour/backend
        npm run worker
        ```
    *   Đảm bảo worker khởi động thành công (bạn sẽ thấy thông báo `MatchDataWorker started. Waiting for jobs...`). Giữ terminal này mở trong suốt quá trình kiểm thử.

    *   Khi server khởi động, bạn sẽ thấy thông báo `MOCKING Riot API - Returning dummy match data...` trong console khi các cuộc gọi API Riot được mô phỏng.

## Bước 1: Tạo Tài khoản Admin và User

*   Đảm bảo bạn có ít nhất một tài khoản admin để tạo template và một vài tài khoản user (ít nhất 8 user nếu bạn muốn test đủ 1 lobby 8 người) để tham gia giải đấu.
*   Bạn có thể dùng Postman để đăng ký và đăng nhập (sử dụng các endpoint `POST /api/auth/register` và `POST /api/auth/login`).
*   Lấy `token` của admin và các user để dùng cho các request tiếp theo.
    *   **Mẹo quan trọng:** Để mô phỏng người chơi khác nhau với PUUID giả lập, hãy đảm bảo rằng `username` và `email` của các user bạn tạo là khác nhau, vì `RiotApiService.getSummonerPuuid` sẽ tạo PUUID giả lập dựa trên `gameName` và `gameTag`. Bạn có thể cập nhật `gameName` và `gameTag` cho mỗi user để tạo ra các PUUID giả lập khác nhau nếu cần (hiện tại `getSummonerPuuid` dùng `gameName` và `gameTag` để tạo PUUID mock, nên mỗi user cần một cặp `gameName/gameTag` duy nhất để có PUUID duy nhất).

## Bước 2: Tạo Template Giải Đấu

*   Sử dụng request `POST /api/tournament-templates` trong Postman (hoặc `curl`).
*   **QUAN TRỌNG:** Với hệ thống "Phase" mới, `roundsTotal` chỉ còn mang tính tham khảo. Cấu hình chi tiết của giải đấu giờ nằm trong thuộc tính `phases`.

    ```bash
    curl -X POST \
      http://localhost:4000/api/tournament-templates \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_ADMIN_AUTH_TOKEN' \
      -d '{
        "name": "Advanced Phase-Based Tournament Template",
        "maxPlayers": 16,
        "entryFee": 100,
        "prizeStructure": {
          "1": 0.6,
          "2": 0.4
        },
        "hostFeePercent": 0.1,
        "scheduleType": "daily",
        "startTime": "HH:MM_IN_FUTURE",
        "phases": [
          {
            "type": "elimination",
            "name": "Vòng Loại",
            "lobbySize": 8,
            "lobbyAssignment": "random",
            "advancementCondition": {
              "top": 4 
            }
          },
          {
            "type": "checkmate",
            "name": "Chung kết Checkmate",
            "lobbySize": 8,
            "lobbyAssignment": "seeded",
            "advancementCondition": {
              "pointsToActivate": 20
            }
          }
        ]
      }'
    ```

*   **Giải thích cấu hình `phases`:**
    *   `phases` là một mảng (array), mỗi phần tử là một object đại diện cho một giai đoạn (vòng đấu).
    *   `type`: Thể thức của phase. Có thể là `"elimination"`, `"points"`, hoặc `"checkmate"`.
    *   `name`: Tên của phase (ví dụ: "Vòng Bảng", "Tứ kết").
    *   `lobbySize`: Số người chơi trong một sảnh.
    *   `lobbyAssignment`: Cách chia sảnh. Có thể là `"random"` (ngẫu nhiên) hoặc `"seeded"` (dựa vào điểm/thứ hạng).
    *   `advancementCondition`: Điều kiện để đi tiếp.
        *   Với `elimination`: `{ "top": X }` - Lấy top X người đi tiếp. (Ví dụ trong mẫu trên là `top: 4`)
        *   Với `checkmate`: `{ "pointsToActivate": Y }` - Cần Y điểm để vào trạng thái Checkmate.
        *   Với `points`: `{ "top": X }` - Lấy top X người đi tiếp (sau khi hoàn tất tất cả các vòng trong phase).
            *   **`totalRoundsInPhase`**: (Chỉ dành cho type `points`) Số lượng vòng đấu (matches) mong muốn trong phase này. Người chơi sẽ tích lũy điểm qua tất cả các vòng này. Chỉ khi tất cả các vòng đã hoàn tất, điều kiện `advancementCondition` mới được áp dụng.
        *   (Thể thức `points` sẽ được mở rộng trong tương lai).

*   **Về `prizeStructure` và `hostFeePercent`:**
    *   `entryFee` của tất cả người chơi sẽ tạo thành `totalCollected`. 
    *   `hostFeePercent` sẽ được trừ từ `totalCollected` để tính ra `hostFee` (phí của host) và `prizePool` (tổng tiền thưởng còn lại sau khi trừ phí host).
    *   `prizeStructure` định nghĩa tỷ lệ phân chia của `prizePool` cho các thứ hạng (ví dụ: `"1": 0.6`, `"2": 0.4` nghĩa là người hạng 1 nhận 60% của `prizePool`, người hạng 2 nhận 40% của `prizePool`). Host sẽ có lợi nhuận từ `hostFee`.

*   Thay `YOUR_ADMIN_AUTH_TOKEN` và `HH:MM_IN_FUTURE` như cũ.
*   **Lưu lại `id` của template** sau khi tạo thành công.

## Bước 3: Kích hoạt Giải Đấu Thực Tế (Tự động hoặc Thủ công)

*   **Cách 1: Chờ Cron Job (Tự động):**
    *   Nếu bạn đã đặt `startTime` của template (ở Bước 2) là một thời điểm trong tương lai gần, Cron Job `autoTournamentCron` sẽ tự động tạo giải đấu thực tế khi đến giờ đó. **Vòng đấu đầu tiên của giải đấu sẽ được tạo với `startTime` sau 5 phút so với `startTime` của giải đấu.**

*   **Cách 2: Kích hoạt Thủ công (để kiểm thử ngay lập tức - **khuyến nghị**):**
    *   Gửi request `POST` đến `http://localhost:4000/api/tournaments/auto`.
    *   Header: `Authorization: Bearer YOUR_ADMIN_AUTH_TOKEN`, `Content-Type: application/json`.
    *   Body: `{"templateId": "YOUR_TEMPLATE_ID"}` (thay bằng ID template bạn đã lưu).
    *   Khi gọi API này, một giải đấu mới sẽ được tạo **ngay lập tức**. **Vòng đấu đầu tiên của giải đấu cũng sẽ được tạo với `startTime` sau 5 phút so với `startTime` của giải đấu** (tức là 5 phút sau thời điểm bạn gọi API này).

## Bước 4: Đăng ký Người chơi vào Giải Đấu

1.  Sau khi giải đấu được tạo (tự động hoặc thủ công ở Bước 3), bạn cần lấy `tournamentId` của giải đấu đó (có thể lấy từ phản hồi của API `POST /api/tournaments/auto` hoặc dùng `GET /api/tournaments`).
2.  Chạy script hỗ trợ để đăng ký 16 user test vào giải đấu:
    ```bash
    cd TesTicTour/backend
    npx ts-node scripts/joinUsersToTournament.ts 60c3c303-6dc2-41cc-9b5c-586af6b388f0
    ```
    *   Thay `YOUR_TOURNAMENT_ID` bằng ID của giải đấu bạn đã lấy.

## Bước 5: Quan sát Luồng Tự động Hoàn Chỉnh (Tự động chuyển vòng và xử lý Match)

*   **QUAN TRỌNG:** Với các thay đổi đã thực hiện, giờ đây bạn chỉ cần theo dõi log của server trong cửa sổ terminal.
*   Cron job `autoRoundAdvanceCron` (chạy mỗi phút) sẽ định kỳ kiểm tra và tự động kích hoạt `RoundService.autoAdvance` cho các vòng đấu:
    *   **Vòng đầu tiên và các vòng tiếp theo:** Tất cả các vòng đấu đều được tạo với `startTime` trong tương lai (5 phút sau thời điểm vòng trước kết thúc hoặc giải đấu được tạo). Cron job `autoRoundAdvanceCron` sẽ "nhặt" vòng đấu này khi `startTime` của nó đến và tự động kích hoạt nó.
*   Các log chi tiết sẽ hiển thị:
    *   Thông báo `Running autoRoundAdvanceCron job...` mỗi phút.
    *   Quá trình `RoundService.autoAdvance` sẽ tạo ra các lobby và match cho vòng đấu hiện tại, và vòng đấu sẽ chuyển sang trạng thái `playing`.
    *   Việc chia lobby (`"random"` hoặc `"seeded"`).
    *   `Created match <matchId> for lobby <lobbyId>.` (Trận đấu được tạo tự động cho mỗi lobby).
    *   `Queued fetch and save match data for match <matchId>.` (Việc lấy kết quả trận đấu giả lập được kích hoạt tự động).
        *   **Lưu ý về Mock API:** Trong môi trường kiểm thử với `MOCK_RIOT_API=true`, `matchIdRiotApi` được tạo giả lập (`crypto.randomUUID()`) ngay khi match được tạo, và `fetchAndSaveMatchData` được gọi ngay lập tức để mô phỏng việc lấy kết quả và cập nhật `matchData` cho `Match` cũng như `fetchedResult` cho `Lobby`. Điều này mô phỏng luồng dữ liệu đầy đủ mà không cần chờ đợi Riot API thực tế. Trong môi trường thực tế (production), `matchIdRiotApi` chỉ có sau khi trận đấu thực sự kết thúc trên Riot Games và việc lấy kết quả sẽ được kích hoạt sau đó.
    *   **QUAN TRỌNG:** Sau khi mỗi trận đấu được xử lý bởi worker và `matchData` được cập nhật, `MatchResultService` sẽ gọi `RoundService.checkRoundCompletionAndAdvance`.
    *   `RoundService.checkRoundCompletionAndAdvance` sẽ kiểm tra xem TẤT CẢ các trận đấu trong vòng đã hoàn tất hay chưa. Nếu rồi, nó sẽ tiến hành:
        *   Xử lý logic loại bỏ/thăng hạng (`"elimination"`, `"checkmate"`) DỰA TRÊN điểm số ĐÃ CẬP NHẬT của người tham gia.
        *   Cập nhật trạng thái vòng đấu thành `completed`.
        *   Nếu có vòng tiếp theo, nó sẽ tạo ra vòng đó.
    *   Kết quả trận đấu giả lập (từ Mock Riot API) và điểm số được cập nhật.
    *   Thông báo người chơi vào trạng thái CHECKMATE.
    *   Thông báo người thắng CHECKMATE và quá trình phát thưởng cuối cùng.
*   Giải đấu sẽ tự động hoàn tất cho đến khi có người thắng CHECKMATE hoặc tất cả các phase/vòng đấu đã kết thúc.

---

Luồng này giờ đây đã được tự động hóa hoàn chỉnh hơn, cho phép bạn kiểm thử một cách liền mạch. Chúc bạn kiểm thử thành công!

## Sử dụng Riot API Thật (Trong Tương Lai)

Khi bạn đã sẵn sàng tích hợp với Riot API thật để lấy dữ liệu trận đấu, hãy làm theo các bước sau:

1.  **Cấu hình Riot API Key:**
    *   Mở file `.env` của bạn.
    *   Đảm bảo bạn đã có `RIOT_API_KEY` được cấu hình với khóa API hợp lệ từ Riot Games.
    *   Thiết lập `MOCK_RIOT_API=false` hoặc xóa dòng này hoàn toàn để tắt chế độ mock.
        ```
        RIOT_API_KEY=YOUR_REAL_RIOT_API_KEY
        MOCK_RIOT_API=false
        ```
2.  **Rebuild và Khởi động lại Server:**
    *   Sau khi thay đổi `.env`, bạn cần rebuild và khởi động lại server:
        ```bash
        npm run build
        npm start
        ```
3.  **Thay đổi cách kích hoạt `fetchMatchData` (Quan trọng):**
    *   Trong môi trường production, bạn sẽ không gọi `MatchService.fetchAndSaveMatchData` ngay lập tức sau khi tạo `Match` như trong môi trường mock.
    *   Thay vào đó, bạn sẽ cần một cơ chế để phát hiện khi một trận đấu Riot Games thực sự kết thúc và có `matchIdRiotApi` khả dụng. Điều này thường liên quan đến:
        *   **Webhook từ Riot Games:** Riot Games có thể gửi webhook khi một trận đấu kết thúc.
        *   **Polling định kỳ:** Một cron job hoặc worker khác sẽ định kỳ kiểm tra các trận đấu đang diễn ra và lấy `matchIdRiotApi` khi chúng hoàn tất.
    *   Sau khi có `matchIdRiotApi` từ một trận đấu thực tế, bạn sẽ gọi `MatchService.fetchAndSaveMatchData` với `matchId` (Prisma ID của match tương ứng) và `matchIdRiotApi` thực tế để lưu dữ liệu trận đấu và xử lý kết quả.

**Lưu ý:** Việc tích hợp Riot API thật đòi hỏi phải tuân thủ các chính sách của Riot Games và quản lý tốc độ gọi API (rate limiting) để tránh bị khóa.

--- 