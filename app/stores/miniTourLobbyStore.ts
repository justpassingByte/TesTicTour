import { create } from 'zustand';
import { toast } from '@/components/ui/use-toast';
import MiniTourLobbyService from "@/app/services/MiniTourLobbyService";
// import { MatchService } from '@/services/MatchService'; // No longer needed for syncMatch
// import { useBalanceStore } from "./balanceStore";

export interface MiniTourLobbyParticipant {
  id: string;
  userId: string;
  miniTourLobbyId: string;
  joinedAt: string;
  user: {
    id: string;
    username: string;
    puuid: string;
    riotGameName?: string;
    riotGameTag?: string;
  };
}

export interface MiniTourMatchResult {
  id: string;
  userId: string;
  user: {
    id: string;
    username: string;
  };
  placement: number;
  points: number;
}

export interface MiniTourMatch {
  id: string;
  miniTourLobbyId: string;
  status: 'PENDING' | 'COMPLETED' | 'LIVE';
  matchIdRiotApi?: string | null;
  fetchedAt?: string;
  matchData?: any;
  miniTourMatchResults: MiniTourMatchResult[];
  createdAt: string;
  updatedAt: string;
}

export interface MiniTourLobby {
  customLogoUrl?: string;
  id: string;
  creatorId?: string;
  name: string;
  description?: string;
  status: "WAITING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  currentPlayers: number;
  maxPlayers: number;
  entryFee: number;
  entryType: string;
  prizePool: number;
  gameMode: string;
  skillLevel: string;
  theme?: string;
  averageRating: number;
  totalMatches: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  rules: string[];
  prizeDistribution?: any;
  participants: MiniTourLobbyParticipant[];
  matches: MiniTourMatch[];
  ownerId: string;
  settings: {
    autoStart: boolean;
    privateMode: boolean;
  };
}

export interface PartnerData {
  totalPlayers: number
  totalRevenue: number
  activeLobbies: number
  totalLobbies: number
  monthlyRevenue: number
  balance: number
  totalMatches: number
  revenueShare: number
  subscription: any;
}

export interface AnalyticsData {
  playerGrowth: { month: string; players: number }[]
  revenueGrowth: { month: string; revenue: number }[]
  performance: {
    totalPlayers: { value: number; change: number }
    totalRevenue: { value: number; change: number }
    averageRating: { value: number; change: number }
  }
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  lastActive: string
  permissions: string[]
}

export interface Player {
  id: string;
  username: string;
  email: string;
  riotGameName?: string;
  riotGameTag?: string;
  region?: string;
  role: string;
  totalMatchesPlayed: number;
  tournamentsWon: number;
  balance: number;
  isActive: boolean;
  totalAmountWon: number;
}

export interface MiniTourLobbyState {
  lobby: MiniTourLobby | null;
  isLoading: boolean;
  error: string | null;
  isProcessingAction: boolean;
  syncingMatchId: string | null;
}

interface MiniTourLobbyActions {
  fetchLobby: (id: string) => Promise<void>;
  joinLobby: (lobbyId: string, userId: string) => Promise<void>;
  leaveLobby: (lobbyId: string) => Promise<void>;
  startLobby: (lobbyId: string) => Promise<void>;
  syncMatch: (lobbyId: string) => Promise<void>;
  syncAllUnsyncedMatches: () => Promise<void>;
  setLobby: (lobby: MiniTourLobby) => void;
  createLobby: (formData: FormData, router: any) => Promise<void>;
  updateLobby: (lobbyId: string, formData: FormData, router: any) => Promise<void>;
  deleteLobby: (lobbyId: string, router: any) => Promise<void>;
}

