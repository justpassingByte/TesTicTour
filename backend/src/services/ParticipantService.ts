import { prisma } from './prisma';
import ApiError from '../utils/ApiError';
import TransactionService from './TransactionService';
import { Prisma } from '@prisma/client';

export default class ParticipantService {
  static async join(tournamentId: string, userId: string) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const tournament = await tx.tournament.findUnique({ where: { id: tournamentId } });
      if (!tournament) throw new ApiError(404, 'Tournament not found');

      // Check if user is already a participant
      const existingParticipant = await tx.participant.findFirst({
        where: {
          tournamentId: tournamentId,
          userId: userId,
        },
      });

      if (existingParticipant) {
        throw new ApiError(409, 'User already joined this tournament');
      }

      const entryFee = (tournament as any).entryFee || 0;
      const balance = await tx.balance.findUnique({ where: { userId } });
      if (!balance || balance.amount < entryFee) throw new ApiError(400, 'Insufficient balance');
      await tx.balance.update({ where: { userId }, data: { amount: { decrement: entryFee } } });
      const participant = await tx.participant.create({ data: { tournamentId, userId, paid: true } });
      return participant;
    });
  }
  static async list(tournamentId: string) {
    return prisma.participant.findMany({ where: { tournamentId }, include: { user: true } });
  }
  static async update(participantId: string, data: any) {
    return prisma.participant.update({ where: { id: participantId }, data });
  }
  static async remove(participantId: string) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const participant = await tx.participant.findUnique({ where: { id: participantId } });
      if (!participant) throw new ApiError(404, 'Participant not found');
      const tournament = await tx.tournament.findUnique({ where: { id: participant.tournamentId } });
      if (!tournament) throw new ApiError(404, 'Tournament not found');
      // Only refund if tournament chưa bắt đầu
      if (tournament.status === 'pending' && participant.paid) {
        const entryFee = (tournament as any).entryFee || 0;
        await TransactionService.refund(participant.userId, tournament.id, entryFee);
      }
      return tx.participant.delete({ where: { id: participantId } });
    });
  }
} 