/* eslint-disable @typescript-eslint/no-explicit-any */

interface Props {
  teams: any[];
  totalTeams: number;
}

export default function TeamStats({ teams, totalTeams }: Props) {
  const totalMembers = teams.reduce((acc: number, t: any) => acc + (t.members?.length ?? 0), 0);
  const withLeader   = teams.filter((t: any) => t.leader).length;
  const avgMembers   = teams.length ? Math.round(totalMembers / teams.length) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: "Total Teams",    value: totalTeams,    color: "bg-slate-50 text-slate-700",  dot: "bg-slate-400"  },
        { label: "Total Members",  value: totalMembers,  color: "bg-blue-50 text-blue-700",    dot: "bg-blue-500"   },
        { label: "Has Leader",     value: withLeader,    color: "bg-green-50 text-green-700",  dot: "bg-green-500"  },
        { label: "Avg Members",    value: avgMembers,    color: "bg-purple-50 text-purple-700",dot: "bg-purple-500" },
      ].map(({ label, value, color, dot }) => (
        <div key={label} className={`rounded-xl p-4 flex items-center gap-3 ${color}`}>
          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dot}`} />
          <div>
            <p className="text-xs opacity-70">{label}</p>
            <p className="text-xl font-semibold">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}