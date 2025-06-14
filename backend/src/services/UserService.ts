import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';
import ApiError from '../utils/ApiError';

const SALT_ROUNDS = 10;

export default class UserService {
  static async register({ username, email, password }: { username: string; email: string; password: string }) {
    const exists = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });
    if (exists) throw new ApiError(400, 'Username or email already exists');
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({ data: { username, email, password: hashed, riotGameName: '', riotGameTag: '', region: '' } });
    return user;
  }

  static async login({ email, password }: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new ApiError(401, 'Invalid credentials');
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new ApiError(401, 'Invalid credentials');

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET as string, {
      expiresIn: '7d'
    });
    return { user: { id: user.id, username: user.username, email: user.email, role: user.role }, token };
  }
} 