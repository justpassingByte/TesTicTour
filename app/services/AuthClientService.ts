import { IUser } from '../types/user';
import api from '../lib/apiConfig';
import { InternalAxiosRequestConfig } from 'axios';
import { AxiosError } from 'axios';

// Add token to requests if available
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Do not add token for login or register routes
    if (config.url?.endsWith('/login') || config.url?.endsWith('/register')) {
      return config;
    }

    // With httpOnly cookies, the browser automatically sends the token.
    // No need to manually retrieve from localStorage or set Authorization header here.
    return config;
  },
  (error: AxiosError) => {
    // We don't log request errors here as they will be handled by the response interceptor
    return Promise.reject(error);
  }
);

// Add response logging and toast notifications for errors

export class AuthClientService {
  static async register(userData: { username: string; email: string; password: string; gameName?: string; tagName?: string; referrer?: string; region?: string }): Promise<IUser> {
    try {
      const response = await api.post('/auth/register', userData);
      const user: IUser = response.data.user;
      return user;
    } catch (err) {
      console.error('Error during registration:', err);
      throw new Error('Error during registration');
    }
  }

  static async login(credentials: { login: string; password: string }): Promise<{ user: IUser }> {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (err) {
      console.error('Error during login:', err);
      throw new Error('Error during login');
    }
  }
} 