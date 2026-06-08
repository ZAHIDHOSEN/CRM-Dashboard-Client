/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useGetAllAuditLogsQuery } from "../../redux/features/auditLog/auditLogApi";
import { ClipboardList, Loader2, Search } from "lucide-react";
import AuditLogTable from "../../components/auditLog/AuditLogTable";

const actionOptions = ["ALL", "CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT"];
const moduleOptions = ["ALL", "User", "Proposal", "Payroll", "Training", "Organization", "Team", "Lead"];

export default function AuditLogPage() {
  const [search, setSearch]           = useState("");
  const [filterAction, setFilterAction] = useState("ALL");
  const [filterModule, setFilterModule] = useState("ALL");

  const { data, isLoading, isError } = useGetAllAuditLogsQuery(undefined);

  const logs = data?.data ?? [];

  const filtered = logs.filter((log: any) => {
    const matchSearch =
      log.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      log.description?.toLowerCase().includes(search.toLowerCase()) ||
      log.module?.toLowerCase().includes(search.toLowerCase());

    const matchAction = filterAction === "ALL" || log.action === filterAction;
    const matchModule = filterModule === "ALL" || log.module === filterModule;

    return matchSearch && matchAction && matchModule;
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
    </div>
  );

  if (isError) return (
    <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
      Failed to load audit logs.
    </div>
  );

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-slate-600" />
          <h1 className="text-lg font-semibold text-slate-800">Audit Logs</h1>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
            {logs.length} total
          </span>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 h-9 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
            />
          </div>

          {/* Action filter */}
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {actionOptions.map((a) => (
              <option key={a} value={a}>{a === "ALL" ? "All Actions" : a}</option>
            ))}
          </select>

          {/* Module filter */}
          <select
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            className="h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {moduleOptions.map((m) => (
              <option key={m} value={m}>{m === "ALL" ? "All Modules" : m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total",   value: logs.length,                                         color: "bg-slate-50 text-slate-700",  dot: "bg-slate-400"  },
          { label: "Creates", value: logs.filter((l: any) => l.action === "CREATE").length, color: "bg-green-50 text-green-700",  dot: "bg-green-500"  },
          { label: "Updates", value: logs.filter((l: any) => l.action === "UPDATE").length, color: "bg-blue-50 text-blue-700",    dot: "bg-blue-500"   },
          { label: "Deletes", value: logs.filter((l: any) => l.action === "DELETE").length, color: "bg-red-50 text-red-700",      dot: "bg-red-500"    },
        ].map(({ label, value, color, dot }) => (
          <div key={label} className={`rounded-xl p-4 flex items-center gap-3 ${color}`}>
            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${dot}`} />
            <div>
              <p className="text-xs opacity-70">{label}</p>
              <p className="text-xl font-semibold">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <AuditLogTable logs={filtered} />

    </div>
  );
}