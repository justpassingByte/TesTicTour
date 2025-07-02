import api from '../lib/apiConfig';
import { MiniTourLobby } from '../stores/miniTourLobbyStore';

const MiniTourLobbyService = {
  getLobbyById: async (id: string): Promise<MiniTourLobby> => {
    const response = await api.get<{ success: boolean; data: MiniTourLobby }>(`/minitour-lobbies/${id}`);
    return response.data.data;
  },

  joinLobby: async (lobbyId: string, userId: string) => {
    return api.post<{ success: boolean; data: MiniTourLobby }>(`/minitour-lobbies/${lobbyId}/join`, { userId });
  },

  leaveLobby: async (lobbyId: string) => {
    return api.post<{ success: boolean; data: MiniTourLobby }>(`/minitour-lobbies/${lobbyId}/leave`);
  },

  startLobby: async (lobbyId: string) => {
    return api.post<{ success: boolean; data: MiniTourLobby }>(`/minitour-lobbies/${lobbyId}/start`);
  },
  
  getAllLobbies: async (): Promise<MiniTourLobby[]> => {
    const response = await api.get<{ success: boolean; data: MiniTourLobby[] }>('/minitour-lobbies');
    return response.data.data;
  },
  
  createLobby: async (formData: FormData): Promise<MiniTourLobby> => {
    const response = await api.post<{ success: boolean; data: MiniTourLobby }>('/minitour-lobbies', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.data;
  },

  updateLobby: async (id: string, formData: FormData): Promise<MiniTourLobby> => {
    const response = await api.put<{ success: boolean; data: MiniTourLobby }>(`/minitour-lobbies/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.data;
  },

  deleteLobby: async (id: string): Promise<void> => {
    await api.delete(`/minitour-lobbies/${id}`);
  },

  assignPlayerToLobby: async (lobbyId: string, userId: string): Promise<MiniTourLobby> => {
    const response = await api.post<{ success: boolean; data: MiniTourLobby }>(`/minitour-lobbies/${lobbyId}/assign-player`, { userId });
    return response.data.data;
  },

  fetchLobbyMatchResult: async (lobbyId: string) => {
    const response = await api.post<{
      message: string; success: boolean; data: any 
}>(`/minitour-lobbies/${lobbyId}/fetch-result`);
    return response.data;
  },
};

export default MiniTourLobbyService; 