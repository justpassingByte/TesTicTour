import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export default function auth(requiredRole: 'user' | 'admin' = 'user') {
  return function (req: Request, _res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return next(new ApiError(401, 'Missing authorization header'));
    }
    const token = header.substring(7);
    
    // Đảm bảo JWT_SECRET tồn tại
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not set in environment variables');
      return next(new ApiError(500, 'Server configuration error'));
    }

    try {
      const payload = jwt.verify(token, jwtSecret) as JwtPayload;
      (req as any).user = payload;
      if (requiredRole === 'admin' && payload.role !== 'admin') {
        return next(new ApiError(403, 'Forbidden'));
      }
      next();
    } catch (err) {
      console.error('JWT verification failed:', err);
      next(new ApiError(401, 'Invalid token'));
    }
  };
} 