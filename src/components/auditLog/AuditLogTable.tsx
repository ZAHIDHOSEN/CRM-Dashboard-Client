/* eslint-disable @typescript-eslint/no-explicit-any */

const moduleColor: Record<string, string> = {
  User: "bg-blue-100 text-blue-700",
  Proposal: "bg-purple-100 text-purple-700",
  Payroll: "bg-green-100 text-green-700",
  Training: "bg-amber-100 text-amber-700",
  Organization: "bg-orange-100 text-orange-700",
  Team: "bg-teal-100 text-teal-700",
  Lead: "bg-slate-100 text-slate-600",
};

const actionColor: Record<string, string> = {
  CREATE: "bg-green-100 text-green-700",
  UPDATE: "bg-blue-100 text-blue-700",
  DELETE: "bg-red-100 text-red-700",
  LOGIN: "bg-purple-100 text-purple-700",
  LOGOUT: "bg-slate-100 text-slate-600",
};

interface Props {
  logs: any[];
}

// Custom time ago function
const getTimeAgo = (dateString: string) => {
  const now = new Date().getTime();
  const date = new Date(dateString).getTime();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return `${diff} sec ago`;

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;

  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
};


export default function AuditLogTable({ logs }: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3">#</th>
              <th className="text-left px-5 py-3">User</th>
              <th className="text-left px-5 py-3">Action</th>
              <th className="text-left px-5 py-3">Module</th>
              <th className="text-left px-5 py-3">Description</th>
              <th className="text-left px-5 py-3">Organization</th>
              <th className="text-left px-5 py-3">Time</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-400">
                  No audit logs found
                </td>
              </tr>
            ) : (
              logs.map((log: any, index: number) => (
                <tr key={log._id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">{index + 1}</td>

                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-700 text-xs font-semibold">
                          {log.user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      <div>
                        <p className="font-medium text-slate-700">
                          {log.user?.name ?? "—"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {log.user?.role ?? ""}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        actionColor[log.action] ??
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>

                  <td className="px-5 py-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        moduleColor[log.module] ??
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {log.module}
                    </span>
                  </td>

                  <td className="px-5 py-3 text-slate-500 max-w-[200px] truncate">
                    {log.description ?? "—"}
                  </td>

                  <td className="px-5 py-3 text-slate-500">
                    {log.organization?.name ?? "—"}
                  </td>

                  <td className="px-5 py-3 text-slate-400">
                    {log.createdAt
                      ? getTimeAgo(log.createdAt)
                      : "—"}
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