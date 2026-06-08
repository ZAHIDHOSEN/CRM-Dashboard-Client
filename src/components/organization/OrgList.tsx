/* eslint-disable @typescript-eslint/no-explicit-any */
import { Building2, Trash2, Plus } from "lucide-react";

interface Props {
  organizations: any[];
  selectedOrg: any;
  onSelect: (org: any) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

export default function OrgList({ organizations, selectedOrg, onSelect, onDelete, onCreate }: Props) {
  return (
    <div className="space-y-3">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-slate-600" />
          <h1 className="text-lg font-semibold text-slate-800">Organizations</h1>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
            {organizations.length} total
          </span>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New
        </button>
      </div>

      {organizations.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">No organizations yet</p>
        </div>
      ) : (
        organizations.map((org) => (
          <div
            key={org._id}
            onClick={() => onSelect(org)}
            className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
              selectedOrg?._id === org._id
                ? "border-blue-500 shadow-sm"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-700 text-sm">{org.name}</p>
                  <p className="text-xs text-slate-400">{org.users?.length ?? 0} members</p>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(org._id); }}
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