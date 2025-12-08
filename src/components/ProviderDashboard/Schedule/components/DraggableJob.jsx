// src/components/ProviderDashboard/Schedule/components/DraggableJob.jsx
import { Calendar, Clock, GripVertical } from "lucide-react";
import { theme } from "../../../../styles/theme";

export default function DraggableJob({ job, onDragStart, onDragEnd }) {
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
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`${theme.card.base} ${theme.card.padding} ${theme.card.hover} cursor-move`}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <div className="text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing pt-1">
          <GripVertical size={20} />
        </div>

        {/* Content */}
        <div className="flex-1 flex items-start justify-between">
          <div className="flex-1">
            <h3 className={`${theme.text.h4} mb-1`}>{job.service_name || "Service"}</h3>
            <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
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
            <span
              className={`text-xs px-3 py-1 rounded-full font-semibold border ${getStatusColor(
                job.status
              )}`}
            >
              {job.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Drag Hint */}
      <div className="mt-3 pt-3 border-t border-slate-200">
        <p className="text-xs text-slate-500 italic">
          💡 Drag to a calendar date to reschedule
        </p>
      </div>
    </div>
  );
}