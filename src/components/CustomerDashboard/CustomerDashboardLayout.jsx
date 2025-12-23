//levlpro-mvp\src\components\CustomerDashboard\CustomerDashboardLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import {
  Home,
  Search,
  Briefcase,
  User,
  Plus,
  MessageSquare,
  ChevronDown,
  ShoppingBag,
  LogOut,
  Settings,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import useAuth from "../../hooks/useAuth";

export default function CustomerDashboardLayout() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [fullName, setFullName] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch customer profile data
  useEffect(() => {
    async function fetchCustomerProfile() {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from("customers")
        .select("profile_photo, full_name")
        .eq("id", user.id)
        .single();
      
      if (data) {
        setProfilePhoto(data.profile_photo);
        setFullName(data.full_name);
      }
    }
    
    fetchCustomerProfile();

    // Listen for profile updates
    const handleProfileUpdate = () => {
      fetchCustomerProfile();
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    // Set up real-time subscription for profile changes
    const profileChannel = supabase
      .channel("customer-profile-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "customers",
          filter: `id=eq.${user?.id}`,
        },
        (payload) => {
          if (payload.new.profile_photo !== profilePhoto) {
            setProfilePhoto(payload.new.profile_photo);
          }
          if (payload.new.full_name !== fullName) {
            setFullName(payload.new.full_name);
          }
        }
      )
      .subscribe();

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
      supabase.removeChannel(profileChannel);
    };
  }, [user?.id]);

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      await supabase.auth.signOut();
      navigate("/login");
    }
  };

  return (
    <div className="flex min-h-screen bg-secondary-50">
      {/* SIDEBAR - Fixed height with scrollable nav */}
      <aside className="w-64 bg-white border-r border-secondary-200 hidden sm:flex sm:flex-col shadow-sm fixed h-screen">
        {/* Logo - Fixed at top */}
        <div className="flex items-center gap-3 mb-6 px-6 pt-4">
          <div className="bg-primary-600 p-2 rounded-lg">
            <ShoppingBag className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-secondary-900">
            LevlPro
          </h1>
        </div>

        {/* NAV LINKS - Scrollable section */}
        <nav className="space-y-1 flex-1 overflow-y-auto px-4">
          <SidebarLink to="/customer/dashboard" icon={Home} label="Home" end />
          <SidebarLink to="/customer/browse" icon={Search} label="Browse Pros" />
          <SidebarLink to="/customer/jobs" icon={Briefcase} label="My Jobs" />
          <SidebarLink
            to="/customer/messages"
            icon={MessageSquare}
            label="Messages"
          />
          <SidebarLink to="/customer/settings" icon={User} label="Settings" />
        </nav>

        {/* USER MENU - Fixed at bottom */}
        <div className="relative mt-4 pt-4 border-t border-secondary-200 px-4 pb-4">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary-100 transition-all duration-200"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 font-bold flex-shrink-0 overflow-hidden">
              {profilePhoto ? (
                <img 
                  src={profilePhoto} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{fullName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "C"}</span>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-semibold text-secondary-900 truncate">
                {fullName || user?.email || "Customer"}
              </p>
              <p className="text-xs text-secondary-600">Customer</p>
            </div>

            {/* Chevron */}
            <ChevronDown
              size={16}
              className={`text-secondary-400 transition-transform duration-200 ${
                showUserMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* BACKDROP */}
          {showUserMenu && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowUserMenu(false)}
            />
          )}

          {/* DROPDOWN */}
          {showUserMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-2xl border border-secondary-200 py-2 z-50">
              <NavLink
                to="/customer/settings"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 transition-all duration-200"
              >
                <Settings size={16} />
                Settings
              </NavLink>

              <div className="h-px bg-secondary-200 my-1" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-all duration-200"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT - Add left margin to account for fixed sidebar */}
      <main className="flex-1 p-6 pb-20 sm:pb-6 sm:ml-64">
        <Outlet />
      </main>

      {/* MOBILE NAV */}
      <MobileNav />
    </div>
  );
}

/* ----------------------------- */
/* Sidebar Nav Link              */
/* ----------------------------- */

function SidebarLink({ to, icon: Icon, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-primary-100 text-primary-800 shadow-sm font-semibold"
            : "text-secondary-700 hover:bg-secondary-100 hover:text-secondary-900"
        }`
      }
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );
}

/* ----------------------------- */
/* Mobile Bottom Navigation      */
/* ----------------------------- */

function MobileNav() {
  const navItems = [
    { to: "/customer/dashboard", icon: Home, label: "Home" },
    { to: "/customer/browse", icon: Search, label: "Browse" },
    { to: "/customer/jobs", icon: Briefcase, label: "Jobs" },
    { to: "/customer/messages", icon: MessageSquare, label: "Messages" },
    { to: "/customer/settings", icon: User, label: "Settings" },
  ];

  return (
    <>
      {/* Floating Post Job Button */}
      <NavLink
        to="/customer/jobs"
        className="fixed bottom-16 right-4 bg-gradient-to-r from-success-600 to-emerald-600 text-white p-4 rounded-full shadow-xl shadow-success-500/30 sm:hidden z-50 hover:scale-105 transition"
      >
        <Plus size={22} />
      </NavLink>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-secondary-200 px-2 py-1 flex justify-around sm:hidden shadow-lg z-50">
        {navItems.map((item, i) => (
          <NavLink
            key={i}
            to={item.to}
            end={item.to === "/customer/dashboard"}
            className={({ isActive }) =>
              `flex flex-col items-center px-3 py-2 text-[10px] rounded-lg transition-all duration-200 min-w-0 ${
                isActive
                  ? "text-primary-700 bg-primary-50 font-semibold"
                  : "text-secondary-500 hover:text-secondary-700"
              }`
            }
          >
            <item.icon size={20} className="mb-0.5" />
            <span className="truncate w-full text-center">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}