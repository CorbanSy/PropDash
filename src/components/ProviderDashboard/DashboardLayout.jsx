//propdash-mvp\src\components\ProviderDashboard\DashboardLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import Clients from "./Clients";
import { 
  Home, 
  Calendar, 
  Wand2, 
  Users, 
  Settings 
} from "lucide-react";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* SIDEBAR */}
      <aside className="w-56 bg-white border-r border-slate-200 p-4 hidden sm:block">
        <h1 className="text-lg font-bold mb-6 tracking-tight">
          PropDash
        </h1>

        {/* NAV LINKS */}
        <nav className="space-y-2">
          <SidebarLink to="/provider" icon={Home} label="Home" end />
          <SidebarLink to="/provider/schedule" icon={Calendar} label="Schedule" />
          <SidebarLink to="/provider/quotes" icon={Wand2} label="Quotes" />
          <SidebarLink to="/provider/network" icon={Users} label="Network" />
          <SidebarLink to="/provider/clients" icon={Users} label="Clients" />
          <SidebarLink to="/provider/settings" icon={Settings} label="Settings" />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">
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
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
          isActive
            ? "bg-blue-100 text-blue-700"
            : "text-slate-600 hover:bg-slate-100"
        }`
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );
}

/* ----------------------------- */
/* Mobile Bottom Navigation Bar   */
/* ----------------------------- */

function MobileNav() {
  const navItems = [
    { to: "/provider", icon: Home, label: "Home" },
    { to: "/provider/schedule", icon: Calendar, label: "Schedule" },
    { to: "/provider/quotes", icon: Wand2, label: "Quotes" },
    { to: "/provider/network", icon: Users, label: "Network" },
    { to: "/provider/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 flex justify-around sm:hidden">
      {navItems.map((item, i) => (
        <NavLink
          key={i}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center p-2 text-xs ${
              isActive ? "text-blue-600" : "text-slate-500"
            }`
          }
        >
          <item.icon size={20} />
          <span className="mt-1">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
