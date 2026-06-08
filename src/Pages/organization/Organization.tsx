/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  useGetAllOrganizationsQuery,
  useCreateOrganizationMutation,
  useDeleteOrganizationMutation,
  useAddUserToOrganizationMutation,
  useRemoveUserFromOrganizationMutation,
  useUpdateUserRoleMutation,
} from "../../redux/features/organization/organizationApi";
import { useGetAllUsersQuery } from "../../redux/features/users/userApi";
import { Loader2, Trash2, UserMinus, X } from "lucide-react";
import toast from "react-hot-toast";
import OrgList from "../../components/organization/OrgList";
import OrgMembers from "../../components/organization/OrgMembers";


export default function Organization() {
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [confirmDeleteOrg, setConfirmDeleteOrg] = useState<string | null>(null);
  const [confirmRemoveUser, setConfirmRemoveUser] = useState<{ id: string; userId: string } | null>(null);
  const [form, setForm] = useState({ name: "", logo: "", primaryColor: "" });

  const { data, isLoading, isError } = useGetAllOrganizationsQuery(undefined);
  const { data: usersData }  = useGetAllUsersQuery(undefined);

  const [createOrg, { isLoading: isCreating }] = useCreateOrganizationMutation();
  const [deleteOrg, { isLoading: isDeleting }] = useDeleteOrganizationMutation();

  const [addUser] = useAddUserToOrganizationMutation();
  const [removeUser] = useRemoveUserFromOrganizationMutation();
  const [updateRole] = useUpdateUserRoleMutation();

  const organizations = data?.data ?? [];
  const allUsers      = usersData?.data?.allUsers ?? [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOrg({
        name: form.name,
        branding: { logo: form.logo, primaryColor: form.primaryColor },
      }).unwrap();
      toast.success("Organization created");
      setShowCreateModal(false);
      setForm({ name: "", logo: "", primaryColor: "" });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create");
    }
  };

  const handleDeleteOrg = async (id: string) => {
    try {
      await deleteOrg(id).unwrap();
      toast.success("Organization deleted");
      setConfirmDeleteOrg(null);
      if (selectedOrg?._id === id) setSelectedOrg(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete");
    }
  };

  const handleAddUser = async (userId: string) => {
    if (!selectedOrg) return;
    try {
      await addUser({ id: selectedOrg._id, userId }).unwrap();
      toast.success("User added");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add user");
    }
  };

  const handleRemoveUser = async () => {
    if (!confirmRemoveUser) return;
    try {
      await removeUser(confirmRemoveUser).unwrap();
      toast.success("User removed");
      setConfirmRemoveUser(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to remove");
    }
  };

  const handleUpdateRole = async (userId: string, role: string) => {
    if (!selectedOrg) return;
    try {
      await updateRole({ id: selectedOrg._id, userId, role }).unwrap();
      toast.success("Role updated");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update role");
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
    </div>
  );

  if (isError) return (
    <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
      Failed to load organizations.
    </div>
  );

  return (
    <div className="space-y-5">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left — org list */}
        <OrgList
          organizations={organizations}
          selectedOrg={selectedOrg}
          onSelect={setSelectedOrg}
          onDelete={(id) => setConfirmDeleteOrg(id)}
          onCreate={() => setShowCreateModal(true)}
        />

        {/* Right — members */}
        <div className="lg:col-span-2">
          <OrgMembers
            selectedOrg={selectedOrg}
            allUsers={allUsers}
            onAddUser={handleAddUser}
            onRemoveUser={(userId) => setConfirmRemoveUser({ id: selectedOrg._id, userId })}
            onUpdateRole={handleUpdateRole}
          />
        </div>

      </div>

      {/* Create modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-sm mx-4 shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-slate-800">New Organization</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Name</label>
                <input type="text" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Organization name"
                  className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Logo URL (optional)</label>
                <input type="text" value={form.logo}
                  onChange={(e) => setForm({ ...form, logo: e.target.value })}
                  placeholder="https://..."
                  className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Brand Color (optional)</label>
                <input type="text" value={form.primaryColor}
                  onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                  placeholder="#0066FF"
                  className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)}
                  className="flex-1 h-9 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" disabled={isCreating}
                  className="flex-1 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                >
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm delete org */}
      {confirmDeleteOrg && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-sm mx-4 shadow-lg">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 text-center">Delete Organization?</h3>
            <p className="text-sm text-slate-500 text-center mt-1.5 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDeleteOrg(null)}
                className="flex-1 h-9 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button onClick={() => handleDeleteOrg(confirmDeleteOrg)} disabled={isDeleting}
                className="flex-1 h-9 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm remove user */}
      {confirmRemoveUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-sm mx-4 shadow-lg">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserMinus className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 text-center">Remove User?</h3>
            <p className="text-sm text-slate-500 text-center mt-1.5 mb-5">
              This user will be removed from the organization.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmRemoveUser(null)}
                className="flex-1 h-9 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button onClick={handleRemoveUser}
                className="flex-1 h-9 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium flex items-center justify-center transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}