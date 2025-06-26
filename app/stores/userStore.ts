import { create } from 'zustand';
import { IUser } from '@/app/types/user';
import api from '@/app/lib/apiConfig';

interface UserState {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  setUser: (user: IUser | null) => void;
  setToken: (token: string | null) => void;
  clearUser: () => void;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => {
  console.log("UserStore: Initializing with user=null, token=null, loading=true");
  return {
    user: null,
    token: null,
    loading: true,

    setUser: (user) => {
      console.log("UserStore: Setting user:", user);
      set({ user });
      set({ loading: false });
      console.log("UserStore: User set, setting loading to false.");

      if (typeof window !== 'undefined') {
        if (user) {
          localStorage.setItem('authUser', JSON.stringify(user));
        } else {
          localStorage.removeItem('authUser');
        }
      }
    },
    setToken: (token) => {
      console.log("UserStore: Setting token:", token);
      set({ token });

      if (typeof window !== 'undefined') {
        if (token) {
          localStorage.setItem('authToken', token);
        } else {
          localStorage.removeItem('authToken');
        }
      }
    },
    clearUser: () => {
      console.log("UserStore: Clearing user and token");
      set({ user: null, token: null, loading: false });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    },
    fetchUser: async () => {
      const currentToken = get().token;
      const currentUser = get().user;
      console.log("UserStore: fetchUser called. Current token:", currentToken, "Current user:", currentUser, "Current loading:", get().loading);

      if (currentToken && !currentUser) {
        set({ loading: true });
        console.log("UserStore: Starting fetch, setting loading=true");
        try {
          const response = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${currentToken}` }
          });
          console.log("UserStore: Fetch success. User data:", response.data);
          get().setUser(response.data);
        } catch (e) {
          console.error("UserStore: Error fetching user data:", e);
          set({ user: null, token: null, loading: false });
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
          }
        }
      } else {
        console.log("UserStore: No fetch needed (user already exists or no token), setting loading=false");
        set({ loading: false });
      }
    },
  };
}); 