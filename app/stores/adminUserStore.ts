import { create } from "zustand";
import api from "@/app/lib/apiConfig";

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  balance: number;
}

export interface ITransaction {
  id: string;
  type: string; // deposit, withdraw, refund, entry_fee, reward
  amount: number;
  status: string; // pending, success, failed
  refId?: string;
  createdAt: string; // DateTime
}

export interface AdminUserDetail extends AdminUser {
  puuid?: string;
  riotGameName: string;
  riotGameTag: string;
  region: string;
  createdAt: string; // Hoặc DateTime nếu bạn có handler cho DateTime object
  rank?: string;
  rankUpdatedAt?: string;
  totalMatchesPlayed: number;
  averagePlacement: number;
  topFourRate: number;
  firstPlaceRate: number;
  tournamentsPlayed: number;
  tournamentsWon: number;
  lastUpdatedStats?: string;
  transactions?: ITransaction[]; // Thêm mảng transactions
}

interface AdminUserState {
  users: AdminUser[];
  loading: boolean;
  selectedUserDetail: AdminUserDetail | null; // Để lưu thông tin chi tiết của user được chọn
  currentPage: number; // Thêm trạng thái cho phân trang
  totalPages: number; // Thêm trạng thái cho phân trang
  totalItems: number; // Thêm trạng thái cho phân trang
  limit: number; // Thêm trạng thái cho giới hạn mỗi trang
  roleFilter: string; // Thêm state cho bộ lọc
  setPagination: (page: number, limit: number) => void; // Hàm để cập nhật phân trang
  setRoleFilter: (role: string) => void; // Hàm để cập nhật bộ lọc
  fetchUsers: () => Promise<void>; // Cập nhật tham số cho fetchUsers
  fetchUserDetail: (id: string) => Promise<void>;
  createUser: (data: { username: string; email: string; password: string; role: string }) => Promise<void>; // Hàm mới để tạo user với role
  updateUser: (id: string, data: Partial<AdminUserDetail>) => Promise<void>; // Hàm mới để cập nhật user
  banUser: (id: string) => Promise<void>;
  deposit: (userId: string, amount: number) => Promise<void>; // Hàm mới để nạp tiền
}

export const useAdminUserStore = create<AdminUserState>((set, get) => ({
  users: [],
  loading: true,
  selectedUserDetail: null,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  limit: 10,
  roleFilter: "all",
  setPagination: (page, limit) => {
    set({ currentPage: page, limit, loading: true });
    get().fetchUsers();
  },
  setRoleFilter: (role: string) => {
    set({ roleFilter: role, currentPage: 1, loading: true });
    get().fetchUsers();
  },
  fetchUsers: async () => {
    const { currentPage, limit, roleFilter } = get();
    try {
      const params: { page: number; limit: number; role?: string } = {
        page: currentPage,
        limit: limit,
      };
      if (roleFilter !== 'all') {
        params.role = roleFilter;
      }

      const res = await api.get("/admin/users", { params });
      set({ 
        users: res.data.data, 
        loading: false, 
        currentPage: res.data.pagination.currentPage,
        totalPages: res.data.pagination.totalPages,
        totalItems: res.data.pagination.totalItems,
        limit: limit,
      });
    } catch (error) {
      console.error("Failed to fetch users:", error);
      set({ loading: false });
    }
  },
  fetchUserDetail: async (id) => {
    set({ loading: true, selectedUserDetail: null });
    try {
      const res = await api.get(`/admin/users/${id}`);
      set({ selectedUserDetail: res.data, loading: false });
    } catch (error) {
      console.error("Failed to fetch user detail:", error);
      set({ loading: false, selectedUserDetail: null });
    }
  },
  createUser: async (data) => {
    await api.post("/admin/users", data);
    set({ currentPage: 1 });
    await get().fetchUsers();
  },
  updateUser: async (id, data) => {
    set({ loading: true });
    try {
      const res = await api.put(`/admin/users/${id}`, data);
      set({ selectedUserDetail: res.data, loading: false });
      await get().fetchUsers();
    } catch (error) {
      console.error("Failed to update user:", error);
      set({ loading: false });
    }
  },
  banUser: async (id) => {
    await api.post(`/admin/users/${id}/ban`);
    await get().fetchUsers();
  },
  deposit: async (userId, amount) => {
    set({ loading: true });
    try {
      const res = await api.post(`/admin/users/${userId}/deposit`, { amount });
      set({ selectedUserDetail: res.data, loading: false });
    } catch (error) {
      console.error("Failed to deposit:", error);
      set({ loading: false });
      throw error;
    }
  },
})); 