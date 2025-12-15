// src/components/ProviderDashboard/Jobs/components/AvailableJobCard.jsx
import { useState } from "react";
import {
  MapPin,
  Calendar,
  DollarSign,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../../../../lib/supabaseClient";
import useAuth from "../../../../hooks/useAuth";

export default function AvailableJobCard({ job, customers, onAccept }) {
  const { user } = useAuth();
  const [accepting, setAccepting] = useState(false);

  const customer = customers.find((c) => c.id === job.customer_id);
  const clientName = customer?.full_name || job.client_name || "Customer";

  const handleAccept = async () => {
    if (!user) {
      alert("Please log in to accept jobs");
      return;
    }

    setAccepting(true);

    try {
      const { data, error } = await supabase.rpc("accept_job", {
        p_job_id: job.id,
        p_provider_id: user.id,
      });

      if (error) {
        console.error("Error accepting job:", error);
        alert("Failed to accept job. It may have been assigned to another provider.");
        setAccepting(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      await onAccept();
      alert("Job accepted! Switching to 'My Jobs' tab...");
    } catch (err) {
      console.error("Exception accepting job:", err);
      alert("Failed to accept job");
      setAccepting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Flexible";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending_dispatch: { bg: "bg-warning-100", text: "text-warning-700", label: "Pending" },
      dispatching: { bg: "bg-primary-100", text: "text-primary-700", label: "Dispatching" },
      unassigned: { bg: "bg-secondary-100", text: "text-secondary-700", label: "Unassigned" },
    };
    return badges[status] || badges.unassigned;
  };

  const badge = getStatusBadge(job.status);

  return (
    <div className="bg-white rounded-xl border-2 border-accent-300 p-6 hover:shadow-lg hover:border-accent-400 transition-all duration-300 shadow-card">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-secondary-900 mb-1">
            {job.service_name || "Service Request"}
          </h3>
          <div className="flex items-center gap-2 text-sm text-secondary-600">
            <User size={14} />
            <span>{clientName}</span>
          </div>
        </div>
        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold ${badge.bg} ${badge.text}`}
        >
          {badge.label}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        {job.client_address && (
          <div className="flex items-center gap-2 text-sm text-secondary-600">
            <MapPin size={14} className="flex-shrink-0" />
            <span className="truncate">{job.client_address}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-secondary-600">
          <Calendar size={14} />
          <span>{formatDate(job.scheduled_date)}</span>
        </div>

        {job.price && (
          <div className="flex items-center gap-2 text-sm font-semibold text-success-600">
            <DollarSign size={14} />
            <span>${(job.price / 100).toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Description */}
      {job.notes && (
        <p className="text-sm text-secondary-600 mb-4 line-clamp-2">{job.notes}</p>
      )}

      {/* Category Badge */}
      {job.category && (
        <div className="mb-4">
          <span className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold capitalize">
            {job.category}
          </span>
        </div>
      )}

      {/* Accept Button */}
      <button
        onClick={handleAccept}
        disabled={accepting}
        className="w-full bg-gradient-to-r from-accent-600 to-accent-700 text-white py-3 rounded-lg font-semibold hover:from-accent-700 hover:to-accent-800 transition-all shadow-sm hover:shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {accepting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Accepting...
          </>
        ) : (
          <>
            <CheckCircle size={18} />
            Accept Job
          </>
        )}
      </button>

      {/* Urgency indicator */}
      {job.status === "dispatching" && (
        <div className="mt-3 flex items-center gap-2 text-xs text-warning-700 bg-warning-50 border-2 border-warning-200 rounded-lg p-2">
          <Clock size={14} />
          <span className="font-medium">Time-sensitive - being offered to multiple providers</span>
        </div>
      )}
    </div>
  );
}