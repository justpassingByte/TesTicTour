import { prisma } from './prisma';
import ApiError from '../utils/ApiError';
import PrizeCalculationService from './PrizeCalculationService';
import { Prisma } from '@prisma/client';

export default class TournamentService {
  static async list() {
    return prisma.tournament.findMany({ include: { organizer: true } });
  }

  static async detail(id: string) {
    const tournament = await prisma.tournament.findUnique({ where: { id }, include: { organizer: true } });
    if (!tournament) throw new ApiError(404, 'Tournament not found');
    return tournament;
  }

  static async create(data: {
    name: string;
    startTime: Date;
    maxPlayers: number;
    organizerId: string;
    roundsTotal: number;
    entryFee: number;
    registrationDeadline: Date;
    prizeStructure?: any;
    hostFeePercent?: number;
    expectedParticipants?: number;
    templateId?: string;
  }) {
    let templateData: any = {};
    let finalStartTime = data.startTime; // Initialize with the provided startTime

    if (data.templateId) {
      const template = await prisma.tournamentTemplate.findUnique({ where: { id: data.templateId } });
      if (!template) throw new ApiError(400, 'Template not found');

      templateData = {
        templateId: template.id,
        prizeStructure: template.prizeStructure,
        hostFeePercent: template.hostFeePercent,
        expectedParticipants: template.expectedParticipants,
        status: 'pending',
        config: { phases: (template as any).phases }
      };

      // If the provided startTime is invalid and template is daily, calculate from template's startTime string
      if (
        template.scheduleType === 'daily' &&
        (!(finalStartTime instanceof Date) || isNaN(finalStartTime.getTime()))
      ) {
        const [hours, minutes] = template.startTime.split(':').map(Number);
        const now = new Date();
        // Set today's date with template's time
        finalStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);
      }
    }

    const finalConfig = data.templateId ? templateData.config : (data as any).config || {};

    return prisma.tournament.create({
      data: {
        ...data,
        ...templateData,
        startTime: finalStartTime, // Use the calculated/validated startTime
        status: (templateData as any).status || 'pending',
        registrationDeadline: data.registrationDeadline || (templateData as any).registrationDeadline || new Date(),
        prizeStructure: (templateData as any).prizeStructure || {},
        expectedParticipants: (templateData as any).expectedParticipants || 0,
        config: finalConfig
      }
    });
  }

  static async update(id: string, data: any) {
    return prisma.tournament.update({ where: { id }, data });
  }

  static async remove(id: string) {
    return prisma.tournament.delete({ where: { id } });
  }

  // Call this when registration closes
  static async finalizeRegistration(tournamentId: string, tx?: Prisma.TransactionClient) {
    const logic = async (db: Prisma.TransactionClient) => {
      const tournament = await db.tournament.findUnique({ where: { id: tournamentId } });
      if (!tournament) throw new ApiError(404, 'Tournament not found');

      const actualCount = await db.participant.count({ where: { tournamentId } });
      const entryFee = (tournament as any).entryFee || 0;
      const hostFeePercent = (tournament as any).hostFeePercent || 0.1;
      const originalPrize = tournament.prizeStructure as any;
      
      const { adjusted } = PrizeCalculationService.autoAdjustPrizeStructure(
        originalPrize,
        actualCount,
        entryFee,
        hostFeePercent
      );

      return db.tournament.update({
        where: { id: tournamentId },
        data: {
          actualParticipantsCount: actualCount,
          adjustedPrizeStructure: adjusted,
        },
      });
    };

    if (tx) {
      return logic(tx);
    } else {
      return prisma.$transaction(logic);
    }
  }
} 