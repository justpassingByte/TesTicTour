import { Job } from 'bullmq';
import RiotApiService from '../services/RiotApiService';
import { prisma } from '../services/prisma';
import MatchResultService from '../services/MatchResultService';
import logger from '../utils/logger';

export default async function fetchMatchData(job: Job) {
  const { matchId, riotMatchId, region, lobbyId } = job.data;
  logger.info(`Processing fetchMatchData job for match ID: ${matchId}, Riot Match ID: ${riotMatchId}, region: ${region}, lobbyId: ${lobbyId}`);
  try {
    const riotMatchData = await RiotApiService.fetchMatchData(riotMatchId, region, lobbyId);
    logger.info(`Fetched riotMatchData for match ID: ${matchId}`, { riotMatchData: JSON.stringify(riotMatchData)?.substring(0, 500) + '...' });

    let dbMatch;
    const existingMatch = await prisma.match.findUnique({ where: { id: matchId } });

    if (existingMatch) {
      logger.info(`Updating existing match ${existingMatch.id} with new data.`);
      dbMatch = await prisma.match.update({
        where: { id: existingMatch.id },
        data: { matchData: riotMatchData, fetchedAt: new Date() },
      });
    } else {
      logger.info(`Creating new match with matchIdRiotApi: ${riotMatchId}, lobbyId: ${lobbyId}, Prisma match ID: ${matchId}.`);
      dbMatch = await prisma.match.create({
        data: {
          id: matchId,
          matchIdRiotApi: riotMatchId,
          lobbyId: lobbyId,
          fetchedAt: new Date(),
          matchData: riotMatchData,
        },
      });
    }
    logger.info(`Match data saved for dbMatch ID: ${dbMatch.id}. Now processing match results.`);

    await MatchResultService.processMatchResults(dbMatch.id, riotMatchData);
    logger.info(`Match results processed for dbMatch ID: ${dbMatch.id}.`);

    return { message: 'Fetched, saved, and processed match data', matchId };
  } catch (err: any) {
    logger.error(`fetchMatchData error for match ID: ${matchId}: ${err.message}`, err);
    return { message: 'fetchMatchData error', error: err.message, matchId };
  }
} 