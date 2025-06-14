import { prisma } from './prisma';
import { Prisma } from '@prisma/client';
import logger from '../utils/logger';
import MatchService from './MatchService';
import crypto from 'crypto';

export default class LobbyService {
  static async list(roundId: string) {
    return prisma.lobby.findMany({ where: { roundId } });
  }

  static async create(roundId: string, data: any, tx?: Prisma.TransactionClient) {
    const db = tx || prisma;
    return db.lobby.create({ data: { ...data, roundId } });
  }

  static async autoAssignLobbies(
    roundId: string, 
    participants: any[], 
    lobbySize: number = 8,
    assignmentType: 'random' | 'seeded' = 'random',
    tx?: Prisma.TransactionClient
  ) {
    const db = tx || prisma;
    logger.info(`Assigning lobbies with type: ${assignmentType}`);

    let players = [...participants];

    logger.info(`autoAssignLobbies called with ${players.length} players and lobbySize ${lobbySize}. Expected lobbies: ${Math.ceil(players.length / lobbySize)}`);

    if (assignmentType === 'random') {
      // Fisher-Yates shuffle
      for (let i = players.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [players[i], players[j]] = [players[j], players[i]];
      }
    } else if (assignmentType === 'seeded') {
      // Sort by score, highest to lowest. Assumes higher score = better seed.
      players.sort((a, b) => (b.scoreTotal ?? 0) - (a.scoreTotal ?? 0));
    }

    const lobbies = [];
    let lobbyCount = 1;
    for (let i = 0; i < players.length; i += lobbySize) {
      const lobbyParticipants = players.slice(i, i + lobbySize);
      const participantIds = lobbyParticipants.map(p => p.id);
      
      logger.info(`Creating lobby ${lobbyCount} with ${lobbyParticipants.length} participants.`);
      
      const newLobby = await db.lobby.create({
        data: {
          roundId,
          name: `Lobby ${lobbyCount++}`,
          participants: participantIds
        }
      });
      lobbies.push(newLobby);

      // Automatically create a match for this lobby
      const newMatch = await MatchService.create(newLobby.id, { 
        matchIdRiotApi: crypto.randomUUID()
      }, db);
      logger.info(`Created match ${newMatch.id} for lobby ${newLobby.id}.`);

      // Automatically fetch and save match data (mocked)
      await MatchService.fetchAndSaveMatchData(newMatch.id, newMatch.matchIdRiotApi as string);
      logger.info(`Queued fetch and save match data for match ${newMatch.id}.`);
    }
    
    logger.info(`Created ${lobbies.length} lobbies for round ${roundId}.`);
    return lobbies;
  }
}