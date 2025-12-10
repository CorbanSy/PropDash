// src/components/CustomerDashboard/CustomerDashboardLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import {
  Home,
  Search,
  Briefcase,
  User,
  Plus,
  MessageSquare,
} from "lucide-react";

export default function CustomerDashboardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR */}
      <aside className="w-56 bg-white border-r border-slate-200 p-4 hidden sm:block">
        <h1 className="text-lg font-bold mb-6 tracking-tight">PropDash</h1>

        {/* NAV LINKS */}
        <nav className="space-y-2">
          <SidebarLink to="/customer/dashboard" icon={Home} label="Home" end />
          <SidebarLink
            to="/customer/browse"
            icon={Search}
            label="Browse Pros"
          />
          <SidebarLink to="/customer/jobs" icon={Briefcase} label="My Jobs" />
          <SidebarLink
            to="/customer/messages"
            icon={MessageSquare}
            label="Messages"
          />
          <SidebarLink to="/customer/settings" icon={User} label="Settings" />
        </nav>

        {/* Quick Action */}
        <div className="mt-8">
          <NavLink
            to="/customer/jobs"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition shadow-lg shadow-green-500/30"
          >
            <Plus size={18} />
            Post a Job
          </NavLink>
        </div>
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
            ? "bg-green-100 text-green-700"
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
    { to: "/customer/dashboard", icon: Home, label: "Home" },
    { to: "/customer/browse", icon: Search, label: "Browse" },
    { to: "/customer/jobs", icon: Briefcase, label: "Jobs" },
    { to: "/customer/settings", icon: User, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 flex justify-around sm:hidden z-50">
      {navItems.map((item, i) => (
        <NavLink
          key={i}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center p-2 text-xs ${
              isActive ? "text-green-600" : "text-slate-500"
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