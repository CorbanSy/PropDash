import {
  Star,
  MapPin,
  Briefcase,
  Clock,
  ShieldCheck,
  ExternalLink,
  Phone,
  Mail,
  MessageSquare,
  Send,
} from "lucide-react";
import { theme } from "../../../../styles/theme";

export default function PartnerCard({ partner, onClick, onMessage, onRefer }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-success-100 text-success-700";
      case "inactive":
        return "bg-slate-100 text-secondary-600";
      default:
        return "bg-primary-100 text-primary-700";
    }
  };

  return (
    <div className={`${theme.card.base} ${theme.card.padding} relative`}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <img
          src={partner.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.id}`}
          alt={partner.business_name}
          className="w-16 h-16 rounded-full bg-slate-200 border-2 border-slate-300"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className={`${theme.text.h5} truncate`}>
              {partner.business_name || partner.referred_business_name}
            </h3>
            {partner.verified && (
              <ShieldCheck className="text-primary-600 flex-shrink-0" size={18} />
            )}
          </div>
          <p className={`${theme.text.caption} mb-2`}>{partner.trade}</p>
          <div className="flex items-center gap-3">
            {partner.rating && (
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-secondary-700">
                  {partner.rating.toFixed(1)}
                </span>
              </div>
            )}
            {partner.jobsCompleted > 0 && (
              <span className={theme.text.caption}>
                {partner.jobsCompleted} jobs
              </span>
            )}
          </div>
        </div>

        {/* Online Status Badge */}
        {partner.is_online && (
          <div className="absolute top-4 right-4">
            <div className="bg-success-100 text-success-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              Online
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-50 rounded-lg p-2">
          <p className={`${theme.text.caption} mb-1`}>Jobs Referred</p>
          <p className="text-lg font-bold text-secondary-900">{partner.jobsReferred || 0}</p>
        </div>
        <div className="bg-emerald-50 rounded-lg p-2">
          <p className="text-xs text-emerald-700 mb-1">Completed</p>
          <p className="text-lg font-bold text-emerald-900">{partner.jobsCompleted || 0}</p>
        </div>
      </div>

      {/* Info */}
      <div className={`space-y-2 ${theme.text.caption} mb-4`}>
        {partner.location && (
          <div className="flex items-center gap-2">
            <MapPin size={12} />
            <span>{partner.location.city || "Location not set"}</span>
          </div>
        )}
        {partner.avgResponseTime && (
          <div className="flex items-center gap-2">
            <Clock size={12} />
            <span>Responds in ~{partner.avgResponseTime}h</span>
          </div>
        )}
        {partner.specialties && partner.specialties.length > 0 && (
          <div className="flex items-center gap-2">
            <Briefcase size={12} />
            <span className="truncate">{partner.specialties.join(", ")}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {/* View Profile */}
        <button
          onClick={onClick}
          className={`${theme.button.secondaryOutline} text-xs justify-center`}
        >
          <ExternalLink size={14} />
          Profile
        </button>

        {/* Message */}
        <button
          onClick={() => onMessage(partner)}
          className={`${theme.button.primary} text-xs justify-center`}
        >
          <MessageSquare size={14} />
          Message
        </button>

        {/* Refer */}
        <button
          onClick={() => onRefer(partner)}
          className="flex items-center justify-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition text-xs"
        >
          <Send size={14} />
          Refer
        </button>
      </div>

      {/* Status Badge */}
      {partner.status && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(partner.status)}`}>
            {partner.status === "active" ? "Active" : "Inactive"}
          </span>
        </div>
      )}
    </div>
  );
}