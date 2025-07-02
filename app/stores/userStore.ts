import { create } from 'zustand';
import { IUser } from '@/app/types/user';
import { AuthClientService } from '@/app/services/AuthClientService';
import { toast } from '@/components/ui/use-toast';

interface UserState {
  currentUser: IUser | null;
  isLoading: boolean;
  error: string | null;
}

interface UserActions {
  setCurrentUser: (user: IUser | null) => void;
  clearUser: () => Promise<void>;
  initializeUser: () => Promise<void>;
}

export const useUserStore = create<UserState & UserActions>((set) => ({
  currentUser: null,
  isLoading: true, // Set to true initially to indicate loading on app start
  error: null,

  setCurrentUser: (user) => set({ currentUser: user, isLoading: false, error: null }),
  clearUser: async () => {
    try {
      await AuthClientService.logout();
      set({ currentUser: null, isLoading: false, error: null });
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "Logout Failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  },

  initializeUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await AuthClientService.fetchCurrentUser();
      set({ currentUser: user, isLoading: false });
    } catch (err: any) {
      console.error("Failed to initialize user:", err);
      set({ currentUser: null, isLoading: false, error: err.message || "Failed to load user data." });
      toast({
        title: "Error",
        description: "Failed to load user session. Please try logging in again.",
        variant: "destructive",
      });
    }
  },
})); 
