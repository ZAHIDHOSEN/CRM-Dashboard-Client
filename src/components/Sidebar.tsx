import {LayoutDashboard, Users, Target, FileText,DollarSign, BookOpen, Building2, UsersRound,
  ClipboardList, LogOut, Sun,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router";

const allLinks = [
  { to: "/dashboard",              label: "Dashboard",    icon: LayoutDashboard, roles: ["ADMIN","LEADER","SETTER","CLOSER","INSTALLER","CLIENT"] },
  { to: "/dashboard/users",        label: "Users",        icon: Users,           roles: ["ADMIN"] },
  { to: "/dashboard/leads",        label: "Leads",        icon: Target,          roles: ["ADMIN","LEADER","SETTER","CLOSER"] },
  { to: "/dashboard/proposals",    label: "Proposals",    icon: FileText,        roles: ["ADMIN","LEADER","CLOSER",] },
  { to: "/dashboard/myProposals",  label: "MY Proposals", icon: FileText,        roles: ["CLIENT"] },
  { to: "/dashboard/payroll",      label: "Payroll",      icon: DollarSign,      roles: ["ADMIN","LEADER"] },
  { to: "/dashboard/training",     label: "Training",     icon: BookOpen,        roles: ["ADMIN","LEADER","SETTER","CLOSER","INSTALLER"] },
  { to: "/dashboard/organization", label: "Organization", icon: Building2,       roles: ["ADMIN"] },
  { to: "/dashboard/teams",        label: "Teams",        icon: UsersRound,      roles: ["ADMIN","LEADER"] },
  { to: "/dashboard/audit-log",   label: "Audit Logs",   icon: ClipboardList,   roles: ["ADMIN"] },
];

const roleBadgeColor: Record<string, string> = {
  ADMIN:     "bg-blue-100 text-blue-700",
  LEADER:    "bg-purple-100 text-purple-700",
  SETTER:    "bg-amber-100 text-amber-700",
  CLOSER:    "bg-green-100 text-green-700",
  INSTALLER: "bg-orange-100 text-orange-700",
  CLIENT:    "bg-slate-100 text-slate-600",
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const visibleLinks = allLinks.filter(
    (link) => user && link.roles.includes(user.role)
  );

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full px-3 py-4">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 mb-6">
        <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
          <Sun className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-slate-800 text-sm">SolarCRM</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 flex flex-col gap-0.5">
        {visibleLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="border-t border-slate-200 pt-3 mt-3">
        <div className="flex items-center gap-2.5 px-2 mb-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-blue-700 text-xs font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{user?.name}</p>
            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${roleBadgeColor[user?.role ?? "CLIENT"]}`}>
              {user?.role}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

    </div>
  );
}