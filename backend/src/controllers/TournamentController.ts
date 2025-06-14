import { Request, Response, NextFunction } from 'express';
import TournamentService from '../services/TournamentService.js';
import ApiError from '../utils/ApiError.js';
import { prisma } from '../services/prisma.js';
import RoundService from '../services/RoundService.js';

const TournamentController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await TournamentService.list();
      res.json({ tournaments: data });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await TournamentService.create({
        name: req.body.name,
        startTime: new Date(req.body.startTime),
        maxPlayers: req.body.maxPlayers,
        roundsTotal: req.body.roundsTotal,
        entryFee: req.body.entryFee,
        organizerId: (req as any).user.id,
        registrationDeadline: new Date(req.body.registrationDeadline)
      });
      res.json({ tournament: data });
    } catch (err) {
      next(err);
    }
  },

  async detail(req: Request, res: Response, next: NextFunction) {
    try {
      const tournament = await TournamentService.detail(req.params.id);
      res.json({ tournament });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const tournament = await TournamentService.update(req.params.id, req.body);
      res.json({ tournament });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await TournamentService.remove(req.params.id);
      res.json({ message: 'deleted' });
    } catch (err) {
      next(err);
    }
  },

  async createAutoTournament(req: Request, res: Response, next: NextFunction) {
    try {
      const { templateId } = req.body;

      if (!templateId) {
        throw new ApiError(400, 'Template ID is required');
      }

      const template = await prisma.tournamentTemplate.findUnique({ where: { id: templateId } });
      if (!template) {
        throw new ApiError(404, 'Tournament template not found');
      }

      // Logic to calculate startTime and registrationDeadline, similar to cron job
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [hours, minutes] = template.startTime.split(':').map(Number);
      const tournamentStartTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, 0, 0);

      const registrationDeadline = new Date(tournamentStartTime.getTime());
      registrationDeadline.setHours(registrationDeadline.getHours() - 1); // Default to 1 hour before start

      const now = new Date();
      if (registrationDeadline.getTime() < now.getTime()) {
        registrationDeadline.setTime(now.getTime() + 5 * 60 * 1000);
      }

      // Check for existing tournament to prevent duplicates for today
      const exists = await prisma.tournament.findFirst({
        where: {
          templateId: template.id,
          startTime: tournamentStartTime
        }
      });

      if (exists) {
        throw new ApiError(409, 'A tournament has already been created for today from this template.');
      }

      const newTournament = await TournamentService.create({
        name: template.name + ' ' + new Date().toLocaleDateString(),
        startTime: tournamentStartTime,
        maxPlayers: template.maxPlayers,
        roundsTotal: template.roundsTotal,
        entryFee: template.entryFee,
        organizerId: (req as any).user.id, // Assuming admin user is the organizer
        registrationDeadline: registrationDeadline,
        templateId: template.id,
        prizeStructure: template.prizeStructure,
        hostFeePercent: template.hostFeePercent,
        expectedParticipants: template.expectedParticipants,
      });

      // Auto-create the first round for the new tournament
      try {
        const firstRound = await prisma.round.create({
          data: {
            tournamentId: newTournament.id,
            roundNumber: 1,
            startTime: new Date(newTournament.startTime.getTime() + 1000 * 60 * 5), // 5 mins after tournament start
            status: 'pending',
            config: (newTournament.config as any)?.phases[0] || {}
          }
        });
        console.log(`First round (${firstRound.id}) created for tournament ${newTournament.id}. Will be auto-advanced by cron job.`);
      } catch (error) {
        console.error(`Failed to create first round for tournament ${newTournament.id}:`, error);
      }

      res.json({ tournament: newTournament });
    } catch (err) {
      next(err);
    }
  }
};

export default TournamentController; 