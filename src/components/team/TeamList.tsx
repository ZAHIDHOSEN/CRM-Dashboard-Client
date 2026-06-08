/* eslint-disable @typescript-eslint/no-explicit-any */
import { Users, Trash2, Plus } from "lucide-react";

interface Props {
  teams: any[];
  selectedTeam: any;
  onSelect: (team: any) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

export default function TeamList({ teams, selectedTeam, onSelect, onDelete, onCreate }: Props) {
  return (
    <div className="space-y-3">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-slate-600" />
          <h1 className="text-lg font-semibold text-slate-800">Teams</h1>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
            {teams.length} total
          </span>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Team
        </button>
      </div>

      {/* List */}
      {teams.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">No teams yet</p>
        </div>
      ) : (
        teams.map((team: any) => (
          <div
            key={team._id}
            onClick={() => onSelect(team)}
            className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
              selectedTeam?._id === team._id
                ? "border-blue-500 shadow-sm"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-700 text-sm">{team.name}</p>
                  <p className="text-xs text-slate-400">
                    Leader: {team.leader?.name ?? "—"} · {team.members?.length ?? 0} members
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(team._id); }}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}