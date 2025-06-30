"use client"
import AdminUserTable from "@/components/dashboard/admin/AdminUserTable";
import AddUserModal from "@/components/dashboard/admin/AddUserModal";
import UserDetailModal from "@/components/dashboard/admin/UserDetailModal";
import UserImportModal from "./UserImportModal";
import { useState, useEffect } from "react";
import { useAdminUserStore } from "@/app/stores/adminUserStore";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function UserManagementTab() {
  const [openAddUser, setOpenAddUser] = useState(false);
  const [openUserDetail, setOpenUserDetail] = useState(false);
  const [openImportModal, setOpenImportModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const loading = useAdminUserStore((state) => state.loading);
  const currentPage = useAdminUserStore((state) => state.currentPage);
  const totalPages = useAdminUserStore((state) => state.totalPages);
  const totalItems = useAdminUserStore((state) => state.totalItems);
  const roleFilter = useAdminUserStore((state) => state.roleFilter);
  const fetchUsers = useAdminUserStore((state) => state.fetchUsers);
  const setRoleFilter = useAdminUserStore((state) => state.setRoleFilter);
  const createUser = useAdminUserStore((state) => state.createUser);
  const { setPagination, limit } = useAdminUserStore.getState();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleViewUserDetail = (id: string) => {
    setSelectedUserId(id);
    setOpenUserDetail(true);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setPagination(currentPage + 1, limit);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setPagination(currentPage - 1, limit);
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Total Users: {totalItems}</h2>
          <select
            className="select select-bordered"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="partner">Partner</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setOpenImportModal(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Import Users
            </Button>
            <Button onClick={() => setOpenAddUser(true)}>
                Add New User
            </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading users...</div>
      ) : (
        <AdminUserTable onViewDetail={handleViewUserDetail} />
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1 || loading}
          className="btn btn-outline"
        >
          Previous Page
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || loading}
          className="btn btn-outline"
        >
          Next Page
        </button>
      </div>

      <AddUserModal
        open={openAddUser}
        onClose={() => setOpenAddUser(false)}
        onCreate={createUser}
      />
      <UserDetailModal
        open={openUserDetail}
        onClose={() => { setOpenUserDetail(false); setSelectedUserId(null); }}
        userId={selectedUserId}
      />
      <UserImportModal
        open={openImportModal}
        onClose={() => setOpenImportModal(false)}
      />
    </div>
  );
} 