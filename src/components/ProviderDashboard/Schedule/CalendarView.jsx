// src/components/ProviderDashboard/Schedule/CalendarView.jsx
import { useState } from "react";
import { AlertCircle, ChevronLeft, ChevronRight, Ban, Search, Calendar } from "lucide-react";
import { theme } from "../../../styles/theme";
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
    { day: 0, enabled: false }, // Sunday
    { day: 1, enabled: true, blocks: [{ start: "09:00", end: "17:00" }] },
    { day: 2, enabled: true, blocks: [{ start: "09:00", end: "17:00" }] },
    { day: 3, enabled: true, blocks: [{ start: "09:00", end: "17:00" }] },
    { day: 4, enabled: true, blocks: [{ start: "09:00", end: "17:00" }] },
    { day: 5, enabled: true, blocks: [{ start: "09:00", end: "17:00" }] },
    { day: 6, enabled: false }, // Saturday
  ]);
  const [dateOverrides, setDateOverrides] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [quickActionsMenu, setQuickActionsMenu] = useState(null);
  const [draggedJob, setDraggedJob] = useState(null);
  const [dragOverDate, setDragOverDate] = useState(null);

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
    const dateStr = getDateString(date);
    const override = dateOverrides.find((o) => o.date === dateStr);
    if (override) {
      if (override.type === "blocked") return { type: "blocked", reason: override.reason };
      if (override.type === "custom")
        return { type: "custom", blocks: override.blocks || [{ start: override.start, end: override.end }] };
    }

    // Fall back to weekly schedule
    const dayOfWeek = date.getDay();
    const daySchedule = weeklySchedule.find((d) => d.day === dayOfWeek);
    if (daySchedule?.enabled) {
      return { type: "available", blocks: daySchedule.blocks };
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

  // Handle right-click on calendar day
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

  // Handle drag start
  const handleDragStart = (job) => {
    setDraggedJob(job);
  };

  // Handle drag over
  const handleDragOver = (e, date) => {
    e.preventDefault();
    if (!date) return;
    setDragOverDate(date);
  };

  // Handle drop
  const handleDrop = async (date) => {
    if (!draggedJob || !date) return;

    const dateStr = getDateString(date);
    const oldDate = new Date(draggedJob.scheduled_date);
    const time = oldDate.toTimeString().split(" ")[0];

    // Create new datetime
    const [year, month, day] = dateStr.split("-");
    const newDateTime = new Date(`${year}-${month}-${day}T${time}`);

    // TODO: Update job in database
    console.log("Reschedule job", draggedJob.id, "to", newDateTime);

    setDraggedJob(null);
    setDragOverDate(null);
    await refetchJobs();
  };

  const handleDragEnd = () => {
    setDraggedJob(null);
    setDragOverDate(null);
  };

  return (
    <div className="space-y-6">
      {/* Info Alert */}
      <div className={theme.alert.info}>
        <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
        <div>
          <p className="font-semibold text-sm mb-1">Your Availability Calendar</p>
          <p className="text-xs">
            Click dates to manage availability. Right-click for quick actions. Drag jobs to
            reschedule.
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
          color="blue"
        />
        <StatBox label="Upcoming" value={upcomingJobs.length} color="green" />
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
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <ChevronLeft size={18} className="text-slate-600" />
              </button>
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Today
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
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
          <h2 className={theme.text.h2}>Upcoming Bookings ({upcomingJobs.length})</h2>
          <div className="relative w-64">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={18}
            />
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