import { prisma } from './prisma';
import ApiError from '../utils/ApiError';
import { Prisma } from '@prisma/client';

export default class TransactionService {
  private static async _executeTransaction(
    tx: Prisma.TransactionClient | undefined,
    logic: (db: Prisma.TransactionClient) => Promise<any>
  ) {
    if (tx) {
      return logic(tx);
    } else {
      return prisma.$transaction(logic);
    }
  }

  static async entryFee(userId: string, tournamentId: string, amount: number, tx?: Prisma.TransactionClient) {
    return this._executeTransaction(tx, async (db) => {
      const balance = await db.balance.findUnique({ where: { userId } });
      if (!balance || balance.amount < amount) throw new ApiError(400, 'Insufficient balance');
      await db.balance.update({ where: { userId }, data: { amount: { decrement: amount } } });
      await db.transaction.create({ data: { userId, type: 'entry_fee', amount, status: 'success', refId: tournamentId } });
      return true;
    });
  }

  static async refund(userId: string, tournamentId: string, amount: number, tx?: Prisma.TransactionClient) {
    return this._executeTransaction(tx, async (db) => {
      await db.balance.update({ where: { userId }, data: { amount: { increment: amount } } });
      await db.transaction.create({ data: { userId, type: 'refund', amount, status: 'success', refId: tournamentId } });
      return true;
    });
  }

  static async payout(userId: string, rewardId: string, amount: number, tx?: Prisma.TransactionClient) {
    return this._executeTransaction(tx, async (db) => {
      await db.balance.update({ where: { userId }, data: { amount: { increment: amount } } });
      await db.transaction.create({ data: { userId, type: 'reward', amount, status: 'success', refId: rewardId } });
      return true;
    });
  }
} 