export const useMiniTourLobbyStore = create<MiniTourLobbyState & MiniTourLobbyActions>((set, get) => ({
  lobby: null,
  isLoading: true,
  error: null,
  isProcessingAction: false,
  syncingMatchId: null,

  setLobby: (lobby) => {
    set({ lobby, isLoading: false, error: null });
  },

  createLobby: async (formData: FormData, router: any) => {
    set({ isProcessingAction: true, error: null });
    try {
      const response = await MiniTourLobbyService.createLobby(formData);
      set({ lobby: response });
      router.push(`/dashboard/partner/lobbies/${response.id}`);
      toast({
        title: "Thành công",
        description: "Sảnh đã được tạo thành công!",
      });
    } catch (error: any) {
      console.error("Failed to create lobby:", error);
      const errorMessage = error.message || "Không thể tạo sảnh. Vui lòng thử lại.";
      set({ error: errorMessage });
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      set({ isProcessingAction: false });
    }
  },

  updateLobby: async (lobbyId: string, formData: FormData, router: any) => {
    set({ isProcessingAction: true, error: null });
    try {
      const response = await MiniTourLobbyService.updateLobby(lobbyId, formData);
      set({ lobby: response });
      router.push(`/dashboard/partner/minitours/${lobbyId}`);
      toast({
        title: "Thành công",
        description: "Sảnh đã được cập nhật thành công!",
      });
    } catch (error: any) {
      console.error("Failed to update lobby:", error);
      const errorMessage = error.message || "Không thể cập nhật sảnh. Vui lòng thử lại.";
      set({ error: errorMessage });
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      set({ isProcessingAction: false });
    }
  },

  deleteLobby: async (lobbyId: string, router: any) => {
    set({ isProcessingAction: true, error: null });
    try {
      await MiniTourLobbyService.deleteLobby(lobbyId);
      set({ lobby: null });
      router.push("/dashboard/partner/minitours");
      toast({
        title: "Thành công",
        description: "Sảnh đã được xóa thành công.",
      });
    } catch (error: any) {
      console.error("Failed to delete lobby:", error);
      const errorMessage = error.message || "Không thể xóa sảnh. Vui lòng thử lại.";
      set({ error: errorMessage });
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      set({ isProcessingAction: false });
    }
  },

  fetchLobby: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const lobby = await MiniTourLobbyService.getLobbyById(id);
      set({ lobby, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch lobby:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch lobby";
      set({ error: errorMessage, isLoading: false });
    }
  },

  joinLobby: async (lobbyId, userId) => {
    set({ isProcessingAction: true, error: null });
    try {
      await MiniTourLobbyService.joinLobby(lobbyId, userId);
      await get().fetchLobby(lobbyId);
      // useBalanceStore.getState().fetchBalance();
      toast({
        title: "Thành công",
        description: "Bạn đã tham gia sảnh thành công.",
      });
    } catch (error: any) {
      console.error("Failed to join lobby:", error);
      const errorMessage = error.message || "Không thể tham gia sảnh. Vui lòng thử lại.";
      set({ error: errorMessage });
      toast({ 
        title: "Lỗi", 
        description: errorMessage, 
        variant: "destructive" 
      });
    } finally {
      set({ isProcessingAction: false });
    }
  },

  leaveLobby: async (lobbyId: string) => {
    set({ isProcessingAction: true, error: null });
    try {
      await MiniTourLobbyService.leaveLobby(lobbyId);
      await get().fetchLobby(lobbyId);
      // useBalanceStore.getState().fetchBalance();
      toast({
        title: "Success",
        description: "You have left the lobby.",
      });
    } catch (error) {
      console.error("Failed to leave lobby:", error);
      const errorMessage = error instanceof Error ? error.message : "Could not leave the lobby. Please try again.";
      set({ error: errorMessage });
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      set({ isProcessingAction: false });
    }
  },

  startLobby: async (lobbyId: string) => {
    set({ isProcessingAction: true, error: null });
    try {
      await MiniTourLobbyService.startLobby(lobbyId);
      await get().fetchLobby(lobbyId);
      toast({
        title: "Lobby Started",
        description: "The first match has begun!",
      });
    } catch (error) {
      console.error("Failed to start lobby:", error);
      const errorMessage = error instanceof Error ? error.message : "Could not start the lobby. Please try again.";
      set({ error: errorMessage });
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      set({ isProcessingAction: false });
    }
  },

  syncMatch: async (lobbyId: string) => {
    set({ syncingMatchId: lobbyId });
    try {
      await get().fetchLobby(lobbyId);
      await get().syncAllUnsyncedMatches();
      toast({
        title: 'Sync Complete',
        description: `Match processing initiated for lobby ${lobbyId.substring(0, 8)}.`,
      });
    } catch (error) {
      console.error("Failed to sync match:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        title: 'Sync Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      set({ syncingMatchId: null });
    }
  },

  syncAllUnsyncedMatches: async () => {
    const lobby = get().lobby;
    if (!lobby) return;

    let hasMorePendingMatches = true;
    let matchesSyncedCount = 0;
    set({ isProcessingAction: true });
    toast({ title: "Syncing All Matches", description: "Initiating bulk sync..." });

    try {
      while (hasMorePendingMatches) {
        await get().fetchLobby(lobby.id);
        const currentLobbyState = get().lobby;

        if (!currentLobbyState || currentLobbyState.matches.filter(m => m.status === 'PENDING').length === 0) {
          hasMorePendingMatches = false;
          break;
        }

        const response = await MiniTourLobbyService.fetchLobbyMatchResult(currentLobbyState.id);
        matchesSyncedCount++;
        toast({
          title: `Sync Progress (${matchesSyncedCount})`,
          description: response.message || `Match processing queued for lobby ${currentLobbyState.id.substring(0, 8)}.`,
        });

        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      toast({
        title: 'Bulk Sync Complete',
        description: `All available pending matches for lobby ${lobby.name} have been processed. Total: ${matchesSyncedCount}`,
      });

    } catch (error) {
      console.error("Failed to bulk sync matches:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during bulk sync.";
      toast({
        title: 'Bulk Sync Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      set({ isProcessingAction: false });
    }
  },
}));