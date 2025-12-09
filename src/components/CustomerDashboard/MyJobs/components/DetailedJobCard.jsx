// src/components/CustomerDashboard/MyJobs/components/DetailedJobCard.jsx
import {
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  MapPin,
  Star,
  MessageSquare,
} from "lucide-react";

export default function DetailedJobCard({ job }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle2 size={14} />;
      case "pending":
        return <Clock size={14} />;
      case "completed":
        return <CheckCircle2 size={14} />;
      case "cancelled":
        return <XCircle size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 text-lg mb-2">
            {job.service_name || "Service Request"}
          </h3>
          {job.providers?.business_name && (
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
              <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                {job.providers.business_name}
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            {job.scheduled_date && (
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {formatDate(job.scheduled_date)}
              </span>
            )}
            {job.price && (
              <span className="flex items-center gap-1.5">
                <DollarSign size={14} />
                ${(job.price / 100).toFixed(0)}
              </span>
            )}
            {job.client_address && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                {job.client_address}
              </span>
            )}
          </div>
        </div>
        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold border flex items-center gap-1 ${getStatusColor(
            job.status
          )}`}
        >
          {getStatusIcon(job.status)}
          {job.status.toUpperCase()}
        </span>
      </div>

      {job.notes && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-slate-700">{job.notes}</p>
        </div>
      )}

      <div className="flex gap-2 pt-4 border-t border-slate-200">
        <button className="flex-1 py-2 px-4 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition flex items-center justify-center gap-2">
          <MessageSquare size={16} />
          Message
        </button>
        {job.status === "completed" && (
          <button className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center gap-2">
            <Star size={16} />
            Leave Review
          </button>
        )}
      </div>
    </div>
  );
}