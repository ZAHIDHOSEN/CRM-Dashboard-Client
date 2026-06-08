/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Users, UserPlus, UserMinus, ChevronDown, X } from "lucide-react";

const roleOptions = ["ADMIN", "LEADER", "SETTER", "CLOSER", "INSTALLER", "CLIENT"];

const roleBadgeColor: Record<string, string> = {
  ADMIN:     "bg-blue-100 text-blue-700",
  LEADER:    "bg-purple-100 text-purple-700",
  SETTER:    "bg-amber-100 text-amber-700",
  CLOSER:    "bg-green-100 text-green-700",
  INSTALLER: "bg-orange-100 text-orange-700",
  CLIENT:    "bg-slate-100 text-slate-600",
};

interface Props {
  selectedOrg: any;
  allUsers: any[];
  onAddUser: (userId: string) => void;
  onRemoveUser: (userId: string) => void;
  onUpdateRole: (userId: string, role: string) => void;
}

export default function OrgMembers({ selectedOrg, allUsers, onAddUser, onRemoveUser, onUpdateRole }: Props) {
  const [showAddUser, setShowAddUser]   = useState(false);
  const [addUserId, setAddUserId]       = useState("");
  const [roleDropdown, setRoleDropdown] = useState<string | null>(null);

  if (!selectedOrg) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center h-64">
        <Users className="w-8 h-8 text-slate-300 mb-2" />
        <p className="text-slate-400 text-sm">Select an organization to view details</p>
      </div>
    );
  }

  const handleAdd = () => {
    if (!addUserId) return;
    onAddUser(addUserId);
    setAddUserId("");
    setShowAddUser(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">

      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-800">{selectedOrg.name}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{selectedOrg.users?.length ?? 0} members</p>
        </div>
        <button
          onClick={() => setShowAddUser(!showAddUser)}
          className="flex items-center gap-2 h-8 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-lg transition-colors"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Add User
        </button>
      </div>

      {/* Add user bar */}
      {showAddUser && (
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
            onClick={() => { setShowAddUser(false); setAddUserId(""); }}
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
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">User</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Email</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Role</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {selectedOrg.users?.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-slate-400 text-sm">
                  No members yet
                </td>
              </tr>
            ) : (
              selectedOrg.users?.map((u: any) => {
                const userData = typeof u === "object" ? u : allUsers.find((usr: any) => usr._id === u);
                if (!userData) return null;
                return (
                  <tr key={userData._id} className="hover:bg-slate-50 transition-colors">

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-700 text-xs font-semibold">
                            {userData.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-slate-700">{userData.name}</span>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-slate-500 text-xs">{userData.email}</td>

                    {/* Role dropdown */}
                    <td className="px-5 py-3.5 relative">
                      <button
                        onClick={() => setRoleDropdown(roleDropdown === userData._id ? null : userData._id)}
                        className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${roleBadgeColor[userData.role] ?? "bg-slate-100 text-slate-600"}`}
                      >
                        {userData.role}
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      {roleDropdown === userData._id && (
                        <div className="absolute top-9 left-4 z-20 bg-white border border-slate-200 rounded-lg shadow-md py-1 w-36">
                          {roleOptions.map((r) => (
                            <button
                              key={r}
                              onClick={() => { onUpdateRole(userData._id, r); setRoleDropdown(null); }}
                              className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 transition-colors ${userData.role === r ? "font-semibold text-blue-600" : "text-slate-600"}`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => onRemoveUser(userData._id)}
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

      {/* Close role dropdown on outside click */}
      {roleDropdown && (
        <div className="fixed inset-0 z-10" onClick={() => setRoleDropdown(null)} />
      )}

    </div>
  );
}