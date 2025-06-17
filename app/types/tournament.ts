import { IUser } from "./user";
import { IRiotMatchData } from './riot';

export type PrizeStructure = Record<string, number>;

export interface IAdvancementConditionTopN {
  type: "top_n_scores";
  value: number;
}

export interface IAdvancementConditionPlacement {
  type: "placement";
  value: number;
}

export interface IAdvancementConditionCheckmate {
  winCondition: string;
  pointsToActivate: number;
}

export interface IPhaseConfig {
  id: string;
  name: string;
  type: 'elimination' | 'points' | 'checkmate' | 'swiss' | 'round_robin';
  lobbySize?: number;
  lobbyAssignment?: 'random' | 'seeded';
  advancementCondition?: IAdvancementConditionTopN | IAdvancementConditionPlacement | IAdvancementConditionCheckmate;
  matchesPerRound?: number;
  eliminationRule?: string;
}

export interface IPhase {
  id: string;
  tournamentId: string;
  name:string;
  phaseNumber: number;
  type: string;
  lobbySize?: number;
  lobbyAssignment?: string;
  advancementCondition?: IPhaseConfig['advancementCondition'];
  matchesPerRound?: number;
  eliminationRule?: string;
  status: string;
  rounds: IRound[];
  tieBreakerRule?: string;
  pointsMapping?: Record<string, number>;
  carryOverScores?: boolean;
}

export interface IRound {
  id: string;
  phaseId: string;
  roundNumber: number;
  startTime: Date;
  endTime: Date | null;
  status: 'pending' | 'in_progress' | 'completed';
  lobbies?: ILobby[];
  matches?: IMatch[];
  completed: boolean;
}

export interface IParticipant {
  id: string;
  tournamentId: string;
  userId?: string;
  inGameName: string;
  gameSpecificId: string;
  region: string;
  rank: string;
  user?: IUser;
  paid?: boolean;
  eliminated?: boolean;
}

export type PlayerRoundStats = {
  id: string;
  name: string;
  region: string;
  lobbyName: string;
  placements: number[];
  points: number[];
  total: number;
  status: "advanced" | "eliminated";
};

export interface ILobby {
  id: string;
  roundId: string;
  name: string;
  participants: string[]; // This will be participant IDs
  participantDetails?: IParticipant[];
  matches?: IMatch[];
  matchId: string | null;
  fetchedResult: boolean;
}

export interface IMatch {
  id: string;
  lobbyId: string;
  riotMatchId?: string;
  status: string;
  matchData?: IRiotMatchData;
}

export interface IMatchResult {
  matchId: string;
  participantId: string;
  placement: number;
  points: number;
}

export interface ITournamentTemplate {
  name: string;
  description?: string | null;
  image?: string | null;
  region?: string | null;
  status: string;
  startTime: Date;
  endTime?: Date;
  maxPlayers: number;
  entryFee: number;
  registrationDeadline: Date;
  prizeStructure?: PrizeStructure;
  hostFeePercent?: number;
  expectedParticipants?: number;
  actualParticipantsCount?: number;
  adjustedPrizeStructure?: PrizeStructure;
  config: { phases: IPhaseConfig[] };
  roundsTotal: number;
  templateId?: string;
}

export interface ITournament extends ITournamentTemplate {
  id: string;
  organizerId: string;
  organizer: IUser;
  status: string;
  createdAt: string;
  updatedAt?: string;
  registered?: number | null;
  image?: string | null;
  region?: string | null;
  phases: IPhase[];
  participants?: IParticipant[];
} 