//levlpro-mvp\src\components\ProviderDashboard\Schedule\Schedule.jsx
import { useState, useEffect } from "react";
import { Calendar, Clock, Settings, PartyPopper } from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import useAuth from "../../../hooks/useAuth";
import { theme } from "../../../styles/theme";
import CalendarView from "./CalendarView";
import WeeklyHours from "./WeeklyHours";
import ScheduleSettings from "./ScheduleSettings";
import Holidays from "./Holidays";

export default function Schedule() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("calendar");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      const { data } = await supabase
        .from("jobs")
        .select("*")
        .eq("provider_id", user.id)
        .order("scheduled_date", { ascending: true });

      if (data) setJobs(data);
      setLoading(false);
    }
    if (user) fetchJobs();
  }, [user]);

  const refetchJobs = async () => {
    const { data } = await supabase
      .from("jobs")
      .select("*")
      .eq("provider_id", user.id)
      .order("scheduled_date", { ascending: true });
    if (data) setJobs(data);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-secondary-700">Loading schedule...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">Schedule & Availability</h1>
        <p className="text-secondary-700 mt-1 leading-relaxed">
          Manage your calendar, set hours, and block dates
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-secondary-200">
        <TabButton
          active={activeTab === "calendar"}
          onClick={() => setActiveTab("calendar")}
          icon={<Calendar size={18} />}
          label="Calendar"
        />
        <TabButton
          active={activeTab === "hours"}
          onClick={() => setActiveTab("hours")}
          icon={<Clock size={18} />}
          label="Weekly Hours"
        />
        <TabButton
          active={activeTab === "holidays"}
          onClick={() => setActiveTab("holidays")}
          icon={<PartyPopper size={18} />}
          label="Holidays"
        />
        <TabButton
          active={activeTab === "settings"}
          onClick={() => setActiveTab("settings")}
          icon={<Settings size={18} />}
          label="Settings"
        />
      </div>

      {/* Tab Content */}
      {activeTab === "calendar" && (
        <CalendarView userId={user.id} jobs={jobs} refetchJobs={refetchJobs} />
      )}
      {activeTab === "hours" && <WeeklyHours userId={user.id} />}
      {activeTab === "holidays" && <Holidays userId={user.id} />}
      {activeTab === "settings" && <ScheduleSettings userId={user.id} />}
    </div>
  );
}

// Tab Button Component
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 font-semibold transition-all duration-200 relative ${
        active ? "text-primary-700" : "text-secondary-600 hover:text-secondary-900"
      }`}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-700"></div>
      )}
    </button>
  );
}