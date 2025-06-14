import logger from '../utils/logger';

type PrizeStructure = Record<string, number>; // e.g. { '1': 400000, '2': 300000, ... }

export default class PrizeCalculationService {
  /**
   * Adjusts the prize structure so that total payout <= prizePool, prioritizing top ranks
   */
  static autoAdjustPrizeStructure(
    original: PrizeStructure,
    actualParticipants: number,
    entryFee: number,
    hostFeePercent: number
  ): { adjusted: PrizeStructure; prizePool: number; hostFee: number } {
    logger.info(
      `Starting prize structure adjustment with actualParticipants: ${actualParticipants}, entryFee: ${entryFee}, hostFeePercent: ${hostFeePercent}`,
      { original }
    );

    const totalCollected = actualParticipants * entryFee;
    const hostFee = Math.max(Math.floor(totalCollected * hostFeePercent), 0);
    const prizePool = totalCollected - hostFee;

    logger.info(`Calculated totalCollected: ${totalCollected}, hostFee: ${hostFee}, prizePool: ${prizePool}`);

    // Sort by rank (1,2,3...)
    const sortedRanks = Object.keys(original).sort((a, b) => Number(a) - Number(b));
    let remaining = prizePool;
    const adjusted: PrizeStructure = {};
    for (const rank of sortedRanks) {
      const want = original[rank];
      if (remaining >= want) {
        adjusted[rank] = want;
        remaining -= want;
      } else if (remaining > 0) {
        adjusted[rank] = remaining;
        remaining = 0;
      } else {
        logger.warn(`No remaining prize pool for rank ${rank}. Stopping adjustment.`);
        break;
      }
    }

    logger.info(`Finished prize structure adjustment. Adjusted prize:`, { adjusted, prizePool, hostFee });
    return { adjusted, prizePool, hostFee };
  }
} 