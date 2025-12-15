// src/components/ProviderDashboard/Jobs/components/JobCalendarView.jsx
import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { getStatusBadge } from "../utils/jobHelpers";
import { formatCurrency } from "../utils/jobCalculations";

export default function JobCalendarView({ jobs, onJobClick, customers }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const today = () => {
    setCurrentDate(new Date());
  };

  const getJobsForDate = (day) => {
    return jobs.filter(job => {
      if (!job.scheduled_date) return false;
      
      const jobDate = new Date(job.scheduled_date);
      
      return jobDate.getDate() === day &&
             jobDate.getMonth() === month &&
             jobDate.getFullYear() === year;
    });
  };

  const calendarDays = [];
  
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  return (
    <div className="bg-white rounded-xl border-2 border-secondary-200 shadow-card p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-secondary-900">{monthName}</h3>
        <div className="flex gap-2">
          <button
            onClick={today}
            className="border-2 border-secondary-400 text-secondary-700 px-3 py-2 rounded-lg font-semibold hover:bg-secondary-50 active:bg-secondary-100 transition-all"
          >
            Today
          </button>
          <button
            onClick={previousMonth}
            className="border-2 border-secondary-400 text-secondary-700 p-2 rounded-lg font-semibold hover:bg-secondary-50 active:bg-secondary-100 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextMonth}
            className="border-2 border-secondary-400 text-secondary-700 p-2 rounded-lg font-semibold hover:bg-secondary-50 active:bg-secondary-100 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-semibold text-secondary-700 text-sm py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dayJobs = getJobsForDate(day);
          const isTodayDay = isToday(day);

          return (
            <div
              key={day}
              className={`aspect-square border-2 rounded-lg p-2 transition-all duration-200 ${
                isTodayDay
                  ? "border-primary-400 bg-primary-50"
                  : dayJobs.length > 0
                  ? "border-secondary-300 bg-white hover:border-secondary-400 hover:shadow-sm"
                  : "border-secondary-200 hover:border-secondary-300"
              }`}
            >
              <div className={`text-sm font-semibold mb-1 ${
                isTodayDay ? "text-primary-700" : "text-secondary-700"
              }`}>
                {day}
              </div>

              <div className="space-y-1">
                {dayJobs.slice(0, 2).map((job) => {
                  const status = getStatusBadge(job.status);
                  return (
                    <button
                      key={job.id}
                      onClick={() => onJobClick(job)}
                      className={`w-full text-left px-2 py-1 rounded text-xs font-semibold truncate border ${status.color} transition-all duration-200`}
                      title={job.service_name}
                    >
                      {job.service_name}
                    </button>
                  );
                })}
                
                {dayJobs.length > 2 && (
                  <div className="text-xs text-secondary-600 text-center font-medium">
                    +{dayJobs.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Unscheduled Jobs Section */}
      {jobs.filter(j => !j.scheduled_date).length > 0 && (
        <div className="mt-6 pt-6 border-t-2 border-secondary-200">
          <h4 className="text-lg font-semibold text-secondary-900 mb-3">
            📋 Unscheduled Jobs ({jobs.filter(j => !j.scheduled_date).length})
          </h4>
          <p className="text-sm text-secondary-600 mb-3">
            These jobs don't have a scheduled date yet. Click to view details and set a date.
          </p>
          <div className="grid gap-2">
            {jobs.filter(j => !j.scheduled_date).map((job) => {
              const status = getStatusBadge(job.status);
              const customer = customers?.find(c => c.id === job.customer_id);
              return (
                <button
                  key={job.id}
                  onClick={() => onJobClick(job)}
                  className="text-left p-3 border-2 border-secondary-200 rounded-lg hover:border-primary-400 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-secondary-900">{job.service_name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold border ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="text-sm text-secondary-600">
                    {customer?.full_name || job.client_name || "Customer"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Scheduled Jobs Count & Legend */}
      <div className="mt-6 pt-6 border-t-2 border-secondary-200">
        <p className="text-sm text-secondary-600 mb-3">
          Showing {jobs.filter(j => j.scheduled_date).length} scheduled jobs
        </p>
        <p className="text-sm font-semibold text-secondary-900 mb-3">Status Legend:</p>
        <div className="flex flex-wrap gap-3">
          {["accepted", "en_route", "in_progress", "completed"].map((status) => {
            const badge = getStatusBadge(status);
            return (
              <div key={status} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded border-2 ${badge.color}`}></div>
                <span className="text-sm text-secondary-700">{badge.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}