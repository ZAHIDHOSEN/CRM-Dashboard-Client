/* eslint-disable @typescript-eslint/no-explicit-any */

interface Props {
  trainings: any[];
}

export default function TrainingStats({ trainings }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: "Total",     value: trainings.length,                                       color: "bg-slate-50 text-slate-700", dot: "bg-slate-400" },
        { label: "Published", value: trainings.filter((t) => t.isPublished).length,          color: "bg-green-50 text-green-700", dot: "bg-green-500" },
        { label: "Draft",     value: trainings.filter((t) => !t.isPublished).length,         color: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
        { label: "Roles",     value: [...new Set(trainings.map((t) => t.role))].length,      color: "bg-blue-50 text-blue-700",   dot: "bg-blue-500"  },
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