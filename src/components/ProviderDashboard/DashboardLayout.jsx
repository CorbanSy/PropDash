// src/components/ProviderDashboard/DashboardLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  FileText, 
  Briefcase,
  Users, 
  Network as NetworkIcon,
  Settings 
} from "lucide-react";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 p-4 hidden sm:block">
        <h1 className="text-xl font-bold mb-6 tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          PropDash
        </h1>

        {/* NAV LINKS */}
        <nav className="space-y-1">
          <SidebarLink to="/provider" icon={Home} label="Home" end />
          <SidebarLink to="/provider/schedule" icon={Calendar} label="Schedule" />
          <SidebarLink to="/provider/jobs" icon={Briefcase} label="Jobs" />
          <SidebarLink to="/provider/quotes" icon={FileText} label="Quotes" />
          <SidebarLink to="/provider/clients" icon={Users} label="Clients" />
          <SidebarLink to="/provider/network" icon={NetworkIcon} label="Network" />
          <SidebarLink to="/provider/settings" icon={Settings} label="Settings" />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 pb-20 sm:pb-6">
        <Outlet />
      </main>

      {/* BOTTOM NAV (Mobile Only) */}
      <MobileNav />
    </div>
  );
}

/* ----------------------------- */
/* Reusable Sidebar Nav Component */
/* ----------------------------- */

function SidebarLink({ to, icon: Icon, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
          isActive
            ? "bg-blue-50 text-blue-700 shadow-sm"
            : "text-slate-600 hover:bg-slate-50"
        }`
      }
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );
}

/* ----------------------------- */
/* Mobile Bottom Navigation Bar   */
/* ----------------------------- */

function MobileNav() {
  const navItems = [
    { to: "/provider", icon: Home, label: "Home" },
    { to: "/provider/jobs", icon: Briefcase, label: "Jobs" },
    { to: "/provider/quotes", icon: FileText, label: "Quotes" },
    { to: "/provider/clients", icon: Users, label: "Clients" },
    { to: "/provider/network", icon: NetworkIcon, label: "Network" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-1 flex justify-around sm:hidden shadow-lg z-50">
      {navItems.map((item, i) => (
        <NavLink
          key={i}
          to={item.to}
          end={item.to === "/provider"}
          className={({ isActive }) =>
            `flex flex-col items-center px-3 py-2 text-[10px] rounded-lg transition min-w-0 ${
              isActive 
                ? "text-blue-600 bg-blue-50" 
                : "text-slate-500"
            }`
          }
        >
          <item.icon size={20} className="mb-0.5" />
          <span className="truncate w-full text-center">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}