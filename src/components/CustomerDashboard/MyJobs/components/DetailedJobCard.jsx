//levlpro-mvp\src\components\CustomerDashboard\MyJobs\components\DetailedJobCard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  FileText,
  Eye,
} from "lucide-react";
import { theme } from "../../../../styles/theme";
import { supabase } from "../../../../lib/supabaseClient";
import useAuth from "../../../../hooks/useAuth";

export default function DetailedJobCard({ job, onEdit, onDelete }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [quote, setQuote] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(true);

  // Fetch quote for this job
  useEffect(() => {
    if (job?.id) {
      fetchQuote();
    }
  }, [job?.id]);

  const fetchQuote = async () => {
    setLoadingQuote(true);
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("job_id", job.id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (data && data.length > 0 && !error) {
      setQuote(data[0]);
    } else {
      setQuote(null);
    }
    setLoadingQuote(false);
  };

  const handleQuoteAction = async (action) => {
    const newStatus = action === "accept" ? "approved" : "declined";
    
    const { error } = await supabase
      .from("quotes")
      .update({ status: newStatus })
      .eq("id", quote.id);

    if (!error) {
      setQuote({ ...quote, status: newStatus });
      
      if (action === "accept") {
        alert("Quote accepted! The provider will contact you soon.");
      } else {
        alert("Quote declined.");
      }
    } else {
      alert("Failed to update quote. Please try again.");
    }
  };

  // Handle messaging with provider
  const handleMessage = async () => {
    if (!job.provider_id || !user) return;

    try {
      // Check if conversation already exists
      const { data: existingConversation, error: fetchError } = await supabase
        .from("conversations")
        .select("id")
        .eq("customer_id", user.id)
        .eq("provider_id", job.provider_id)
        .maybeSingle();

      if (existingConversation) {
        navigate(`/customer/messages?conversation=${existingConversation.id}`);
        return;
      }

      // Create new conversation
      const { data: newConversation, error: createError } = await supabase
        .from("conversations")
        .insert({
          customer_id: user.id,
          provider_id: job.provider_id,
          job_id: job.id,
          last_message_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) throw createError;

      navigate(`/customer/messages?conversation=${newConversation.id}`);
    } catch (error) {
      console.error("Error handling message:", error);
      navigate("/customer/messages");
    }
  };

  const formatCurrency = (cents) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (!job) {
    return null;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending_dispatch":
        return "bg-warning-100 text-warning-700 border-warning-200";
      case "dispatching":
        return "bg-primary-100 text-primary-700 border-primary-200";
      case "accepted":
      case "confirmed":
        return "bg-success-100 text-success-700 border-success-200";
      case "en_route":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "in_progress":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "cancelled":
        return "bg-error-100 text-error-700 border-error-200";
      case "unassigned":
      case "pending":
        return "bg-secondary-100 text-secondary-700 border-secondary-200";
      default:
        return "bg-secondary-100 text-secondary-700 border-secondary-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending_dispatch":
      case "pending":
        return <Clock size={14} />;
      case "dispatching":
        return <Loader size={14} className="animate-spin" />;
      case "accepted":
      case "confirmed":
      case "completed":
        return <CheckCircle2 size={14} />;
      case "en_route":
        return <TrendingUp size={14} />;
      case "in_progress":
        return <Loader size={14} />;
      case "cancelled":
        return <XCircle size={14} />;
      case "unassigned":
        return <AlertCircle size={14} />;
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

  const canEdit = job.status === "pending_dispatch" || 
                  job.status === "unassigned" ||
                  job.status === "pending";

  const canDelete = canEdit && !job.provider_id;

  return (
    <>
      <div className={`${theme.card.base} ${theme.card.padding} ${theme.card.hover}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className={`${theme.text.h4} mb-2`}>
              {job.service_name || "Service Request"}
            </h3>
            {job.providers?.business_name && (
              <div className={`flex items-center gap-2 ${theme.text.caption} mb-3`}>
                <div className="bg-primary-100 text-primary-700 px-2 py-1 rounded font-medium">
                  {job.providers.business_name}
                </div>
              </div>
            )}
            <div className={`flex flex-wrap gap-4 ${theme.text.caption}`}>
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
            className={`text-xs px-3 py-1 rounded-full font-semibold border-2 flex items-center gap-1 ${getStatusColor(
              job.status
            )}`}
          >
            {getStatusIcon(job.status)}
            {getStatusLabel(job.status)}
          </span>
        </div>

        {job.notes && (
          <div className="bg-secondary-50 border-2 border-secondary-200 rounded-xl p-3 mb-4">
            <p className={theme.text.caption}>{job.notes}</p>
          </div>
        )}

        {/* QUOTE SECTION */}
        {!loadingQuote && quote && (
          <div className="mb-4 border-2 border-primary-200 rounded-xl overflow-hidden shadow-card">
            {/* Quote Header */}
            <div className="bg-primary-50 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="text-primary-600" size={20} />
                <h4 className="font-semibold text-primary-900">Quote Received</h4>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold border ${
                quote.status === "approved" ? "bg-success-100 text-success-800 border-success-300" :
                quote.status === "declined" ? "bg-error-100 text-error-800 border-error-300" :
                quote.status === "viewed" ? "bg-primary-100 text-primary-800 border-primary-300" :
                "bg-warning-100 text-warning-800 border-warning-300"
              }`}>
                {quote.status.toUpperCase()}
              </span>
            </div>

            {/* Quote Details */}
            <div className="p-4 bg-white">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className={theme.text.caption}>Service:</span>
                  <span className={`font-semibold ${theme.text.body}`}>{quote.service_name}</span>
                </div>
                {quote.description && (
                  <div>
                    <span className={`${theme.text.caption} block mb-1`}>Description:</span>
                    <p className={theme.text.caption}>{quote.description}</p>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t-2 border-secondary-200">
                  <span className={theme.text.caption}>Line Items:</span>
                  <span className={`font-medium ${theme.text.body}`}>{quote.line_items?.length || 0} items</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold pt-2 border-t-2 border-secondary-200">
                  <span className="text-secondary-900">Total:</span>
                  <span className="text-primary-700">{formatCurrency(quote.total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {(quote.status === "sent" || quote.status === "viewed") && (
                  <>
                    <button
                      onClick={() => handleQuoteAction("accept")}
                      className="flex-1 flex items-center justify-center gap-2 bg-success-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-success-700 transition-all duration-300 shadow-lg shadow-success-500/20"
                    >
                      <CheckCircle2 size={16} />
                      Accept
                    </button>
                    <button
                      onClick={() => handleQuoteAction("decline")}
                      className="flex-1 flex items-center justify-center gap-2 bg-error-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-error-700 transition-all duration-300 shadow-lg shadow-error-500/20"
                    >
                      <XCircle size={16} />
                      Decline
                    </button>
                  </>
                )}
                <a
                  href={`/quotes/${quote.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary-700 transition-all duration-300 shadow-lg shadow-primary-500/20"
                >
                  <Eye size={16} />
                  View Full Quote
                </a>
              </div>

              {quote.status === "approved" && (
                <div className="mt-3 bg-success-50 border-2 border-success-200 rounded-xl p-3 text-center">
                  <p className="text-sm text-success-800 font-medium">
                    ✓ Quote accepted! The provider will contact you soon.
                  </p>
                </div>
              )}

              {quote.status === "declined" && (
                <div className="mt-3 bg-error-50 border-2 border-error-200 rounded-xl p-3 text-center">
                  <p className="text-sm text-error-800 font-medium">
                    Quote declined.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PHOTO GALLERY */}
        {job.photos && job.photos.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon size={16} className="text-secondary-600" />
              <span className={`${theme.text.caption} font-medium text-secondary-700`}>
                Photos ({job.photos.length})
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {job.photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setLightboxImage(photo)}
                  className="relative aspect-square rounded-xl overflow-hidden border-2 border-secondary-200 hover:border-primary-500 transition-all duration-300 group"
                >
                  <img
                    src={photo}
                    alt={`Job photo ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <ImageIcon className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300" size={24} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Badge */}
        {job.category && (
          <div className="mb-4">
            <span className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-medium capitalize border border-primary-300">
              {job.category}
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-4 border-t-2 border-secondary-200">
          {/* Edit & Delete buttons */}
          {canEdit && (
            <>
              <button
                onClick={() => onEdit(job)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-50 border-2 border-primary-300 text-primary-700 rounded-xl font-medium hover:bg-primary-100 transition-all duration-300"
              >
                <Edit2 size={16} />
                Edit
              </button>

              {canDelete ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-error-50 border-2 border-error-300 text-error-700 rounded-xl font-medium hover:bg-error-100 transition-all duration-300"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              ) : job.provider_id && (
                <div className={`${theme.text.caption} italic`}>
                  Can't delete – job assigned to provider
                </div>
              )}
            </>
          )}

          {/* Message button */}
          {job.provider_id && job.providers?.business_name && (
            <button 
              onClick={handleMessage}
              className={`flex-1 ${theme.button.secondary} justify-center`}
            >
              <MessageSquare size={16} />
              Message
            </button>
          )}

          {/* Review button */}
          {job.status === "completed" && (
            <button className="flex-1 py-2 px-4 bg-success-600 text-white rounded-xl font-medium hover:bg-success-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-success-500/20">
              <Star size={16} />
              Leave Review
            </button>
          )}
        </div>
      </div>

      {/* PHOTO LIGHTBOX */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all duration-300"
          >
            <X size={24} />
          </button>
          <img
            src={lightboxImage}
            alt="Job photo full size"
            className="max-w-full max-h-full object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-error-100 p-3 rounded-xl">
                <Trash2 className="text-error-600" size={24} />
              </div>
              <div>
                <h3 className={`${theme.text.h3}`}>
                  Delete Job?
                </h3>
                <p className={theme.text.caption}>This action cannot be undone</p>
              </div>
            </div>

            <p className={`${theme.text.body} mb-6`}>
              Are you sure you want to delete "{job.service_name}"? This will permanently remove the job posting.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={`${theme.button.secondary} flex-1`}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className={`${theme.button.danger} flex-1`}
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