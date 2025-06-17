import { IUser } from '../types/user';
import api from '../lib/apiConfig';

export class UserService {
  static async register(userData: { username: string; email: string; password: string }): Promise<IUser> {
    try {
      const response = await api.post('/users/register', userData);
      const user: IUser = response.data;
      return user;
    } catch  {
      console.error('Error during registration:');
      throw new Error('Error during registration');
    }
  }

  static async login(credentials: { email: string; password: string }): Promise<{ user: IUser; token: string }> {
    try {
      const response = await api.post('/users/login', credentials);
      const data: { user: IUser; token: string } = response.data;
      return data;
    } catch  {
      console.error('Error during login:');
      throw new Error('Error during login');
    }
  }
} 