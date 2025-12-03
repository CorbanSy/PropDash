// src/components/ProviderDashboard/Schedule.jsx
import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Ban,
  Settings,
  Search,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import useAuth from "../../hooks/useAuth";
import { theme } from "../../styles/theme";

export default function Schedule() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("calendar");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={theme.text.body}>Loading schedule...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className={theme.text.h1}>Schedule & Availability</h1>
          <p className={`${theme.text.body} mt-1`}>
            Manage your calendar, set hours, and block dates
          </p>
        </div>
        <button className={`hidden sm:flex items-center gap-2 ${theme.button.provider}`}>
          <Plus size={18} />
          Add Booking
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200">
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
          active={activeTab === "settings"}
          onClick={() => setActiveTab("settings")}
          icon={<Settings size={18} />}
          label="Settings"
        />
      </div>

      {/* Tab Content */}
      {activeTab === "calendar" && <CalendarView userId={user.id} jobs={jobs} />}
      {activeTab === "hours" && <WeeklyHours userId={user.id} />}
      {activeTab === "settings" && <ScheduleSettings userId={user.id} />}
    </div>
  );
}

// Tab Button Component
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 font-semibold transition relative ${
        active ? "text-blue-700" : "text-slate-600 hover:text-slate-900"
      }`}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>
      )}
    </button>
  );
}

// Calendar View Component
function CalendarView({ userId, jobs }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [weeklySchedule, setWeeklySchedule] = useState([
    { day: 0, enabled: false }, // Sunday
    { day: 1, enabled: true, start: "09:00", end: "17:00" }, // Monday
    { day: 2, enabled: true, start: "09:00", end: "17:00" },
    { day: 3, enabled: true, start: "09:00", end: "17:00" },
    { day: 4, enabled: true, start: "09:00", end: "17:00" },
    { day: 5, enabled: true, start: "09:00", end: "17:00" },
    { day: 6, enabled: false }, // Saturday
  ]);
  const [dateOverrides, setDateOverrides] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Generate calendar days
  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  // Get schedule for a specific date
  const getScheduleForDate = (date) => {
    if (!date) return null;
    
    // Check for override first
    const dateStr = date.toISOString().split("T")[0];
    const override = dateOverrides.find((o) => o.date === dateStr);
    if (override) {
      if (override.type === "blocked") return { type: "blocked", reason: override.reason };
      if (override.type === "custom") return { type: "custom", start: override.start, end: override.end };
    }

    // Fall back to weekly schedule
    const dayOfWeek = date.getDay();
    const daySchedule = weeklySchedule.find((d) => d.day === dayOfWeek);
    if (daySchedule?.enabled) {
      return { type: "available", start: daySchedule.start, end: daySchedule.end };
    }

    return { type: "unavailable" };
  };

  // Check if date has bookings
  const getJobsForDate = (date) => {
    if (!date) return [];
    return jobs.filter((job) => {
      const jobDate = new Date(job.scheduled_date);
      return jobDate.toDateString() === date.toDateString();
    });
  };

  // Get date info for styling
  const getDateInfo = (date) => {
    if (!date) return { type: "empty" };

    const schedule = getScheduleForDate(date);
    const jobsOnDate = getJobsForDate(date);
    const isPast = date < new Date().setHours(0, 0, 0, 0);

    if (isPast) return { type: "past", schedule };
    if (schedule.type === "blocked") return { type: "blocked", jobs: jobsOnDate, schedule };
    if (jobsOnDate.length > 0) return { type: "booked", jobs: jobsOnDate, schedule };
    if (schedule.type === "custom") return { type: "custom", jobs: jobsOnDate, schedule };
    if (schedule.type === "available") return { type: "available", schedule };
    return { type: "unavailable" };
  };

  const days = generateCalendar();
  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  const upcomingJobs = jobs
    .filter((j) => new Date(j.scheduled_date) > new Date() && j.status !== "cancelled")
    .filter((j) =>
      searchQuery
        ? j.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          j.service_name?.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );

  return (
    <div className="space-y-6">
      {/* Info Alert */}
      <div className={theme.alert.info}>
        <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
        <div>
          <p className="font-semibold text-sm mb-1">Your Availability Calendar</p>
          <p className="text-xs">
            Click any date to view details, block it, or change hours. Use "Block Days" to block multiple dates at once.
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBox
          label="This Month"
          value={jobs.filter((j) => {
            const jobDate = new Date(j.scheduled_date);
            return jobDate.getMonth() === currentMonth.getMonth() &&
                   jobDate.getFullYear() === currentMonth.getFullYear();
          }).length}
          color="blue"
        />
        <StatBox
          label="Upcoming"
          value={upcomingJobs.length}
          color="green"
        />
        <StatBox
          label="Blocked Days"
          value={dateOverrides.filter((o) => o.type === "blocked").length}
          color="orange"
        />
        <StatBox
          label="Custom Hours"
          value={dateOverrides.filter((o) => o.type === "custom").length}
          color="slate"
        />
      </div>

      {/* Calendar Card */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        {/* Calendar Header with Legend */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className={theme.text.h2}>{monthName}</h3>
            <div className="flex gap-2">
              <button onClick={previousMonth} className="p-2 hover:bg-slate-100 rounded-lg transition">
                <ChevronLeft size={18} className="text-slate-600" />
              </button>
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Today
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg transition">
                <ChevronRight size={18} className="text-slate-600" />
              </button>
            </div>
          </div>

          {/* Legend & Block Days Button */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-100 border border-emerald-300 rounded"></div>
                <span className="text-slate-600">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                <span className="text-slate-600">Blocked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-100 border border-amber-300 rounded"></div>
                <span className="text-slate-600">Custom</span>
              </div>
            </div>
            <button
              onClick={() => setShowBlockModal(true)}
              className={`${theme.button.secondary} text-sm`}
            >
              <Ban size={16} />
              Block Days
            </button>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-semibold text-slate-600 text-xs py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid - Compact */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            const dateInfo = getDateInfo(date);
            return (
              <CalendarDay
                key={index}
                date={date}
                dateInfo={dateInfo}
                onClick={() => {
                  if (date) {
                    setSelectedDate(date);
                    setShowModal(true);
                  }
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className={theme.text.h2}>Upcoming Bookings ({upcomingJobs.length})</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${theme.input.base} ${theme.input.provider} pl-10`}
            />
          </div>
        </div>

        {upcomingJobs.length === 0 ? (
          <div className={`${theme.card.base} ${theme.card.padding} text-center py-12`}>
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-slate-400" size={32} />
            </div>
            <p className={`${theme.text.h4} mb-2`}>No Upcoming Bookings</p>
            <p className={theme.text.body}>
              {searchQuery
                ? "No bookings match your search"
                : "Your schedule is clear. Share your booking link to get booked!"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>

      {/* Date Modal */}
      {showModal && selectedDate && (
        <DateModal
          date={selectedDate}
          dateInfo={getDateInfo(selectedDate)}
          weeklySchedule={weeklySchedule}
          onClose={() => setShowModal(false)}
          onBlock={(reason) => {
            const dateStr = selectedDate.toISOString().split("T")[0];
            setDateOverrides([
              ...dateOverrides,
              { date: dateStr, type: "blocked", reason },
            ]);
            setShowModal(false);
          }}
          onUnblock={() => {
            const dateStr = selectedDate.toISOString().split("T")[0];
            setDateOverrides(dateOverrides.filter((o) => o.date !== dateStr));
            setShowModal(false);
          }}
          onCustomHours={(start, end) => {
            const dateStr = selectedDate.toISOString().split("T")[0];
            setDateOverrides([
              ...dateOverrides.filter((o) => o.date !== dateStr),
              { date: dateStr, type: "custom", start, end },
            ]);
            setShowModal(false);
          }}
        />
      )}

      {/* Block Days Modal */}
      {showBlockModal && (
        <BlockDaysModal
          currentMonth={currentMonth}
          dateOverrides={dateOverrides}
          onClose={() => setShowBlockModal(false)}
          onBlock={(dates, reason) => {
            const newOverrides = dates.map((date) => ({
              date: date.toISOString().split("T")[0],
              type: "blocked",
              reason,
            }));
            setDateOverrides([...dateOverrides, ...newOverrides]);
            setShowBlockModal(false);
          }}
        />
      )}
    </div>
  );
}

// Calendar Day Component - Compact with Times
function CalendarDay({ date, dateInfo, onClick }) {
  if (!date) {
    return <div className="h-16"></div>;
  }

  // Format time for display (9a-5p format)
  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "p" : "a";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}${ampm}`;
  };

  const getTimeDisplay = () => {
    if (dateInfo.schedule?.type === "blocked") {
      return <Ban size={14} className="mx-auto" />;
    }
    if (dateInfo.schedule?.type === "custom" || dateInfo.schedule?.type === "available") {
      return (
        <span className="text-[10px] leading-none">
          {formatTime(dateInfo.schedule.start)}-{formatTime(dateInfo.schedule.end)}
        </span>
      );
    }
    return null;
  };

  const styles = {
    past: "bg-slate-50 text-slate-300 cursor-not-allowed",
    unavailable: "bg-slate-100 text-slate-400 hover:bg-slate-150",
    available: "bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer border border-blue-200",
    booked: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer border border-emerald-300",
    blocked: "bg-red-50 text-red-700 hover:bg-red-100 cursor-pointer border border-red-300",
    custom: "bg-amber-50 text-amber-700 hover:bg-amber-100 cursor-pointer border border-amber-300",
  };

  const isToday = date.toDateString() === new Date().toDateString();

  return (
    <button
      onClick={onClick}
      disabled={dateInfo.type === "past"}
      className={`
        h-16 p-1 rounded transition relative flex flex-col items-center justify-center
        ${styles[dateInfo.type]}
        ${isToday ? "ring-2 ring-blue-600" : ""}
      `}
    >
      <span className="text-sm font-semibold mb-0.5">{date.getDate()}</span>
      {getTimeDisplay()}
      {dateInfo.jobs?.length > 0 && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
          {dateInfo.jobs.slice(0, 3).map((_, i) => (
            <div key={i} className="w-1 h-1 bg-current rounded-full"></div>
          ))}
        </div>
      )}
    </button>
  );
}

// Block Days Modal Component
function BlockDaysModal({ currentMonth, dateOverrides, onClose, onBlock }) {
  const [selectedDates, setSelectedDates] = useState([]);
  const [reason, setReason] = useState("");
  const [mode, setMode] = useState("single"); // 'single' or 'range'
  const [rangeStart, setRangeStart] = useState(null);

  // Generate calendar days for current month
  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const days = generateCalendar();

  const isDateSelected = (date) => {
    if (!date) return false;
    return selectedDates.some((d) => d.toDateString() === date.toDateString());
  };

  const toggleDate = (date) => {
    if (!date || date < new Date().setHours(0, 0, 0, 0)) return;

    if (mode === "range") {
      if (!rangeStart) {
        setRangeStart(date);
        setSelectedDates([date]);
      } else {
        // Select all dates in range
        const start = rangeStart < date ? rangeStart : date;
        const end = rangeStart < date ? date : rangeStart;
        const range = [];
        const current = new Date(start);
        while (current <= end) {
          range.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
        setSelectedDates(range);
        setRangeStart(null);
      }
    } else {
      // Single date mode
      if (isDateSelected(date)) {
        setSelectedDates(selectedDates.filter((d) => d.toDateString() !== date.toDateString()));
      } else {
        setSelectedDates([...selectedDates, date]);
      }
    }
  };

  const handleBlock = () => {
    if (selectedDates.length === 0) return;
    onBlock(selectedDates, reason || "Unavailable");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between">
          <div>
            <h2 className={theme.text.h2}>Block Multiple Days</h2>
            <p className={theme.text.caption}>
              Select dates you want to block from your calendar
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setMode("single");
                setRangeStart(null);
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                mode === "single"
                  ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Select Individual Days
            </button>
            <button
              onClick={() => {
                setMode("range");
                setSelectedDates([]);
                setRangeStart(null);
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                mode === "range"
                  ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Select Date Range
            </button>
          </div>

          {mode === "range" && rangeStart && (
            <div className={theme.alert.info}>
              <AlertCircle className="flex-shrink-0" size={20} />
              <p className="text-xs">
                Range starts: {rangeStart.toLocaleDateString()}. Click another date to complete the range.
              </p>
            </div>
          )}

          {/* Calendar */}
          <div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-semibold text-slate-600 text-xs py-1">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((date, index) => {
                if (!date) return <div key={index} className="h-12"></div>;
                
                const isPast = date < new Date().setHours(0, 0, 0, 0);
                const isSelected = isDateSelected(date);
                
                return (
                  <button
                    key={index}
                    onClick={() => toggleDate(date)}
                    disabled={isPast}
                    className={`
                      h-12 rounded text-sm font-medium transition
                      ${isPast ? "bg-slate-50 text-slate-300 cursor-not-allowed" : ""}
                      ${!isPast && !isSelected ? "bg-slate-100 hover:bg-slate-200 text-slate-700" : ""}
                      ${isSelected ? "bg-red-100 text-red-700 border-2 border-red-400" : "border-2 border-transparent"}
                    `}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Count */}
          {selectedDates.length > 0 && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
              <p className="text-sm font-semibold text-blue-900">
                {selectedDates.length} {selectedDates.length === 1 ? "day" : "days"} selected
              </p>
            </div>
          )}

          {/* Reason Input */}
          <div>
            <label className={theme.text.label}>Reason (Optional)</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Vacation, Holiday, Personal"
              className={`${theme.input.base} ${theme.input.provider} mt-2`}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className={`flex-1 ${theme.button.secondary} justify-center`}
            >
              Cancel
            </button>
            <button
              onClick={handleBlock}
              disabled={selectedDates.length === 0}
              className={`flex-1 ${theme.button.provider} justify-center ${
                selectedDates.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Block {selectedDates.length} {selectedDates.length === 1 ? "Day" : "Days"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Date Modal Component (same as before)
function DateModal({ date, dateInfo, weeklySchedule, onClose, onBlock, onUnblock, onCustomHours }) {
  const [view, setView] = useState("overview");
  const [blockReason, setBlockReason] = useState("");
  const [customStart, setCustomStart] = useState("09:00");
  const [customEnd, setCustomEnd] = useState("17:00");

  const dayOfWeek = date.getDay();
  const daySchedule = weeklySchedule.find((d) => d.day === dayOfWeek);

  const formatDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between">
          <div>
            <h2 className={theme.text.h2}>{formatDate}</h2>
            <p className={theme.text.caption}>
              {dateInfo.type === "blocked"
                ? "Blocked"
                : dateInfo.type === "custom"
                ? "Custom Hours"
                : dateInfo.type === "booked"
                ? `${dateInfo.jobs.length} booking(s)`
                : dateInfo.type === "available"
                ? "Available"
                : "Unavailable"}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {view === "overview" && (
            <>
              <div>
                <h3 className={`${theme.text.h4} mb-3`}>Current Status</h3>
                {dateInfo.type === "blocked" && (
                  <div className={theme.alert.error}>
                    <Ban className="flex-shrink-0" size={20} />
                    <div>
                      <p className="font-semibold text-sm">Date Blocked</p>
                      <p className="text-xs mt-1">{dateInfo.schedule.reason}</p>
                    </div>
                  </div>
                )}
                {dateInfo.type === "custom" && (
                  <div className={theme.alert.warning}>
                    <Clock className="flex-shrink-0" size={20} />
                    <div>
                      <p className="font-semibold text-sm">Custom Hours</p>
                      <p className="text-xs mt-1">
                        {dateInfo.schedule.start} - {dateInfo.schedule.end}
                      </p>
                    </div>
                  </div>
                )}
                {dateInfo.type === "available" && (
                  <div className={theme.alert.info}>
                    <CheckCircle2 className="flex-shrink-0" size={20} />
                    <div>
                      <p className="font-semibold text-sm">Available</p>
                      <p className="text-xs mt-1">
                        Regular hours: {daySchedule?.start} - {daySchedule?.end}
                      </p>
                    </div>
                  </div>
                )}
                {dateInfo.type === "unavailable" && (
                  <div className="bg-slate-100 rounded-lg p-4">
                    <p className={theme.text.body}>This day is not in your weekly schedule</p>
                  </div>
                )}
              </div>

              {dateInfo.jobs?.length > 0 && (
                <div>
                  <h3 className={`${theme.text.h4} mb-3`}>Bookings on This Day</h3>
                  <div className="space-y-2">
                    {dateInfo.jobs.map((job) => (
                      <div key={job.id} className="bg-slate-50 rounded-lg p-3">
                        <p className="font-semibold text-slate-900">{job.service_name}</p>
                        <p className={`${theme.text.caption} mt-1`}>
                          {job.client_name} •{" "}
                          {new Date(job.scheduled_date).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {dateInfo.type === "blocked" || dateInfo.type === "custom" ? (
                  <button
                    onClick={onUnblock}
                    className={`w-full ${theme.button.secondary} justify-center`}
                  >
                    <CheckCircle2 size={18} />
                    Remove Override (Use Weekly Schedule)
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setView("block")}
                      className={`w-full ${theme.button.danger} justify-center`}
                    >
                      <Ban size={18} />
                      Block This Date
                    </button>
                    <button
                      onClick={() => setView("custom")}
                      className={`w-full ${theme.button.secondary} justify-center`}
                    >
                      <Clock size={18} />
                      Set Custom Hours
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          {view === "block" && (
            <>
              <div>
                <label className={theme.text.label}>Reason for Blocking (Optional)</label>
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="e.g., Vacation, Holiday, Personal"
                  className={`${theme.input.base} ${theme.input.provider} mt-2`}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setView("overview")}
                  className={`flex-1 ${theme.button.secondary} justify-center`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => onBlock(blockReason || "Unavailable")}
                  className={`flex-1 ${theme.button.danger} justify-center`}
                >
                  Block Date
                </button>
              </div>
            </>
          )}

          {view === "custom" && (
            <>
              <div className="space-y-4">
                <div>
                  <label className={theme.text.label}>Start Time</label>
                  <input
                    type="time"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className={`${theme.input.base} ${theme.input.provider} mt-2`}
                  />
                </div>
                <div>
                  <label className={theme.text.label}>End Time</label>
                  <input
                    type="time"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className={`${theme.input.base} ${theme.input.provider} mt-2`}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setView("overview")}
                  className={`flex-1 ${theme.button.secondary} justify-center`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => onCustomHours(customStart, customEnd)}
                  className={`flex-1 ${theme.button.provider} justify-center`}
                >
                  Save Custom Hours
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Weekly Hours Component
function WeeklyHours({ userId }) {
  const [availability, setAvailability] = useState([
    { day: "Monday", start: "09:00", end: "17:00", enabled: true },
    { day: "Tuesday", start: "09:00", end: "17:00", enabled: true },
    { day: "Wednesday", start: "09:00", end: "17:00", enabled: true },
    { day: "Thursday", start: "09:00", end: "17:00", enabled: true },
    { day: "Friday", start: "09:00", end: "17:00", enabled: true },
    { day: "Saturday", start: "10:00", end: "15:00", enabled: false },
    { day: "Sunday", start: "10:00", end: "15:00", enabled: false },
  ]);
  const [saving, setSaving] = useState(false);

  const toggleDay = (index) => {
    const updated = [...availability];
    updated[index].enabled = !updated[index].enabled;
    setAvailability(updated);
  };

  const updateTime = (index, field, value) => {
    const updated = [...availability];
    updated[index][field] = value;
    setAvailability(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="space-y-6">
      <div className={theme.alert.info}>
        <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
        <div>
          <p className="font-semibold text-sm mb-1">Set Your Regular Hours</p>
          <p className="text-xs">
            These hours repeat every week. You can override specific dates in the Calendar tab.
          </p>
        </div>
      </div>

      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <h3 className={`${theme.text.h3} mb-6`}>Weekly Schedule</h3>
        <div className="space-y-4">
          {availability.map((day, index) => (
            <div
              key={day.day}
              className="flex items-center gap-4 pb-4 border-b border-slate-200 last:border-0"
            >
              <div className="w-32">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={day.enabled}
                    onChange={() => toggleDay(index)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className={`font-semibold ${day.enabled ? "text-slate-900" : "text-slate-400"}`}>
                    {day.day}
                  </span>
                </label>
              </div>

              {day.enabled ? (
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="time"
                    value={day.start}
                    onChange={(e) => updateTime(index, "start", e.target.value)}
                    className={`${theme.input.base} ${theme.input.provider}`}
                  />
                  <span className={theme.text.body}>to</span>
                  <input
                    type="time"
                    value={day.end}
                    onChange={(e) => updateTime(index, "end", e.target.value)}
                    className={`${theme.input.base} ${theme.input.provider}`}
                  />
                </div>
              ) : (
                <span className="text-slate-400 text-sm flex-1">Unavailable</span>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full mt-6 ${theme.button.provider} justify-center`}
        >
          {saving ? "Saving..." : "Save Weekly Schedule"}
        </button>
      </div>
    </div>
  );
}

// Schedule Settings Component
function ScheduleSettings({ userId }) {
  const [settings, setSettings] = useState({
    minAdvanceNotice: "24",
    maxAdvanceBooking: "90",
    bufferTime: "15",
  });

  return (
    <div className="space-y-6">
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <h3 className={`${theme.text.h3} mb-6`}>Booking Preferences</h3>

        <div className="space-y-6">
          <div>
            <label className={theme.text.label}>Minimum Advance Notice</label>
            <p className={`${theme.text.caption} mb-2`}>
              Clients must book at least this far in advance
            </p>
            <select
              value={settings.minAdvanceNotice}
              onChange={(e) => setSettings({ ...settings, minAdvanceNotice: e.target.value })}
              className={`${theme.input.base} ${theme.input.provider}`}
            >
              <option value="0">No minimum</option>
              <option value="2">2 hours</option>
              <option value="4">4 hours</option>
              <option value="12">12 hours</option>
              <option value="24">24 hours (1 day)</option>
              <option value="48">48 hours (2 days)</option>
              <option value="72">72 hours (3 days)</option>
            </select>
          </div>

          <div>
            <label className={theme.text.label}>Maximum Advance Booking</label>
            <p className={`${theme.text.caption} mb-2`}>
              Clients can book up to this far in the future
            </p>
            <select
              value={settings.maxAdvanceBooking}
              onChange={(e) => setSettings({ ...settings, maxAdvanceBooking: e.target.value })}
              className={`${theme.input.base} ${theme.input.provider}`}
            >
              <option value="30">30 days (1 month)</option>
              <option value="60">60 days (2 months)</option>
              <option value="90">90 days (3 months)</option>
              <option value="180">180 days (6 months)</option>
              <option value="365">365 days (1 year)</option>
            </select>
          </div>

          <div>
            <label className={theme.text.label}>Buffer Time Between Appointments</label>
            <p className={`${theme.text.caption} mb-2`}>
              Automatic break time between back-to-back bookings
            </p>
            <select
              value={settings.bufferTime}
              onChange={(e) => setSettings({ ...settings, bufferTime: e.target.value })}
              className={`${theme.input.base} ${theme.input.provider}`}
            >
              <option value="0">No buffer</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
            </select>
          </div>
        </div>

        <button className={`w-full mt-6 ${theme.button.provider} justify-center`}>
          Save Preferences
        </button>
      </div>
    </div>
  );
}

// Job Card Component
function JobCard({ job }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return theme.badge.success;
      case "pending":
        return theme.badge.warning;
      case "completed":
        return theme.badge.info;
      case "cancelled":
        return theme.badge.error;
      default:
        return theme.badge.neutral;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className={`${theme.card.base} ${theme.card.padding} ${theme.card.hover}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className={`${theme.text.h4} mb-1`}>{job.service_name || "Service"}</h3>
          <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formatDate(job.scheduled_date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {formatTime(job.scheduled_date)}
            </span>
          </div>
          <p className={theme.text.body}>{job.client_name}</p>
        </div>

        <div className="text-right">
          <p className="text-xl font-bold text-slate-900 mb-2">
            ${(job.price / 100).toFixed(0)}
          </p>
          <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${getStatusColor(job.status)}`}>
            {job.status.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}

// Stat Box Component
function StatBox({ label, value, color }) {
  const colorClasses = {
    blue: theme.statCard.blue,
    green: theme.statCard.green,
    slate: theme.statCard.slate,
    orange: theme.statCard.orange,
  };

  return (
    <div className={`${colorClasses[color]} border rounded-xl p-4 text-center`}>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-sm font-semibold opacity-80">{label}</p>
    </div>
  );
}