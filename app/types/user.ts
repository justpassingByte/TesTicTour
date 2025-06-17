export interface IUser {
  id: string;
  username: string;
  email: string;
  role: string;
  puuid?: string;
  riotGameName?: string;
  riotGameTag?: string;
  region: string;
  createdAt: Date;
} 