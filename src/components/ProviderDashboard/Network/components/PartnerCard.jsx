// src/components/ProviderDashboard/Network/components/PartnerCard.jsx
import {
  Star,
  MapPin,
  Briefcase,
  Clock,
  ShieldCheck,
  ExternalLink,
  Phone,
  Mail,
} from "lucide-react";
import { theme } from "../../../../styles/theme";

export default function PartnerCard({ partner, onClick }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "inactive":
        return "bg-slate-100 text-slate-600";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <button
      onClick={onClick}
      className={`${theme.card.base} ${theme.card.padding} ${theme.card.hover} text-left w-full`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <img
          src={partner.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.id}`}
          alt={partner.business_name}
          className="w-16 h-16 rounded-full bg-slate-200 border-2 border-slate-300"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 truncate">
              {partner.business_name || partner.referred_business_name}
            </h3>
            {partner.verified && (
              <ShieldCheck className="text-blue-600 flex-shrink-0" size={18} />
            )}
          </div>
          <p className="text-sm text-slate-600 mb-2">{partner.trade}</p>
          <div className="flex items-center gap-3">
            {partner.rating && (
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-slate-700">
                  {partner.rating.toFixed(1)}
                </span>
              </div>
            )}
            {partner.jobsCompleted > 0 && (
              <span className="text-xs text-slate-500">
                {partner.jobsCompleted} jobs
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-50 rounded-lg p-2">
          <p className="text-xs text-slate-600 mb-1">Jobs Referred</p>
          <p className="text-lg font-bold text-slate-900">{partner.jobsReferred || 0}</p>
        </div>
        <div className="bg-emerald-50 rounded-lg p-2">
          <p className="text-xs text-emerald-700 mb-1">Completed</p>
          <p className="text-lg font-bold text-emerald-900">{partner.jobsCompleted || 0}</p>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2 text-xs text-slate-600 mb-4">
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

      {/* Quick Actions */}
      <div className="flex gap-2">
        <div className={`flex-1 ${theme.button.provider} justify-center text-sm py-2`}>
          <ExternalLink size={14} />
          View Profile
        </div>
      </div>

      {/* Status Badge */}
      {partner.status && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(partner.status)}`}>
            {partner.status === "active" ? "Active" : "Inactive"}
          </span>
        </div>
      )}
    </button>
  );
}