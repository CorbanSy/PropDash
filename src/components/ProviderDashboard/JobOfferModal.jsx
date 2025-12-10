// src/components/ProviderDashboard/JobOfferModal.jsx
import { useState, useEffect } from "react";
import {
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Wrench,
  AlertTriangle,
  User,
  Navigation2,
} from "lucide-react";

export default function JobOfferModal({ jobOffer, onAccept, onDecline, onTimeout }) {
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

  useEffect(() => {
    if (!jobOffer) return;

    // Calculate initial time remaining
    const offeredAt = new Date(jobOffer.offered_at);
    const now = new Date();
    const elapsed = Math.floor((now - offeredAt) / 1000);
    const remaining = Math.max(0, 300 - elapsed);
    
    setTimeRemaining(remaining);

    // If already expired, trigger timeout immediately
    if (remaining === 0) {
      onTimeout();
      return;
    }

    // Countdown timer
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(interval);
          onTimeout();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [jobOffer, onTimeout]);

  if (!jobOffer) return null;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isUrgent = timeRemaining < 60;

  const formatDate = (dateString) => {
    if (!dateString) return "Flexible";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAccept = async () => {
    setIsAccepting(true);
    await onAccept();
  };

  const handleDecline = async () => {
    setIsDeclining(true);
    await onDecline();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl animate-slideUp">
        {/* Header with Timer */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-full">
                <Wrench className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">New Job Offer! 🎉</h2>
                <p className="text-blue-100 text-sm">Respond quickly to win this job</p>
              </div>
            </div>
            
            {/* Countdown Timer */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              isUrgent ? "bg-red-500 animate-pulse" : "bg-white/20"
            }`}>
              <Clock className="text-white" size={20} />
              <span className="text-white font-bold text-lg">
                {minutes}:{seconds.toString().padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="p-6 space-y-5">
          {/* Job Title & Category */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {jobOffer.service_name}
            </h3>
            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium capitalize">
              {jobOffer.category}
            </span>
          </div>

          {/* Customer & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
              <User className="text-blue-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="text-xs font-medium text-slate-600 mb-1">Customer</p>
                <p className="text-sm font-semibold text-slate-900">
                  {jobOffer.customer_name || "New Client"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
              <Calendar className="text-blue-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="text-xs font-medium text-slate-600 mb-1">Schedule</p>
                <p className="text-sm font-semibold text-slate-900">
                  {formatDate(jobOffer.scheduled_date)}
                </p>
              </div>
            </div>
          </div>

          {/* Location with Distance */}
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl">
            <MapPin className="text-blue-600 flex-shrink-0 mt-1" size={20} />
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-600 mb-1">Location</p>
              <p className="text-sm font-semibold text-slate-900 mb-1">
                {jobOffer.client_address || "Address not provided"}
              </p>
              <div className="flex items-center gap-2">
                <Navigation2 size={14} className="text-blue-600" />
                <p className="text-xs text-blue-700 font-medium">
                  ~{jobOffer.distance_km?.toFixed(1) || "0"} km away
                </p>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Job Description</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              {jobOffer.notes || "No additional details provided."}
            </p>
          </div>

          {/* Urgent Warning */}
          {isUrgent && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3 animate-pulse">
              <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-semibold text-red-900">Time running out!</p>
                <p className="text-xs text-red-700 mt-1">
                  Accept now or this job will be offered to another provider.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              onClick={handleDecline}
              disabled={isDeclining || isAccepting}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeclining ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-700 border-t-transparent rounded-full animate-spin"></div>
                  Declining...
                </>
              ) : (
                <>
                  <XCircle size={20} />
                  Decline
                </>
              )}
            </button>

            <button
              onClick={handleAccept}
              disabled={isAccepting || isDeclining}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
            >
              {isAccepting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Accepting...
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  Accept Job
                </>
              )}
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-slate-600 mb-1">Distance</p>
                <p className="font-bold text-slate-900">
                  {jobOffer.distance_km?.toFixed(1) || "0"} km
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Priority</p>
                <p className="font-bold text-blue-600">
                  {jobOffer.scheduled_date ? "Scheduled" : "ASAP"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Time Left</p>
                <p className={`font-bold ${isUrgent ? "text-red-600" : "text-emerald-600"}`}>
                  {minutes}:{seconds.toString().padStart(2, "0")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}