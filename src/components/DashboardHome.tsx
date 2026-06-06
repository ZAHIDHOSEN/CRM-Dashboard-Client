import { useAuth } from "../context/AuthContext";
import {
  User, Mail, Shield, Building2,
  DollarSign, CheckCircle, Clock, BookOpen,
} from "lucide-react";

const roleBadgeColor: Record<string, string> = {
  ADMIN:     "bg-blue-100 text-blue-700",
  LEADER:    "bg-purple-100 text-purple-700",
  SETTER:    "bg-amber-100 text-amber-700",
  CLOSER:    "bg-green-100 text-green-700",
  INSTALLER: "bg-orange-100 text-orange-700",
  CLIENT:    "bg-slate-100 text-slate-600",
};

export default function DashboardHome() {
  const { user } = useAuth();

  const stats = [
    {
      label: "Commission Balance",
      value: `$${user?.commission_balance ?? 0}`,
      icon: DollarSign,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Account Status",
      value: user?.isApproved ? "Approved" : "Pending",
      icon: user?.isApproved ? CheckCircle : Clock,
      color: user?.isApproved ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600",
    },
    {
      label: "Role",
      value: user?.role ?? "—",
      icon: Shield,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Certifications",
      value: user?.certifications?.length ?? 0,
      icon: BookOpen,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">

      {/* Welcome banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center gap-5">
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <span className="text-blue-700 text-xl font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Here's your account overview
          </p>
        </div>
        <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-medium ${roleBadgeColor[user?.role ?? "CLIENT"]}`}>
          {user?.role}
        </span>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-base font-semibold text-slate-800 mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Profile info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Profile Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
            <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-400">Full name</p>
              <p className="text-sm font-medium text-slate-700">{user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
            <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-400">Email</p>
              <p className="text-sm font-medium text-slate-700">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
            <Shield className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-400">Role</p>
              <p className="text-sm font-medium text-slate-700">{user?.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
            <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-400">Organization</p>
              <p className="text-sm font-medium text-slate-700">
                {user?.organization ? "Assigned" : "Not assigned"}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Certifications */}
      {user?.certifications && user.certifications.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Certifications</h2>
          <div className="flex flex-wrap gap-2">
            {user.certifications.map((cert, i) => (
              <span
                key={i}
                className="text-xs bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1 rounded-full"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}