/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Trash2, Search, Users, Loader2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserMutation,
} from "../../redux/features/users/userApi";

const roleBadgeColor: Record<string, string> = {
  ADMIN:     "bg-blue-100 text-blue-700",
  LEADER:    "bg-purple-100 text-purple-700",
  SETTER:    "bg-amber-100 text-amber-700",
  CLOSER:    "bg-green-100 text-green-700",
  INSTALLER: "bg-orange-100 text-orange-700",
  CLIENT:    "bg-slate-100 text-slate-600",
};

export default function UserPage() {
  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const { data, isLoading, isError } = useGetAllUsersQuery(undefined);
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const users = data?.data?.allUsers ?? [];
  const totalUsers = data?.data?.usersNumber ?? 0;

  const filtered = users.filter((u: any) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted successfully");
      setConfirmId(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete user");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateUser({ id, data: { isApproved: true } }).unwrap();
      toast.success("User approved successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to approve user");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        Failed to load users.
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-slate-600" />
          <h1 className="text-lg font-semibold text-slate-800">Users</h1>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
            {totalUsers} total
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 h-9 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">#</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">User</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Email</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Role</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Commission</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((user: any, index: number) => (
                  <tr key={user._id} className="hover:bg-slate-50 transition-colors">

                    {/* # */}
                    <td className="px-5 py-3.5 text-slate-400 text-xs">{index + 1}</td>

                    {/* User */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-700 text-xs font-semibold">
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-slate-700">{user.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-3.5 text-slate-500">{user.email}</td>

                    {/* Role */}
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${roleBadgeColor[user.role] ?? "bg-slate-100 text-slate-600"}`}>
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      {user.isApproved ? (
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-green-100 text-green-700 flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3 h-3" />
                          Approved
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApprove(user._id)}
                          className="text-xs px-2.5 py-1 rounded-full font-medium bg-amber-100 text-amber-700 hover:bg-green-100 hover:text-green-700 transition-colors flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Pending
                        </button>
                      )}
                    </td>

                    {/* Commission */}
                    <td className="px-5 py-3.5 text-slate-600 font-medium">
                      ${user.commission_balance ?? 0}
                    </td>

                    {/* Delete */}
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setConfirmId(user._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm delete modal */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-sm mx-4 shadow-lg">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 text-center">Delete User?</h3>
            <p className="text-sm text-slate-500 text-center mt-1.5 mb-5">
              This action cannot be undone. The user will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 h-9 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmId)}
                disabled={isDeleting}
                className="flex-1 h-9 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}