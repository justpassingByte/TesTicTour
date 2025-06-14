import { Worker } from 'bullmq';
import 'dotenv/config';
import fetchMatchData from './jobs/fetchMatchData';
import logger from './utils/logger';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379
};

// Worker for fetching match data
const matchDataWorker = new Worker(
  'fetchMatchData', // This must match the queue name
  async job => {
    logger.info(`MatchDataWorker: Processing job ${job.id} of type ${job.name}`);
    return fetchMatchData(job);
  },
  {
    connection,
    concurrency: 5, // Process up to 5 jobs concurrently
  }
);

matchDataWorker.on('completed', job => {
  logger.info(`MatchDataWorker: Job ${job.id} completed successfully.`);
});

matchDataWorker.on('failed', (job, err) => {
  logger.error(`MatchDataWorker: Job ${job?.id} failed with error: ${err.message}`, err);
});

logger.info('MatchDataWorker started. Waiting for jobs...'); 