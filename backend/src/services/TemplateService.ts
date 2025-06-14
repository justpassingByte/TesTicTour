import { prisma } from './prisma';
import ApiError from '../utils/ApiError';

export default class TemplateService {
  static async list() {
    return prisma.tournamentTemplate.findMany();
  }
  static async create(data: {
    name: string;
    roundsTotal: number;
    maxPlayers: number;
    entryFee: number;
    prizeStructure: any;
    hostFeePercent: number;
    expectedParticipants: number;
    scheduleType: string;
    startTime: string;
    phases: any;
  }, createdById: string) {
    return prisma.tournamentTemplate.create({ data: { ...data, createdById } });
  }
  static async detail(id: string) {
    const template = await prisma.tournamentTemplate.findUnique({ where: { id } });
    if (!template) throw new ApiError(404, 'Template not found');
    return template;
  }
  static async update(id: string, data: any) {
    return prisma.tournamentTemplate.update({ where: { id }, data });
  }
  static async remove(id: string) {
    return prisma.tournamentTemplate.delete({ where: { id } });
  }
} 