import { Request, Response, NextFunction } from 'express';
import MatchService from '../services/MatchService';

export default {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const matches = await MatchService.list(req.params.lobbyId);
      res.json({ matches });
    } catch (err) {
      next(err);
    }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const match = await MatchService.create(req.params.lobbyId, req.body);
      res.json({ match });
    } catch (err) {
      next(err);
    }
  },
  async results(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await MatchService.results(req.params.matchId);
      res.json({ results });
    } catch (err) {
      next(err);
    }
  },
  async updateResults(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await MatchService.updateResults(req.params.matchId, req.body);
      res.json({ result });
    } catch (err) {
      next(err);
    }
  },
  async fetchAndSaveMatchData(req: Request, res: Response, next: NextFunction) {
    try {
      const { matchId, region } = req.body;
      const result = await MatchService.fetchAndSaveMatchData(matchId, region);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}; 