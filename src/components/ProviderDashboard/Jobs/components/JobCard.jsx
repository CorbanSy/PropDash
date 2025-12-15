// src/components/ProviderDashboard/Jobs/components/JobCard.jsx
import { Calendar, Clock, DollarSign, User, MapPin, AlertCircle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { theme } from "../../../../styles/theme";
import { getStatusBadge, isJobOverdue, getTimeUntilJob } from "../utils/jobHelpers";
import { formatCurrency, formatDate, formatTime } from "../utils/jobCalculations";

export default function JobCard({ job, customers, onClick }) {
  const navigate = useNavigate();
  const statusBadge = getStatusBadge(job.status);
  const overdue = isJobOverdue(job);
  const timeUntil = job.status === "scheduled" ? getTimeUntilJob(job.scheduled_date, job.scheduled_time) : null;

  const customer = customers.find(c => c.id === job.customer_id);
  const clientName = customer?.full_name || job.client_name || "Unknown Client";
  const hasPhotos = job.photos && job.photos.length > 0;

  const handleCreateQuote = (e) => {
    e.stopPropagation();
    navigate('/provider/quotes/new', {
      state: {
        jobId: job.id,
        jobData: {
          clientName: clientName,
          clientEmail: customer?.email || job.client_email,
          clientPhone: customer?.phone || job.client_phone,
          customerId: job.customer_id,
          serviceName: job.service_name,
          address: job.address || job.client_address,
          description: job.description || job.notes,
          photos: job.photos || [],
        }
      }
    });
  };

  const canCreateQuote = ['accepted', 'en_route', 'in_progress'].includes(job.status);

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="bg-white rounded-xl border-2 border-secondary-200 shadow-card p-4 hover:shadow-card-hover hover:border-secondary-300 transition-all duration-300 text-left w-full relative overflow-hidden cursor-pointer"
    >
      {/* Overdue Indicator */}
      {overdue && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-error-500"></div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-secondary-900 truncate">
              {job.service_name || "Service"}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary-600">
            <User size={14} />
            <span className="truncate">{clientName}</span>
          </div>
        </div>

        <span className={`text-xs px-2 py-1 rounded-full font-semibold border-2 whitespace-nowrap ${statusBadge.color}`}>
          {statusBadge.icon} {statusBadge.label}
        </span>
      </div>

      {/* Photos Section */}
      {hasPhotos && (
        <div className="mb-3">
          <div className="flex gap-2 overflow-x-auto">
            {job.photos.slice(0, 3).map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Job photo ${index + 1}`}
                className="w-16 h-16 object-cover rounded-lg border-2 border-secondary-200"
              />
            ))}
            {job.photos.length > 3 && (
              <div className="w-16 h-16 bg-secondary-100 rounded-lg border-2 border-secondary-200 flex items-center justify-center">
                <span className="text-xs font-semibold text-secondary-600">
                  +{job.photos.length - 3}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Date & Time */}
      <div className="space-y-1 mb-3">
        <div className="flex items-center gap-2 text-sm text-secondary-600">
          <Calendar size={14} />
          <span>{formatDate(job.scheduled_date)}</span>
          {timeUntil && (
            <span className={`text-xs px-2 py-0.5 rounded ${
              overdue ? "bg-error-100 text-error-700" : "bg-primary-100 text-primary-700"
            }`}>
              {timeUntil}
            </span>
          )}
        </div>
        
        {job.scheduled_time && (
          <div className="flex items-center gap-2 text-sm text-secondary-600">
            <Clock size={14} />
            <span>{formatTime(job.scheduled_time)}</span>
          </div>
        )}

        {(job.address || job.client_address) && (
          <div className="flex items-center gap-2 text-sm text-secondary-600">
            <MapPin size={14} />
            <span className="truncate">{job.address || job.client_address}</span>
          </div>
        )}
      </div>

      {/* Description */}
      {(job.description || job.notes) && (
        <p className="text-sm text-secondary-600 line-clamp-2 mb-3">
          {job.description || job.notes}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-secondary-200">
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-secondary-600" />
          <span className="text-lg font-bold text-secondary-900">
            {formatCurrency(job.price || job.total || 0)}
          </span>
        </div>

        {job.paid && (
          <span className="text-xs px-2 py-1 bg-success-100 text-success-700 rounded font-semibold">
            💰 PAID
          </span>
        )}

        {!job.paid && job.status === "completed" && (
          <span className="text-xs px-2 py-1 bg-warning-100 text-warning-700 rounded font-semibold">
            ⏳ UNPAID
          </span>
        )}
      </div>

      {/* Create Quote Button */}
      {canCreateQuote && (
        <div className="mt-3 pt-3 border-t border-secondary-200">
          <button
            onClick={handleCreateQuote}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 active:bg-primary-800 transition-all shadow-sm hover:shadow-md"
          >
            <FileText size={16} />
            Create Quote
          </button>
        </div>
      )}

      {/* Overdue Warning */}
      {overdue && (
        <div className="mt-3 pt-3 border-t border-error-200 bg-error-50 -mx-4 -mb-4 px-4 py-2">
          <div className="flex items-center gap-2 text-xs text-error-700">
            <AlertCircle size={14} />
            <span className="font-semibold">This job is overdue</span>
          </div>
        </div>
      )}
    </div>
  );
}