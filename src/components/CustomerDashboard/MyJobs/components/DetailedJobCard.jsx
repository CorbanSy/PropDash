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
  Loader,
  TrendingUp,
  Image as ImageIcon,
  X,
} from "lucide-react";

export default function DetailedJobCard({ job, onEdit, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null); // ✅ For photo lightbox

  // ✅ Guard clause
  if (!job) {
    return null;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending_dispatch":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "dispatching":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "accepted":
        return "bg-green-100 text-green-700 border-green-200";
      case "en_route":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "in_progress":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "unassigned":
        return "bg-slate-100 text-slate-700 border-slate-200";
      // Legacy statuses
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending_dispatch":
        return <Clock size={14} />;
      case "dispatching":
        return <Loader size={14} className="animate-spin" />;
      case "accepted":
      case "confirmed":
        return <CheckCircle2 size={14} />;
      case "en_route":
        return <TrendingUp size={14} />;
      case "in_progress":
        return <Loader size={14} />;
      case "completed":
        return <CheckCircle2 size={14} />;
      case "cancelled":
        return <XCircle size={14} />;
      case "unassigned":
        return <AlertCircle size={14} />;
      case "pending":
        return <Clock size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending_dispatch: "Pending Dispatch",
      dispatching: "Finding Provider",
      accepted: "Accepted",
      en_route: "En Route",
      in_progress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
      unassigned: "Unassigned",
      confirmed: "Confirmed",
      pending: "Pending",
    };
    return labels[status] || status.toUpperCase();
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

  // ✅ Allow editing/deleting for pending_dispatch and unassigned jobs
  const canEdit = job.status === "pending_dispatch" || 
                  job.status === "unassigned" ||
                  job.status === "pending";

  const canDelete = canEdit && !job.provider_id;
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
            {getStatusLabel(job.status)}
          </span>
        </div>

        {job.notes && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-slate-700">{job.notes}</p>
          </div>
        )}

        {/* ✅✅✅ PHOTO GALLERY ✅✅✅ */}
        {job.photos && job.photos.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon size={16} className="text-slate-600" />
              <span className="text-sm font-medium text-slate-700">
                Photos ({job.photos.length})
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {job.photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setLightboxImage(photo)}
                  className="relative aspect-square rounded-lg overflow-hidden border-2 border-slate-200 hover:border-teal-500 transition group"
                >
                  <img
                    src={photo}
                    alt={`Job photo ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                    <ImageIcon className="text-white opacity-0 group-hover:opacity-100 transition" size={24} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Badge */}
        {job.category && (
          <div className="mb-4">
            <span className="inline-block bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-medium capitalize">
              {job.category}
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
          {/* Edit & Delete buttons (only for pending jobs) */}
            {canEdit && (
              <>
                <button
                  onClick={() => onEdit(job)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-300 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition"
                >
                  <Edit2 size={16} />
                  Edit
                </button>

                {canDelete ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-100 transition"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                ) : job.provider_id && (
                  <div className="text-xs text-slate-500 italic">
                    Can't delete – job assigned to provider
                  </div>
                )}
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

      {/* ✅✅✅ PHOTO LIGHTBOX ✅✅✅ */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition"
          >
            <X size={24} />
          </button>
          <img
            src={lightboxImage}
            alt="Job photo full size"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

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