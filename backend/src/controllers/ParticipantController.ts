import { Request, Response, NextFunction } from 'express';
import ParticipantService from '../services/ParticipantService';

export default {
  async join(req: Request, res: Response, next: NextFunction) {
    try {
      const participant = await ParticipantService.join(req.params.tournamentId, (req as any).user.id);
      res.json({ participant });
    } catch (err) {
      next(err);
    }
  },
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const participants = await ParticipantService.list(req.params.tournamentId);
      res.json({ participants });
    } catch (err) {
      next(err);
    }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const participant = await ParticipantService.update(req.params.participantId, req.body);
      res.json({ participant });
    } catch (err) {
      next(err);
    }
  },
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await ParticipantService.remove(req.params.participantId);
      res.json({ message: 'deleted' });
    } catch (err) {
      next(err);
    }
  }
}; 