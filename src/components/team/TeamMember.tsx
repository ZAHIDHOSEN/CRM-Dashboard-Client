/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Users, UserPlus, UserMinus, X } from "lucide-react";

const roleBadgeColor: Record<string, string> = {
  ADMIN:     "bg-blue-100 text-blue-700",
  LEADER:    "bg-purple-100 text-purple-700",
  SETTER:    "bg-amber-100 text-amber-700",
  CLOSER:    "bg-green-100 text-green-700",
  INSTALLER: "bg-orange-100 text-orange-700",
  CLIENT:    "bg-slate-100 text-slate-600",
};

interface Props {
  selectedTeam: any;
  allUsers: any[];
  onAddMember: (userId: string) => void;
  onRemoveMember: (userId: string) => void;
}

export default function TeamMembers({ selectedTeam, allUsers, onAddMember, onRemoveMember }: Props) {
  const [showAdd, setShowAdd]   = useState(false);
  const [addUserId, setAddUserId] = useState("");

  if (!selectedTeam) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center h-64">
        <Users className="w-8 h-8 text-slate-300 mb-2" />
        <p className="text-slate-400 text-sm">Select a team to view members</p>
      </div>
    );
  }

  const handleAdd = () => {
    if (!addUserId) return;
    onAddMember(addUserId);
    setAddUserId("");
    setShowAdd(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">

      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-800">{selectedTeam.name}</h2>
          <div className="flex items-center gap-3 mt-0.5">
            <p className="text-xs text-slate-400">
              Leader:
              <span className="text-slate-600 font-medium ml-1">
                {selectedTeam.leader?.name ?? "—"}
              </span>
            </p>
            <span className="text-slate-200">|</span>
            <p className="text-xs text-slate-400">
              {selectedTeam.members?.length ?? 0} members
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 h-8 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-lg transition-colors"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Add Member
        </button>
      </div>

      {/* Add member bar */}
      {showAdd && (
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
          <select
            value={addUserId}
            onChange={(e) => setAddUserId(e.target.value)}
            className="flex-1 h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select user...</option>
            {allUsers.map((u: any) => (
              <option key={u._id} value={u._id}>
                {u.name} — {u.role}
              </option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            className="h-9 px-4 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
          <button
            onClick={() => { setShowAdd(false); setAddUserId(""); }}
            className="h-9 px-3 border border-slate-200 text-slate-500 text-sm rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Members table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">#</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Member</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Email</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Role</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {selectedTeam.members?.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-400 text-sm">
                  No members yet
                </td>
              </tr>
            ) : (
              selectedTeam.members?.map((m: any, index: number) => {
                const member = typeof m === "object" ? m : allUsers.find((u: any) => u._id === m);
                if (!member) return null;
                return (
                  <tr key={member._id} className="hover:bg-slate-50 transition-colors">

                    <td className="px-5 py-3.5 text-slate-400 text-xs">{index + 1}</td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-purple-700 text-xs font-semibold">
                            {member.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-slate-700">{member.name}</span>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-slate-500 text-xs">{member.email}</td>

                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${roleBadgeColor[member.role] ?? "bg-slate-100 text-slate-600"}`}>
                        {member.role}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => onRemoveMember(member._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}