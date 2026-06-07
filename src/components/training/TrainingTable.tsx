/* eslint-disable @typescript-eslint/no-explicit-any */
import { BookOpen, Trash2, Eye, EyeOff } from "lucide-react";

const roleColor: Record<string, string> = {
  ADMIN:     "bg-blue-100 text-blue-700",
  LEADER:    "bg-purple-100 text-purple-700",
  SETTER:    "bg-amber-100 text-amber-700",
  CLOSER:    "bg-green-100 text-green-700",
  INSTALLER: "bg-orange-100 text-orange-700",
  CLIENT:    "bg-slate-100 text-slate-600",
};

interface Props {
  trainings: any[];
  onDelete: (id: string) => void;
  onTogglePublish: (id: string) => void;
}

export default function TrainingTable({ trainings, onDelete, onTogglePublish }: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">#</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Title</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Role</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Duration</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">XP Reward</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Created By</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Published</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {trainings.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-slate-400 text-sm">
                  No training modules found
                </td>
              </tr>
            ) : (
              trainings.map((training, index) => (
                <tr key={training._id} className="hover:bg-slate-50 transition-colors">

                  <td className="px-5 py-3.5 text-slate-400 text-xs">{index + 1}</td>

                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-700">{training.title}</p>
                        {training.description && (
                          <p className="text-xs text-slate-400 truncate max-w-[180px]">
                            {training.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${roleColor[training.role] ?? "bg-slate-100 text-slate-600"}`}>
                      {training.role}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-slate-500">
                    {training.duration ? `${training.duration} min` : "—"}
                  </td>

                  <td className="px-5 py-3.5">
                    {training.xpReward ? (
                      <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                        +{training.xpReward} XP
                      </span>
                    ) : "—"}
                  </td>

                  <td className="px-5 py-3.5 text-slate-500">
                    {training.createdBy?.name ?? "—"}
                  </td>

                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => onTogglePublish(training._id)}
                      className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                        training.isPublished
                          ? "bg-green-100 text-green-700 hover:bg-red-50 hover:text-red-600"
                          : "bg-slate-100 text-slate-500 hover:bg-green-50 hover:text-green-600"
                      }`}
                    >
                      {training.isPublished ? (
                        <><Eye className="w-3 h-3" /> Published</>
                      ) : (
                        <><EyeOff className="w-3 h-3" /> Draft</>
                      )}
                    </button>
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => onDelete(training._id)}
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
  );
}