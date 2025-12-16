// src/components/ProviderDashboard/DashboardLayout.jsx
import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  FileText, 
  Briefcase,
  Users, 
  Network as NetworkIcon,
  MessageSquare,
  Settings,
  LogOut,
  ChevronDown,
  Wrench,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import useAuth from "../../hooks/useAuth";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [availableJobsCount, setAvailableJobsCount] = useState(0);

  // Fetch available jobs count
  const fetchAvailableJobsCount = async () => {
    if (!user) return;

    try {
      const { data: providerData } = await supabase
        .from("providers")
        .select("service_categories")
        .eq("id", user.id)
        .single();

      if (!providerData?.service_categories?.length) {
        setAvailableJobsCount(0);
        return;
      }

      const { count } = await supabase
        .from("jobs")
        .select("*", { count: "exact", head: true })
        .in("status", ["pending_dispatch", "dispatching", "unassigned"])
        .is("provider_id", null)
        .in("category", providerData.service_categories);

      setAvailableJobsCount(count || 0);
    } catch (error) {
      console.error("Error fetching available jobs count:", error);
    }
  };

  useEffect(() => {
    fetchAvailableJobsCount();

    // Listen for custom event when job is accepted
    const handleJobAccepted = () => {
      console.log("Job accepted event received, refreshing badge count...");
      setTimeout(() => {
        fetchAvailableJobsCount();
      }, 1000);
    };

    window.addEventListener("jobAccepted", handleJobAccepted);

    // Set up real-time subscription for jobs changes
    const channel = supabase
      .channel("available-jobs-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "jobs",
        },
        (payload) => {
          console.log("Job change detected:", payload);
          setTimeout(() => {
            fetchAvailableJobsCount();
          }, 500);
        }
      )
      .subscribe();

    return () => {
      window.removeEventListener("jobAccepted", handleJobAccepted);
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      await supabase.auth.signOut();
      navigate("/login");
    }
  };

  return (
    <div className="flex min-h-screen bg-secondary-50">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-secondary-200 p-4 hidden sm:flex sm:flex-col shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="bg-primary-700 p-2 rounded-lg">
            <Wrench className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-secondary-900">
            PropDash
          </h1>
        </div>

        {/* NAV LINKS */}
        <nav className="space-y-1 flex-1">
          <SidebarLink to="/provider" icon={Home} label="Home" end />
          <SidebarLink to="/provider/schedule" icon={Calendar} label="Schedule" />
          <SidebarLink 
            to="/provider/jobs" 
            icon={Briefcase} 
            label="Jobs" 
            badge={availableJobsCount > 0 ? availableJobsCount : null}
          />
          <SidebarLink to="/provider/quotes" icon={FileText} label="Quotes" />
          <SidebarLink to="/provider/messages" icon={MessageSquare} label="Messages" />
          <SidebarLink to="/provider/clients" icon={Users} label="Clients" />
          <SidebarLink to="/provider/network" icon={NetworkIcon} label="Network" />
          <SidebarLink to="/provider/settings" icon={Settings} label="Settings" />
        </nav>

        {/* USER MENU AT BOTTOM */}
        <div className="relative mt-4 pt-4 border-t border-secondary-200">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary-100 transition-all duration-200"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 font-bold flex-shrink-0">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </div>
            
            {/* User Info */}
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-semibold text-secondary-900 truncate">
                {user?.email || "User"}
              </p>
              <p className="text-xs text-secondary-600">Provider</p>
            </div>
            
            {/* Dropdown Icon */}
            <ChevronDown 
              size={16} 
              className={`text-secondary-400 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`} 
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
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-2xl border border-secondary-200 py-2 z-50">
                <NavLink
                  to="/provider/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 transition-all duration-200"
                >
                  <Settings size={16} />
                  Settings
                </NavLink>
                
                <div className="h-px bg-secondary-200 my-1"></div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-all duration-200"
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
      <MobileNav availableJobsCount={availableJobsCount} />
    </div>
  );
}

/* ----------------------------- */
/* Reusable Sidebar Nav Component */
/* ----------------------------- */

function SidebarLink({ to, icon: Icon, label, end, badge }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative ${
          isActive
            ? "bg-primary-100 text-primary-800 shadow-sm font-semibold"
            : "text-secondary-700 hover:bg-secondary-100 hover:text-secondary-900"
        }`
      }
    >
      <Icon size={20} />
      <span>{label}</span>
      {badge && (
        <span className="ml-auto bg-accent-600 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center animate-pulse">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

/* ----------------------------- */
/* Mobile Bottom Navigation Bar   */
/* ----------------------------- */

function MobileNav({ availableJobsCount }) {
  const navItems = [
    { to: "/provider", icon: Home, label: "Home" },
    { to: "/provider/jobs", icon: Briefcase, label: "Jobs", badge: availableJobsCount > 0 ? availableJobsCount : null },
    { to: "/provider/quotes", icon: FileText, label: "Quotes" },
    { to: "/provider/messages", icon: MessageSquare, label: "Messages" },
    { to: "/provider/clients", icon: Users, label: "Clients" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-secondary-200 px-2 py-1 flex justify-around sm:hidden shadow-lg z-50">
      {navItems.map((item, i) => (
        <NavLink
          key={i}
          to={item.to}
          end={item.to === "/provider"}
          className={({ isActive }) =>
            `flex flex-col items-center px-3 py-2 text-[10px] rounded-lg transition-all duration-200 min-w-0 relative ${
              isActive 
                ? "text-primary-700 bg-primary-50 font-semibold" 
                : "text-secondary-500 hover:text-secondary-700"
            }`
          }
        >
          <div className="relative">
            <item.icon size={20} className="mb-0.5" />
            {item.badge && (
              <span className="absolute -top-1 -right-1 bg-accent-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center leading-none animate-pulse">
                {item.badge}
              </span>
            )}
          </div>
          <span className="truncate w-full text-center">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}