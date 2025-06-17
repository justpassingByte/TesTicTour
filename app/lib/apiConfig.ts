import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage in client-side context
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers = config.headers || {}; // Initialize headers if undefined
        (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    // We don't log request errors here as they will be handled by the response interceptor
    return Promise.reject(error);
  }
);

// Add response logging
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // We don't need to log successful responses in production
    return response;
  },
  (error: AxiosError) => {
    // Log error details for debugging
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: (error.response?.data as { message: string })?.message || error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default api; 