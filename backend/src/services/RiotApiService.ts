import axios from 'axios';
import ApiError from '../utils/ApiError';
import { prisma } from './prisma'; // Import prisma

// Add a flag to enable mocking - you can control this via an environment variable
const MOCK_RIOT_API = process.env.MOCK_RIOT_API === 'true';

// --- Mock Data Structure (will be dynamically populated) ---
const baseMockMatchData = {
  "metadata": {
    "dataVersion": "2",
    "matchId": "",
    "participants": [] // Will be populated dynamically
  },
  "info": {
    "gameCreation": 1678886400000,
    "gameDuration": 1800,
    "gameEndTimestamp": 1678888200000,
    "gameId": 1234567890,
    "gameMode": "STANDARD",
    "gameName": "mock-game",
    "gameStartTimestamp": 1678886400000,
    "gameType": "matched",
    "gameVersion": "13.5.1",
    "mapId": 11,
    "participants": [] // Will be populated dynamically with user PUUIDs and mock results
    ,
    "platformId": "NA1",
    "queueId": 1100,
    "tournamentCode": "",
    "teams": []
  }
};

export default class RiotApiService {
  private static RIOT_API_KEY = process.env.RIOT_API_KEY; // Your Riot API key

  static async fetchMatchData(matchId: string, region: string, lobbyId?: string) {
    if (MOCK_RIOT_API) {
      console.log('MOCKING Riot API - Returning dummy match data for', matchId);
      // Simulate a delay for realism
      await new Promise(resolve => setTimeout(resolve, 500));

      const clonedMockData = JSON.parse(JSON.stringify(baseMockMatchData));
      clonedMockData.metadata.matchId = matchId;

      if (lobbyId) {
        // Fetch actual participants for this lobby to use their PUUIDs
        const lobby = await prisma.lobby.findUnique({
          where: { id: lobbyId },
          include: { 
            round: { 
              include: { 
                tournament: { 
                  include: { 
                    participants: { 
                      where: { eliminated: false }, // Only active participants
                      orderBy: { scoreTotal: 'desc' } // Order by score for predictable mock results
                    }
                  }
                }
              }
            }
          }
        });

        if (lobby?.round?.tournament?.participants && lobby.round.tournament.participants.length > 0) {
          const activeParticipants = lobby.round.tournament.participants;
          clonedMockData.metadata.participants = activeParticipants.map(p => p.userId);
          clonedMockData.info.participants = activeParticipants.map((p, index) => ({
            puuid: p.userId,
            placement: index + 1, // Assign placements 1st, 2nd, 3rd, ...
            // Assign points based on placement for mock data
            points: RiotApiService.getMockPointsForPlacement(index + 1, activeParticipants.length)
          }));
        } else {
          console.error(`MOCKING: No active participants found for lobby ${lobbyId}. This might lead to issues.`);
          // If no active participants, return an empty array to avoid using incorrect mock PUUIDs
          clonedMockData.info.participants = [];
        }
      } else {
        console.warn(`MOCKING: No lobbyId provided. Using generic mock data.`);
        // Fallback to generic mock data if no lobbyId
        clonedMockData.info.participants = [
            { puuid: "MOCK_PUUID_1", placement: 1, points: 10 },
            { puuid: "MOCK_PUUID_2", placement: 2, points: 8 },
            { puuid: "MOCK_PUUID_3", placement: 3, points: 7 },
            { puuid: "MOCK_PUUID_4", placement: 4, points: 6 },
            { puuid: "MOCK_PUUID_5", placement: 5, points: 4 },
            { puuid: "MOCK_PUUID_6", placement: 6, points: 3 },
            { puuid: "MOCK_PUUID_7", placement: 7, points: 2 },
            { puuid: "MOCK_PUUID_8", placement: 8, points: 1 }
        ];
      }
      return clonedMockData;
    }

    if (!RiotApiService.RIOT_API_KEY) {
      throw new ApiError(500, 'Riot API key not configured');
    }
    const url = `https://${region}.api.riotgames.com/tft/match/v1/matches/${matchId}`;
    try {
      const response = await axios.get(url, { headers: { 'X-Riot-Token': RiotApiService.RIOT_API_KEY } });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching match data from Riot API:', error.response ? error.response.data : error.message);
      throw new ApiError(error.response ? error.response.status : 500, 'Failed to fetch match data from Riot API');
    }
  }

  private static getMockPointsForPlacement(placement: number, totalParticipants: number): number {
    // Ensure totalParticipants is at least 1
    if (totalParticipants < 1) return 0;
    // Cap placement to totalParticipants
    if (placement > totalParticipants) return 0;

    // Distribute points linearly from 100 down to 0 for the last place.
    // Example: For 8 participants, points could be: 100, 85, 70, 55, 40, 25, 10, 0
    const maxPoints = 100;
    const minPoints = 0; 
    
    // Calculate step size. If only 1 participant, step is 0.
    const step = totalParticipants > 1 ? (maxPoints - minPoints) / (totalParticipants - 1) : 0;

    // Calculate points: maxPoints - (placement - 1) * step
    // Ensure points are non-negative
    const points = Math.max(0, maxPoints - (placement - 1) * step);
    
    // Round to nearest integer
    return Math.round(points);
  }

  static async getSummonerPuuid(gameName: string, gameTag: string, region: string) {
    if (MOCK_RIOT_API) {
      console.log('MOCKING Riot API - Returning dummy PUUID for', gameName, gameTag);
      // Simulate a delay for realism
      await new Promise(resolve => setTimeout(resolve, 200));
      // Return a consistent mock PUUID for testing
      return `MOCK_PUUID_${gameName.replace(/\s/g, '')}_${gameTag}`;
    }

    if (!RiotApiService.RIOT_API_KEY) {
      throw new ApiError(500, 'Riot API key not configured');
    }
    const url = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${gameTag}`;
    try {
      const response = await axios.get(url, { headers: { 'X-Riot-Token': RiotApiService.RIOT_API_KEY } });
      return response.data.puuid;
    } catch (error: any) {
      console.error('Error fetching summoner PUUID:', error.response ? error.response.data : error.message);
      throw new ApiError(error.response ? error.response.status : 500, 'Failed to fetch summoner PUUID');
    }
  }
} 