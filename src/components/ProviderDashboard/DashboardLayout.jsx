// src/components/ProviderDashboard/DashboardLayout.jsx
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  FileText, 
  Briefcase,
  Users, 
  Network as NetworkIcon,
  MessageSquare, // ✅ Add this import
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import useAuth from "../../hooks/useAuth";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      await supabase.auth.signOut();
      navigate("/login");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 p-4 hidden sm:flex sm:flex-col">
        <h1 className="text-xl font-bold mb-6 tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          PropDash
        </h1>

        {/* NAV LINKS */}
        <nav className="space-y-1 flex-1">
          <SidebarLink to="/provider" icon={Home} label="Home" end />
          <SidebarLink to="/provider/schedule" icon={Calendar} label="Schedule" />
          <SidebarLink to="/provider/jobs" icon={Briefcase} label="Jobs" />
          <SidebarLink to="/provider/quotes" icon={FileText} label="Quotes" />
          <SidebarLink to="/provider/messages" icon={MessageSquare} label="Messages" /> {/* ✅ Add this */}
          <SidebarLink to="/provider/clients" icon={Users} label="Clients" />
          <SidebarLink to="/provider/network" icon={NetworkIcon} label="Network" />
          <SidebarLink to="/provider/settings" icon={Settings} label="Settings" />
        </nav>

        {/* USER MENU AT BOTTOM */}
        <div className="relative mt-4 pt-4 border-t border-slate-200">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-blue-700 font-bold flex-shrink-0">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </div>
            
            {/* User Info */}
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user?.email || "User"}
              </p>
              <p className="text-xs text-slate-600">Provider</p>
            </div>
            
            {/* Dropdown Icon */}
            <ChevronDown 
              size={16} 
              className={`text-slate-400 transition-transform ${showUserMenu ? "rotate-180" : ""}`} 
            />
          </button>

          {/* DROPDOWN MENU */}
          {showUserMenu && (
            <>
              {/* Backdrop to close menu */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />

              {/* Menu Items */}
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
                <NavLink
                  to="/provider/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
                >
                  <Settings size={16} />
                  Settings
                </NavLink>
                
                <div className="h-px bg-slate-200 my-1"></div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </div>
            </>
          )}
        </div>
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
    { to: "/provider/messages", icon: MessageSquare, label: "Messages" }, // ✅ Add this
    { to: "/provider/clients", icon: Users, label: "Clients" },
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