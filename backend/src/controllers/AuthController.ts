import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import UserService from '../services/UserService';

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export default {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerSchema.parse(req.body);
      const user = await UserService.register(data);
      res.json({ user });
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginSchema.parse(req.body);
      const result = await UserService.login(data);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async me(req: Request, res: Response) {
    res.json({ user: (req as any).user });
  }
}; 