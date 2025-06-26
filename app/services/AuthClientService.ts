import { IUser } from '../types/user';
import api from '../lib/apiConfig';

export class AuthClientService {
  static async register(userData: { username: string; email: string; password: string }): Promise<IUser> {
    try {
      const response = await api.post('/auth/register', userData);
      const user: IUser = response.data.user;
      return user;
    } catch (err) {
      console.error('Error during registration:', err);
      throw new Error('Error during registration');
    }
  }

  static async login(credentials: { email: string; password: string }): Promise<{ user: IUser }> {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (err) {
      console.error('Error during login:', err);
      throw new Error('Error during login');
    }
  }
} 