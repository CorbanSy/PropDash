//levlpro-mvp\src\components\ProviderDashboard\Schedule\CalendarView.jsx
import { useState, useEffect } from "react";
import { AlertCircle, ChevronLeft, ChevronRight, Ban, Search, Calendar } from "lucide-react";
import { theme } from "../../../styles/theme";
import { supabase } from "../../../lib/supabaseClient";
import { getDateString } from "./utils/timeUtils";
import CalendarDay from "./components/CalendarDay";
import DateModal from "./components/DateModal";
import BlockDaysModal from "./components/BlockDaysModal";
import QuickActionsMenu from "./components/QuickActionsMenu";
import JobCard from "./components/JobCard";
import StatBox from "./components/StatBox";
import DraggableJob from "./components/DraggableJob";

export default function CalendarView({ userId, jobs, refetchJobs }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [weeklySchedule, setWeeklySchedule] = useState([
    { day: 0, enabled: false },
    { day: 1, enabled: true, blocks: [{ start: "09:00", end: "17:00" }] },
    { day: 2, enabled: true, blocks: [{ start: "09:00", end: "17:00" }] },
    { day: 3, enabled: true, blocks: [{ start: "09:00", end: "17:00" }] },
    { day: 4, enabled: true, blocks: [{ start: "09:00", end: "17:00" }] },
    { day: 5, enabled: true, blocks: [{ start: "09:00", end: "17:00" }] },
    { day: 6, enabled: false },
  ]);
  const [dateOverrides, setDateOverrides] = useState([]);
  const [holidaySettings, setHolidaySettings] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [quickActionsMenu, setQuickActionsMenu] = useState(null);
  const [draggedJob, setDraggedJob] = useState(null);
  const [dragOverDate, setDragOverDate] = useState(null);

  useEffect(() => {
    async function loadWeeklyHours() {
      const { data } = await supabase
        .from("provider_weekly_hours")
        .select("*")
        .eq("provider_id", userId)
        .maybeSingle();

      if (data && data.availability) {
        const dayMap = {
          Sunday: 0,
          Monday: 1,
          Tuesday: 2,
          Wednesday: 3,
          Thursday: 4,
          Friday: 5,
          Saturday: 6,
        };

        const schedule = data.availability.map((dayData) => ({
          day: dayMap[dayData.day],
          enabled: dayData.enabled,
          blocks: dayData.blocks,
        }));

        setWeeklySchedule(schedule);
      }
    }

    if (userId) {
      loadWeeklyHours();
    }
  }, [userId]);

  useEffect(() => {
    async function loadHolidaySettings() {
      const year = currentMonth.getFullYear();
      
      const { data } = await supabase
        .from("provider_holiday_settings")
        .select("*")
        .eq("provider_id", userId)
        .eq("year", year)
        .maybeSingle();

      setHolidaySettings(data);
    }

    if (userId) {
      loadHolidaySettings();
    }
  }, [userId, currentMonth]);

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

  const getScheduleForDate = (date) => {
    if (!date) return null;

    const dateStr = getDateString(date);

    if (holidaySettings?.blocked_holidays?.includes(dateStr)) {
      if (holidaySettings.custom_hours?.[dateStr]) {
        const { start, end } = holidaySettings.custom_hours[dateStr];
        return { 
          type: "custom", 
          blocks: [{ start, end }],
          reason: "Holiday Hours"
        };
      }
      return { type: "blocked", reason: "Holiday" };
    }

    const override = dateOverrides.find((o) => o.date === dateStr);
    if (override) {
      if (override.type === "blocked") return { type: "blocked", reason: override.reason };
      if (override.type === "custom")
        return { type: "custom", blocks: override.blocks || [{ start: override.start, end: override.end }] };
    }

    const dayOfWeek = date.getDay();
    const daySchedule = weeklySchedule.find((d) => d.day === dayOfWeek);
    if (daySchedule?.enabled) {
      return { type: "available", blocks: daySchedule.blocks };
    }

    return { type: "unavailable" };
  };

  const getJobsForDate = (date) => {
    if (!date) return [];
    return jobs.filter((job) => {
      const jobDate = new Date(job.scheduled_date);
      return jobDate.toDateString() === date.toDateString();
    });
  };

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

  const handleContextMenu = (e, date) => {
    e.preventDefault();
    if (!date) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setQuickActionsMenu({
      date,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleDragStart = (job) => {
    setDraggedJob(job);
  };

  const handleDragOver = (e, date) => {
    e.preventDefault();
    if (!date) return;
    setDragOverDate(date);
  };

  const handleDrop = async (date) => {
    if (!draggedJob || !date) return;

    const dateStr = getDateString(date);
    const oldDate = new Date(draggedJob.scheduled_date);
    const time = oldDate.toTimeString().split(" ")[0];

    const [year, month, day] = dateStr.split("-");
    const newDateTime = new Date(`${year}-${month}-${day}T${time}`);

    console.log("Reschedule job", draggedJob.id, "to", newDateTime);

    setDraggedJob(null);
    setDragOverDate(null);
    await refetchJobs();
  };

  const handleDragEnd = () => {
    setDraggedJob(null);
    setDragOverDate(null);
  };

  const blockedDaysCount = 
    dateOverrides.filter((o) => o.type === "blocked").length +
    (holidaySettings?.blocked_holidays?.length || 0);

  const customHoursCount = 
    dateOverrides.filter((o) => o.type === "custom").length +
    (Object.keys(holidaySettings?.custom_hours || {}).length);

  return (
    <div className="space-y-6">
      {/* Info Alert */}
      <div className="bg-primary-50 border-2 border-primary-300 text-primary-900 p-4 rounded-lg shadow-sm flex items-start gap-3">
        <AlertCircle className="flex-shrink-0 mt-0.5 text-primary-700" size={20} />
        <div>
          <p className="font-semibold text-sm mb-1">Your Availability Calendar</p>
          <p className="text-xs text-primary-700">
            Click dates to manage availability. Right-click for quick actions. Drag jobs to
            reschedule. Holidays are automatically applied.
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBox
          label="This Month"
          value={jobs.filter((j) => {
            const jobDate = new Date(j.scheduled_date);
            return (
              jobDate.getMonth() === currentMonth.getMonth() &&
              jobDate.getFullYear() === currentMonth.getFullYear()
            );
          }).length}
          color="primary"
        />
        <StatBox label="Upcoming" value={upcomingJobs.length} color="success" />
        <StatBox
          label="Blocked Days"
          value={blockedDaysCount}
          color="warning"
        />
        <StatBox
          label="Custom Hours"
          value={customHoursCount}
          color="secondary"
        />
      </div>

      {/* Calendar Card */}
      <div className="bg-white rounded-xl border-2 border-secondary-200 shadow-card p-6">
        {/* Calendar Header with Legend */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-secondary-900">{monthName}</h3>
            <div className="flex gap-2">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-secondary-100 rounded-lg transition-all duration-200"
              >
                <ChevronLeft size={18} className="text-secondary-600" />
              </button>
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="px-3 py-1.5 text-sm font-semibold text-secondary-700 hover:bg-secondary-100 rounded-lg transition-all duration-200"
              >
                Today
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-secondary-100 rounded-lg transition-all duration-200"
              >
                <ChevronRight size={18} className="text-secondary-600" />
              </button>
            </div>
          </div>

          {/* Legend & Block Days Button */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success-100 border border-success-300 rounded"></div>
                <span className="text-secondary-600 font-medium">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-error-100 border border-error-300 rounded"></div>
                <span className="text-secondary-600 font-medium">Blocked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-warning-100 border border-warning-300 rounded"></div>
                <span className="text-secondary-600 font-medium">Custom</span>
              </div>
            </div>
            <button
              onClick={() => setShowBlockModal(true)}
              className="border-2 border-secondary-400 text-secondary-700 px-4 py-2 rounded-lg font-semibold hover:bg-secondary-50 active:bg-secondary-100 transition-all inline-flex items-center gap-2 text-sm"
            >
              <Ban size={16} />
              Block Days
            </button>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-semibold text-secondary-700 text-xs py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            const dateInfo = getDateInfo(date);
            const isDragOver = dragOverDate && date && date.toDateString() === dragOverDate.toDateString();

            return (
              <CalendarDay
                key={index}
                date={date}
                dateInfo={dateInfo}
                isDragOver={isDragOver}
                onClick={() => {
                  if (date) {
                    setSelectedDate(date);
                    setShowModal(true);
                  }
                }}
                onContextMenu={(e) => handleContextMenu(e, date)}
                onDragOver={(e) => handleDragOver(e, date)}
                onDrop={() => handleDrop(date)}
              />
            );
          })}
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-secondary-900">Upcoming Bookings ({upcomingJobs.length})</h2>
          <div className="relative w-64">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all"
            />
          </div>
        </div>

        {upcomingJobs.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-secondary-200 shadow-card p-6 text-center py-12">
            <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-secondary-400" size={32} />
            </div>
            <p className="text-lg font-semibold text-secondary-900 mb-2">No Upcoming Bookings</p>
            <p className="text-secondary-600">
              {searchQuery
                ? "No bookings match your search"
                : "Your schedule is clear. Share your booking link to get booked!"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingJobs.map((job) => (
              <DraggableJob
                key={job.id}
                job={job}
                onDragStart={() => handleDragStart(job)}
                onDragEnd={handleDragEnd}
              />
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
            const dateStr = getDateString(selectedDate);
            setDateOverrides([...dateOverrides, { date: dateStr, type: "blocked", reason }]);
            setShowModal(false);
          }}
          onUnblock={() => {
            const dateStr = getDateString(selectedDate);
            setDateOverrides(dateOverrides.filter((o) => o.date !== dateStr));
            setShowModal(false);
          }}
          onCustomHours={(blocks) => {
            const dateStr = getDateString(selectedDate);
            setDateOverrides([
              ...dateOverrides.filter((o) => o.date !== dateStr),
              { date: dateStr, type: "custom", blocks },
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
              date: getDateString(date),
              type: "blocked",
              reason,
            }));
            setDateOverrides([...dateOverrides, ...newOverrides]);
            setShowBlockModal(false);
          }}
        />
      )}

      {/* Quick Actions Menu */}
      {quickActionsMenu && (
        <QuickActionsMenu
          date={quickActionsMenu.date}
          x={quickActionsMenu.x}
          y={quickActionsMenu.y}
          dateInfo={getDateInfo(quickActionsMenu.date)}
          onClose={() => setQuickActionsMenu(null)}
          onViewDetails={() => {
            setSelectedDate(quickActionsMenu.date);
            setShowModal(true);
            setQuickActionsMenu(null);
          }}
          onBlockDate={() => {
            const dateStr = getDateString(quickActionsMenu.date);
            setDateOverrides([
              ...dateOverrides,
              { date: dateStr, type: "blocked", reason: "Unavailable" },
            ]);
            setQuickActionsMenu(null);
          }}
          onSetCustomHours={() => {
            setSelectedDate(quickActionsMenu.date);
            setShowModal(true);
            setQuickActionsMenu(null);
          }}
        />
      )}
    </div>
  );
}