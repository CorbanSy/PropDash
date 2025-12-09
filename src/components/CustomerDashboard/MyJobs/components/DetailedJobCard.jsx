// src/components/CustomerDashboard/MyJobs/components/DetailedJobCard.jsx
import { useState } from "react";
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
  Edit2,
  Trash2,
} from "lucide-react";

export default function DetailedJobCard({ job, onEdit, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ✅ CRITICAL: Add guard clause RIGHT HERE before any code that uses `job`
  if (!job) {
    return null;
  }

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

  const handleDelete = () => {
    onDelete(job.id);
    setShowDeleteConfirm(false);
  };

  // Only allow editing/deleting pending jobs
  const canEdit = job.status === "pending";

  return (
    <>
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

        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
          {/* Edit & Delete buttons (only for pending jobs) */}
          {canEdit && (
            <>
              <button
                onClick={() => onEdit(job)}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition"
              >
                <Edit2 size={16} />
                Edit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </>
          )}

          {/* Message button */}
          {job.providers?.business_name && (
            <button className="flex-1 py-2 px-4 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition flex items-center justify-center gap-2">
              <MessageSquare size={16} />
              Message
            </button>
          )}

          {/* Review button (only for completed jobs) */}
          {job.status === "completed" && (
            <button className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center gap-2">
              <Star size={16} />
              Leave Review
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Delete Job?
                </h3>
                <p className="text-sm text-slate-600">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-slate-700 mb-6">
              Are you sure you want to delete "{job.service_name}"? This will permanently remove the job posting.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}