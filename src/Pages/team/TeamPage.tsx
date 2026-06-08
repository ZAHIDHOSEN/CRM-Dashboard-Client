/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useGetAllTeamsQuery,useCreateTeamMutation,useDeleteTeamMutation, useAddMemberToTeamMutation,
  useRemoveMemberFromTeamMutation,
} from "../../redux/features/team/teamApi";
import { useGetAllUsersQuery } from "../../redux/features/users/userApi";
import { Loader2, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import TeamStats   from "../../components/team/TeamStats";
import TeamList    from "../../components/team/TeamList";
import TeamMembers from "../../components/team/TeamMember";


export default function TeamPage() {
  const { user } = useAuth();

  const [selectedTeam, setSelectedTeam]     = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove]     = useState<{ teamId: string; userId: string } | null>(null);

  const [form, setForm] = useState({
    name: "", leader: "",
  });

  const { data, isLoading, isError } = useGetAllTeamsQuery(undefined);
  const { data: usersData } = useGetAllUsersQuery(undefined);

  const [createTeam, { isLoading: isCreating }]  = useCreateTeamMutation();
  const [deleteTeam, { isLoading: isDeleting }]  = useDeleteTeamMutation();

  const [addMember]  = useAddMemberToTeamMutation();
  const [removeMember] = useRemoveMemberFromTeamMutation();

  const teams    = data?.data?.allTeam   ?? [];
  const total    = data?.data?.teamNumber ?? 0;
  const allUsers = usersData?.data?.allUsers ?? [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTeam({
        name: form.name,
        leader: form.leader,
        organization: (user as any)?.organization,
      }).unwrap();
      toast.success("Team created");
      setShowCreateModal(false);
      setForm({ name: "", leader: "" });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create team");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTeam(id).unwrap();
      toast.success("Team deleted");
      setConfirmDeleteId(null);
      if (selectedTeam?._id === id) setSelectedTeam(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete");
    }
  };

  const handleAddMember = async (userId: string) => {
    if (!selectedTeam) return;
    try {
      await addMember({ teamId: selectedTeam._id, userId }).unwrap();
      toast.success("Member added");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add member");
    }
  };

  const handleRemoveMember = async () => {
    if (!confirmRemove) return;
    try {
      await removeMember(confirmRemove).unwrap();
      toast.success("Member removed");
      setConfirmRemove(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to remove member");
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
    </div>
  );

  if (isError) return (
    <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
      Failed to load teams.
    </div>
  );

  return (
    <div className="space-y-5">

      {/* Stats */}
      <TeamStats teams={teams} totalTeams={total} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left — team list */}
        <TeamList
          teams={teams}
          selectedTeam={selectedTeam}
          onSelect={setSelectedTeam}
          onDelete={(id) => setConfirmDeleteId(id)}
          onCreate={() => setShowCreateModal(true)}
        />

        {/* Right — members */}
        <div className="lg:col-span-2">
          <TeamMembers
            selectedTeam={selectedTeam}
            allUsers={allUsers}
            onAddMember={handleAddMember}
            onRemoveMember={(userId) =>
              setConfirmRemove({ teamId: selectedTeam._id, userId })
            }
          />
        </div>

      </div>

      {/* Create modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-sm mx-4 shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-slate-800">New Team</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Team Name</label>
                <input
                  type="text" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Team name"
                  className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Leader</label>
                <select
                  required value={form.leader}
                  onChange={(e) => setForm({ ...form, leader: e.target.value })}
                  className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select leader...</option>
                  {allUsers.map((u: any) => (
                    <option key={u._id} value={u._id}>
                      {u.name} — {u.role}
                    </option>
                  ))}
                </select>
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

      {/* Confirm delete team */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-sm mx-4 shadow-lg">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 text-center">Delete Team?</h3>
            <p className="text-sm text-slate-500 text-center mt-1.5 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDeleteId(null)}
                className="flex-1 h-9 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button onClick={() => handleDelete(confirmDeleteId)} disabled={isDeleting}
                className="flex-1 h-9 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm remove member */}
      {confirmRemove && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-sm mx-4 shadow-lg">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 text-center">Remove Member?</h3>
            <p className="text-sm text-slate-500 text-center mt-1.5 mb-5">
              This member will be removed from the team.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmRemove(null)}
                className="flex-1 h-9 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button onClick={handleRemoveMember}
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