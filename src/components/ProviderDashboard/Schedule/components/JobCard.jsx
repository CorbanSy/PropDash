// src/components/ProviderDashboard/Schedule/components/JobCard.jsx
import { Calendar, Clock } from "lucide-react";

export default function JobCard({ job }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-success-100 text-success-800 border-success-300";
      case "pending":
        return "bg-warning-100 text-warning-800 border-warning-300";
      case "completed":
        return "bg-primary-100 text-primary-800 border-primary-300";
      case "cancelled":
        return "bg-error-100 text-error-800 border-error-300";
      default:
        return "bg-secondary-100 text-secondary-800 border-secondary-300";
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
    <div className="bg-white rounded-xl border-2 border-secondary-200 shadow-card p-4 hover:shadow-card-hover hover:border-secondary-300 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-secondary-900 mb-1">{job.service_name || "Service"}</h3>
          <div className="flex items-center gap-4 text-sm text-secondary-600 mb-3">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formatDate(job.scheduled_date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {formatTime(job.scheduled_date)}
            </span>
          </div>
          <p className="text-secondary-700 leading-relaxed">{job.client_name}</p>
        </div>

        <div className="text-right">
          <p className="text-xl font-bold text-secondary-900 mb-2">
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
  );
}