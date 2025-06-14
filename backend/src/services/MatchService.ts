import { prisma } from './prisma';
import { Queue } from 'bullmq';
import { Prisma } from '@prisma/client';

const fetchMatchDataQueue = new Queue('fetchMatchData', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379
  }
});

export default class MatchService {
  static async list(lobbyId: string) {
    return prisma.match.findMany({ where: { lobbyId } });
  }
  static async create(lobbyId: string, data: any, tx?: Prisma.TransactionClient) {
    const db = tx || prisma;
    return db.match.create({ data: { ...data, lobbyId } });
  }
  static async results(matchId: string) {
    return prisma.matchResult.findMany({ where: { matchId } });
  }
  static async updateResults(matchId: string, data: any) {
    // Update match results, recalculate points, update participant score
    // data: [{ userId, placement, points }]
    return prisma.$transaction(async (tx: any) => {
      for (const result of data) {
        await tx.matchResult.upsert({
          where: { matchId_userId: { matchId, userId: result.userId } },
          update: { placement: result.placement, points: result.points },
          create: { matchId, userId: result.userId, placement: result.placement, points: result.points }
        });
        // Update participant score
        const participant = await tx.participant.findFirst({ where: { userId: result.userId } });
        if (participant) {
          await tx.participant.update({ where: { id: participant.id }, data: { scoreTotal: { increment: result.points } } });
        }
      }
      return { message: 'Results updated', matchId };
    });
  }
  static async fetchAndSaveMatchData(matchId: string, riotMatchId: string, region: string = 'asia') {
    await fetchMatchDataQueue.add('fetchMatchData', { matchId, riotMatchId, region });
    return { message: 'Job queued', matchId };
  }
} 