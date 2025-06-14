import { prisma } from './prisma';
import ApiError from '../utils/ApiError';
import TournamentService from './TournamentService';
import TransactionService from './TransactionService';
import LobbyService from './LobbyService';
import logger from '../utils/logger';
import { Prisma, Round, Tournament, Participant } from '@prisma/client';

// Assume we have access to io (Socket.IO server) via global or injected
const io = (global as any).io;

export default class RoundService {
  static async list(tournamentId: string) {
    return prisma.round.findMany({ where: { tournamentId }, include: { lobbies: true } });
  }

  static async create(tournamentId: string, data: {
    roundNumber: number;
    startTime: Date;
    status?: string;
  }) {
    const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } });
    if (!tournament) throw new ApiError(404, 'Tournament not found for round creation');

    const phases = (tournament.config as any)?.phases;
    if (!phases || !Array.isArray(phases) || phases.length < data.roundNumber) {
      throw new ApiError(400, `Phase configuration for round ${data.roundNumber} not found in template.`);
    }

    const phaseConfig = phases[data.roundNumber - 1];
    logger.info(`Creating round ${data.roundNumber} for tournament ${tournamentId} with phase config`, { phaseConfig });

    const createData: any = {
      tournamentId,
      roundNumber: data.roundNumber,
      startTime: data.startTime,
      status: data.status || 'pending',
      config: phaseConfig,
    };

    return prisma.round.create({
      data: createData,
    });
  }

  static async autoAdvance(roundId: string) {
    logger.info(`Starting auto-advance for round ID: ${roundId}`);
    try {
      return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const round = await tx.round.findUnique({
          where: { id: roundId },
          include: { tournament: { include: { participants: true } } },
        });

        const typedRound = round as any;
        if (!typedRound || !typedRound.tournament) {
          throw new ApiError(404, 'Round or tournament not found');
        }

        // Update round status to 'playing'
        await tx.round.update({
          where: { id: typedRound.id },
          data: { status: 'playing' },
        });
        logger.info(`Round ${typedRound.id} status updated to 'playing'.`);

        const { tournament } = typedRound;
        const phaseConfig = typedRound.config;
        if (!phaseConfig || !phaseConfig.type) {
          throw new ApiError(400, `Missing phase configuration for round ${roundId}`);
        }

        logger.info(`Processing phase ${typedRound.roundNumber} ('${phaseConfig.type}') for tournament ${tournament.id}`);

        if (typedRound.roundNumber === 1) {
          logger.info(`Finalizing registration for tournament ${tournament.id} (Phase 1)`);
          await TournamentService.finalizeRegistration(tournament.id, tx);
      }

        const activeParticipants = tournament.participants.filter((p: any) => !p.eliminated);

        // Create lobbies and matches for the current round
        const lobbySize = phaseConfig.lobbySize || 8;
        const lobbyAssignment = phaseConfig.lobbyAssignment || 'random';

        logger.info(`Assigning lobbies for Round ${typedRound.roundNumber} with ${activeParticipants.length} participants (Size: ${lobbySize}, Assignment: ${lobbyAssignment}).`);
        await LobbyService.autoAssignLobbies(typedRound.id, activeParticipants, lobbySize, lobbyAssignment, tx);
        logger.info(`Lobbies assigned for round ${typedRound.id}.`);

        // The round status will be updated to 'completed' after all matches are processed
        // This function now only creates the round and its initial lobbies/matches
        return { message: `Round ${typedRound.roundNumber} (phase ${phaseConfig.type}) started and lobbies/matches created.` };
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`Error during auto-advance for round ID: ${roundId}: ${errorMessage}`, error instanceof Error ? error : new Error(errorMessage));
      throw error;
    }
  }

  static async checkRoundCompletionAndAdvance(roundId: string) {
    logger.info(`Checking round completion and advancement for round ID: ${roundId}`);
    try {
      return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const round = await tx.round.findUnique({
          where: { id: roundId },
          include: {
            tournament: { include: { participants: true, rounds: { include: { lobbies: true } } } },
            lobbies: { include: { matches: true } } // Include matches within lobbies
          },
        });

        const typedRound = round as any;
        if (!typedRound || !typedRound.tournament) {
          throw new ApiError(404, 'Round or tournament not found');
        }

        const phaseConfig = typedRound.config;
        if (!phaseConfig || !phaseConfig.type) {
          throw new ApiError(400, `Missing phase configuration for round ${roundId}`);
        }

        // Check if all matches in this round have been fetched
        const allLobbies = typedRound.lobbies;
        const allMatchesProcessed = allLobbies.every((lobby: any) => 
          lobby.matches.every((match: any) => match.matchData !== null && match.matchData !== undefined)
        );

        if (!allMatchesProcessed) {
          logger.info(`Round ${roundId}: Not all matches have been processed yet. Skipping advancement.`);
          return { message: `Round ${roundId}: Not all matches processed.` };
        }

        logger.info(`All matches processed for round ${roundId}. Proceeding with advancement logic.`);

        const activeParticipants = typedRound.tournament.participants.filter((p: any) => !p.eliminated);

        switch (phaseConfig.type) {
          case 'elimination':
            await this._performEliminationOrAdvancement(tx, typedRound, typedRound.tournament, activeParticipants, phaseConfig);
            break;
          case 'points':
            await this._performEliminationOrAdvancement(tx, typedRound, typedRound.tournament, activeParticipants, phaseConfig);
            break;
          case 'checkmate':
            await this._performCheckmateAdvancement(tx, typedRound, typedRound.tournament, activeParticipants, phaseConfig);
            break;
          default:
            throw new ApiError(400, `Unknown phase type: ${phaseConfig.type}`);
        }

        // Mark the current round as completed
        await tx.round.update({ where: { id: typedRound.id }, data: { status: 'completed' } });
        logger.info(`Round ${typedRound.id} status updated to 'completed'.`);

        return { message: `Round ${typedRound.roundNumber} (phase ${phaseConfig.type}) completed and advanced.` };
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`Error during round completion check and advancement for round ID: ${roundId}: ${errorMessage}`, error instanceof Error ? error : new Error(errorMessage));
      throw error;
    }
  }

  private static async _performEliminationOrAdvancement(tx: Prisma.TransactionClient, round: any, tournament: any, participants: any[], phaseConfig: any) {
    const { advancementCondition } = phaseConfig;
    if (!advancementCondition || !advancementCondition.top) {
      throw new ApiError(400, `Invalid advancement condition for elimination/points phase: ${JSON.stringify(advancementCondition)}`);
    }

    const sorted = [...participants].sort((a, b) => (b.scoreTotal ?? 0) - (a.scoreTotal ?? 0));
    const toAdvanceCount = advancementCondition.top;

    if (sorted.length > toAdvanceCount) {
      const toEliminate = sorted.slice(toAdvanceCount);
      for (const participant of toEliminate) {
        await tx.participant.update({ where: { id: participant.id }, data: { eliminated: true } });
        logger.info(`Eliminated participant ${participant.userId} with score ${participant.scoreTotal}`);
      }
      logger.info(`${toEliminate.length} participants eliminated.`);
    }

    const nextRoundNumber = round.roundNumber + 1;
    const totalPhases = (tournament.config as any)?.phases.length || tournament.roundsTotal;

    if (nextRoundNumber > totalPhases) {
      logger.info(`Final phase completed for tournament ${tournament.id}. Initiating prize payout.`);
      const finalWinners = sorted.slice(0, toAdvanceCount);
      await this._payoutPrizes(tx, tournament, finalWinners);
    } else {
      await this._createNextRound(tx, tournament, nextRoundNumber);
    }
    return { message: `Elimination/Points phase ${round.roundNumber} processed.` };
  }

  private static async _performCheckmateAdvancement(tx: Prisma.TransactionClient, round: any, tournament: any, participants: any[], phaseConfig: any) {
    logger.info(`Concluding checkmate phase ${round.roundNumber}. No one is eliminated at this stage, advancement to next round or payout.`);

    const nextRoundNumber = round.roundNumber + 1;
    const totalPhases = (tournament.config as any)?.phases.length || tournament.roundsTotal;

    if (nextRoundNumber > totalPhases) {
      logger.info(`Max rounds for checkmate reached. Finalizing tournament ${tournament.id} based on score.`);
      const sorted = [...participants].sort((a, b) => (b.scoreTotal ?? 0) - (a.scoreTotal ?? 0));
      await this._payoutPrizes(tx, tournament, sorted);
      } else {
      await this._createNextRound(tx, tournament, nextRoundNumber);
    }
    return { message: `Checkmate phase ${round.roundNumber} concluded. Awaiting next match or winner.` };
  }

  private static async _createNextRound(tx: Prisma.TransactionClient, tournament: any, nextRoundNumber: number) {
    logger.info(`Creating next round (Phase ${nextRoundNumber}) for tournament ${tournament.id}`);

    // Determine the configuration for the next round
    let targetPhaseConfig = null;

    // Get the previous round to determine current phase config
    const currentTournamentRound = await tx.round.findFirst({
      where: { tournamentId: tournament.id, roundNumber: nextRoundNumber - 1 },
    });

    const currentPhaseConfig = (currentTournamentRound?.config as any);

    if (currentPhaseConfig?.type === 'points' && currentPhaseConfig.totalRoundsInPhase && currentTournamentRound && currentTournamentRound.roundNumber < currentPhaseConfig.totalRoundsInPhase) {
      logger.info(`Continuing 'points' phase. Creating round ${nextRoundNumber} with same phase config as round ${currentTournamentRound.roundNumber}.`);
      targetPhaseConfig = currentPhaseConfig;
    } else {
      // Otherwise, move to the next phase in the tournament configuration
      targetPhaseConfig = (tournament.config as any)?.phases[nextRoundNumber - 1];
    }

    if (!targetPhaseConfig) {
      throw new ApiError(400, `Cannot create round ${nextRoundNumber}: Phase config not found.`);
    }

    const nextRoundData: any = {
      tournamentId: tournament.id,
      roundNumber: nextRoundNumber,
      startTime: new Date(Date.now() + 1000 * 60 * 5), // 5 mins from now (demo)
      status: 'pending',
      config: targetPhaseConfig,
    };

    const nextRound = await tx.round.create({
      data: nextRoundData,
    });
    logger.info(`Next round created with ID: ${nextRound.id}`);

    const nextParticipants = await tx.participant.findMany({ where: { tournamentId: tournament.id, eliminated: false } });
    const lobbySize = targetPhaseConfig.lobbySize || 8; // Get lobby size from config
    const lobbyAssignment = targetPhaseConfig.lobbyAssignment || 'random';

    logger.info(`Assigning lobbies for Round ${nextRound.roundNumber} with ${nextParticipants.length} participants (Size: ${lobbySize}, Assignment: ${lobbyAssignment}).`);
    await LobbyService.autoAssignLobbies(nextRound.id, nextParticipants, lobbySize, lobbyAssignment, tx);
    logger.info(`Lobbies assigned for next round ${nextRound.id}.`);

    if (io) {
      io.to(`tournament:${tournament.id}`).emit('tournament_update', { type: 'round_advanced', round: nextRound });
      logger.info(`Emitted 'round_advanced' event for tournament ${tournament.id}.`);
    }
  }

  private static async _payoutPrizes(tx: Prisma.TransactionClient, tournament: any, winners: any[]) {
    logger.info(`Paying out prizes for ${winners.length} winner(s) in tournament ${tournament.id}.`);
    const prize = tournament.adjustedPrizeStructure as any;
    if (!prize) {
      logger.warn(`No prize structure found for tournament ${tournament.id}. Skipping payout.`);
      return;
    }

    // This is a simplified payout. A real scenario needs to handle ties.
    for (let i = 0; i < winners.length; i++) {
      const winner = winners[i];
      const rank = i + 1;
      const amount = prize[rank.toString()];

      if (amount) {
        await TransactionService.payout(winner.userId, tournament.id, amount, tx);
        logger.info(`Paid out ${amount} to winner ${winner.userId} for rank ${rank}.`);
        if (io) {
          io.to(`user:${winner.userId}`).emit('tournament_update', { type: 'reward', tournamentId: tournament.id, amount });
          logger.info(`Emitted 'reward' event to user ${winner.userId}.`);
        }
      } else {
        logger.warn(`No prize amount defined for rank ${rank} for participant ${winner.userId}.`);
      }
    }
    
    await tx.tournament.update({
        where: { id: tournament.id },
        data: { status: 'completed' }
    });
    logger.info(`Tournament ${tournament.id} status updated to 'completed'.`);
  }

  static async lobbies(roundId: string) {
    return prisma.lobby.findMany({ where: { roundId } });
  }
} 