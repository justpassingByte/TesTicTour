import { IMatch, IMatchResult } from '../types/tournament';
import api from '../lib/apiConfig';

export class MatchService {
  static async list(lobbyId: string): Promise<IMatch[]> {
    try {
      const response = await api.get(`/lobbies/${lobbyId}/matches`);
      const matches: IMatch[] = response.data;
      return matches;
      } catch  {
      console.error('Error fetching matches:');
      throw new Error('Error fetching matches');
    }
  }

  static async create(lobbyId: string, data: Partial<IMatch>): Promise<IMatch> {
    try {
      const response = await api.post(`/lobbies/${lobbyId}/matches`, data);
      const match: IMatch = response.data;
      return match;
    } catch  {
      console.error('Error creating match:');
      throw new Error('Error creating match');
    }
  }

  static async results(matchId: string): Promise<IMatchResult[]> {
    try {
      const response = await api.get(`/matches/${matchId}/results`);
      const results: IMatchResult[] = response.data;
      return results;
    } catch  {
      console.error('Error fetching match results:');
      throw new Error('Error fetching match results');
    }
  }

  static async updateResults(matchId: string, data: IMatchResult[]): Promise<{ message: string; matchId: string }> {
    try {
      const response = await api.put(`/matches/${matchId}/results`, data);
      const result: { message: string; matchId: string } = response.data;
      return result;
    } catch  {
      console.error('Error updating match results:');
      throw new Error('Error updating match results');
    }
  }

  static async fetchAndSaveMatchData(matchId: string, riotMatchId: string, region: string = 'asia'): Promise<{ message: string; matchId: string }> {
    try {
      const response = await api.post(`/matches/${matchId}/fetch-data`, { riotMatchId, region });
      const result: { message: string; matchId: string } = response.data;
      return result;
    } catch  {
      console.error('Error queuing match data fetch:');
      throw new Error('Error queuing match data fetch');
    }
  }
} 