import { create } from 'zustand';
import { IUser } from '@/app/types/user';
import api from '@/app/lib/apiConfig';

interface UserState {
  user: IUser | null;
  loading: boolean;
  setUser: (user: IUser | null) => void;
  clearUser: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => {
  console.log("UserStore: Initializing with user=null, loading=true");
  return {
    user: null,
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
    clearUser: async () => {
      console.log("UserStore: Clearing user");
      try {
        // Call logout API to clear server-side cookie
        await api.post('/auth/logout');
      } catch (error) {
        console.error("UserStore: Error calling logout API:", error);
        // Continue with local cleanup even if API call fails
      }
      
      set({ user: null, loading: false });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authUser');
      }
    },
    fetchUser: async () => {
      const currentUser = get().user;
      console.log("UserStore: fetchUser called. Current user:", currentUser, "Current loading:", get().loading);

      // If user is already in store, no need to fetch
      if (currentUser) {
        console.log("UserStore: User already exists, no fetch needed, setting loading=false");
        set({ loading: false });
        return;
      }
      
      // If no current user, try to fetch (relying on HttpOnly cookie)
      set({ loading: true });
      console.log("UserStore: Starting fetch, setting loading=true");
      try {
        const response = await api.get('/auth/me'); // Rely on HttpOnly cookie being sent automatically
        console.log("UserStore: Fetch success. User data:", response.data);
        get().setUser(response.data.user); // Make sure response.data is { user: IUser }
      } catch (e) {
        console.error("UserStore: Error fetching user data:", e);
        set({ user: null, loading: false });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authUser');
          // localStorage.removeItem('authToken'); // This might still be needed if backend also puts it in localStorage for some reason, but less likely.
        }
      }
    },
  };
}); 