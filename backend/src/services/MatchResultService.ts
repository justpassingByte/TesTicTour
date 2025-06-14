import { prisma } from './prisma';
import ApiError from '../utils/ApiError';
import { Prisma } from '@prisma/client';
import logger from '../utils/logger';
import RoundService from './RoundService';

export default class MatchResultService {
  static async processMatchResults(matchId: string, matchData: any) {
    logger.info(`Starting to process match results for match ID: ${matchId}`, { matchData });
    try {
      return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const match = await tx.match.findUnique({
          where: { id: matchId },
          include: { lobby: { include: { round: { include: { tournament: true } } } } }
        });

        if (!match || !match.lobby || !match.lobby.round || !match.lobby.round.tournament) {
          throw new ApiError(404, 'Match, lobby, round, or tournament not found');
        }

        const { round } = match.lobby;
        const tournament = round.tournament;
        const phaseConfig = (round as any).config as any;

        if (matchData?.info?.participants) {
          for (const p of matchData.info.participants) {
            const participant = await tx.participant.findFirst({
              where: { userId: p.puuid, tournamentId: tournament.id },
            });

            if (!participant) {
              logger.warn(`Participant not found for user ID: ${p.puuid} in tournament ${tournament.id}.`);
              continue;
            }

            const updatedParticipant = await tx.participant.update({
              where: { id: participant.id },
              data: { scoreTotal: { increment: p.points } },
            });
            logger.info(`Updated score for participant ${participant.userId}. New score: ${updatedParticipant.scoreTotal}`);
            
            // Log individual match result for testing
            logger.info(`Match ${matchId} - Participant ${p.puuid} (${participant.userId}): Placement ${p.placement}, Points ${p.points}`);

            // Upsert MatchResult
            await tx.matchResult.upsert({
              where: { matchId_userId: { matchId: matchId, userId: p.puuid } },
              update: { placement: p.placement, points: p.points },
              create: { matchId: matchId, userId: p.puuid, placement: p.placement, points: p.points },
            });
            
            // Checkmate logic
            if (phaseConfig?.type === 'checkmate') {
              const pointsToActivate = phaseConfig.advancementCondition?.pointsToActivate;
              if (pointsToActivate && (updatedParticipant as any).scoreTotal >= pointsToActivate && !(updatedParticipant as any).checkmateActive) {
                await tx.participant.update({
                  where: { id: updatedParticipant.id },
                  data: { checkmateActive: true } as any
                });
                logger.info(`Participant ${updatedParticipant.userId} is now in CHECKMATE!`);
              }
              
              const finalParticipantState = await tx.participant.findUnique({ where: { id: updatedParticipant.id } });

              if ((finalParticipantState as any)?.checkmateActive && p.placement === 1) {
                logger.info(`CHECKMATE WINNER! Participant ${(finalParticipantState as any).userId} won the tournament!`);
                
                await (RoundService as any)._payoutPrizes(tx, tournament, [finalParticipantState]);
                
                await tx.match.update({
                  where: { id: matchId },
                  data: { matchData: matchData } as any
                });
                return { message: `Checkmate winner found. Tournament ${tournament.id} concluded.` };
              }
            }
          }
        }

        await tx.match.update({
          where: { id: matchId },
          data: { matchData: matchData } as any
        });

        // Update the lobby's fetchedResult status
        await tx.lobby.update({
            where: { id: match.lobby.id },
            data: { fetchedResult: true }
        });
        logger.info(`Lobby ${match.lobby.id} marked as fetchedResult.`);

        logger.info(`Match ${matchId} marked as processed.`);

        // After processing this match, check if the round is complete and should advance
        await RoundService.checkRoundCompletionAndAdvance(round.id);

        return { message: 'Match results processed and participant scores updated', matchId };
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`Error processing match results for match ID: ${matchId}: ${errorMessage}`, error instanceof Error ? error : new Error(errorMessage));
      throw error;
    }
  }
} 