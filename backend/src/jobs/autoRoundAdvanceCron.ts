import cron from 'node-cron';
import { prisma } from '../services/prisma';
import RoundService from '../services/RoundService';
import logger from '../utils/logger';

// This cron job will run every minute
cron.schedule('* * * * *', async () => {
  logger.info('Running autoRoundAdvanceCron job...');
  try {
    // Find all rounds that are pending and whose startTime is in the past or current
    const roundsToAdvance = await prisma.round.findMany({
      where: {
        status: 'pending',
        startTime: {
          lte: new Date(),
        },
      },
    });

    if (roundsToAdvance.length === 0) {
      logger.info('No rounds to auto-advance at this time.');
      return;
    }

    logger.info(`Found ${roundsToAdvance.length} rounds to auto-advance.`);

    for (const round of roundsToAdvance) {
      try {
        await RoundService.autoAdvance(round.id);
        logger.info(`Successfully auto-advanced round ${round.id}`);
      } catch (error) {
        logger.error(`Failed to auto-advance round ${round.id}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  } catch (error) {
    logger.error(`Error in autoRoundAdvanceCron job: ${error instanceof Error ? error.message : String(error)}`);
  }
}); 