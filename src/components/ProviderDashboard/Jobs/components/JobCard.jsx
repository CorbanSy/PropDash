// src/components/ProviderDashboard/Jobs/components/JobCard.jsx
import { Calendar, Clock, DollarSign, User, MapPin, AlertCircle } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { getStatusBadge, isJobOverdue, getTimeUntilJob } from "../utils/jobHelpers";
import { formatCurrency, formatDate, formatTime } from "../utils/jobCalculations";

export default function JobCard({ job, customers, onClick }) {
  const statusBadge = getStatusBadge(job.status);
  const overdue = isJobOverdue(job);
  const timeUntil = job.status === "scheduled" ? getTimeUntilJob(job.scheduled_date, job.scheduled_time) : null;

  // Get customer name
  const customer = customers.find(c => c.id === job.customer_id);
  const clientName = customer?.full_name || job.client_name || "Unknown Client";

  return (
    <button
      onClick={onClick}
      className={`${theme.card.base} ${theme.card.padding} ${theme.card.hover} text-left w-full relative overflow-hidden`}
    >
      {/* Overdue Indicator */}
      {overdue && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-500"></div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 truncate">
              {job.service_name || "Service"}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <User size={14} />
            <span className="truncate">{clientName}</span>
          </div>
        </div>

        <span className={`text-xs px-2 py-1 rounded-full font-semibold border whitespace-nowrap ${statusBadge.color}`}>
          {statusBadge.icon} {statusBadge.label}
        </span>
      </div>

      {/* Date & Time */}
      <div className="space-y-1 mb-3">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar size={14} />
          <span>{formatDate(job.scheduled_date)}</span>
          {timeUntil && (
            <span className={`text-xs px-2 py-0.5 rounded ${
              overdue ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
            }`}>
              {timeUntil}
            </span>
          )}
        </div>
        
        {job.scheduled_time && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock size={14} />
            <span>{formatTime(job.scheduled_time)}</span>
          </div>
        )}

        {job.address && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin size={14} />
            <span className="truncate">{job.address}</span>
          </div>
        )}
      </div>

      {/* Description */}
      {job.description && (
        <p className="text-sm text-slate-600 line-clamp-2 mb-3">
          {job.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-slate-600" />
          <span className="text-lg font-bold text-slate-900">
            {formatCurrency(job.total || 0)}
          </span>
        </div>

        {job.paid && (
          <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded font-semibold">
            💰 PAID
          </span>
        )}

        {!job.paid && job.status === "completed" && (
          <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded font-semibold">
            ⏳ UNPAID
          </span>
        )}
      </div>

      {/* Overdue Warning */}
      {overdue && (
        <div className="mt-3 pt-3 border-t border-red-200 bg-red-50 -mx-4 -mb-4 px-4 py-2">
          <div className="flex items-center gap-2 text-xs text-red-700">
            <AlertCircle size={14} />
            <span className="font-semibold">This job is overdue</span>
          </div>
        </div>
      )}
    </button>
  );
}