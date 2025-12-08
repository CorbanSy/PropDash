// src/components/ProviderDashboard/Clients/components/ClientCard.jsx
import { Mail, Phone, MapPin, DollarSign, Briefcase, Star } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { getClientStatus, formatCurrency } from "../utils/clientCalculations";

export default function ClientCard({ client, jobs, onClick }) {
  const totalSpent = jobs
    .filter(j => j.status === "completed")
    .reduce((sum, j) => sum + (j.total || 0), 0);

  const status = getClientStatus(jobs);

  const statusColors = {
    green: "bg-green-100 text-green-700 border-green-200",
    amber: "bg-amber-100 text-amber-700 border-amber-200",
    red: "bg-red-100 text-red-700 border-red-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
  };

  return (
    <button
      onClick={onClick}
      className={`${theme.card.base} ${theme.card.padding} ${theme.card.hover} text-left w-full`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-blue-700 font-bold text-lg flex-shrink-0">
            {(client.full_name || "?").charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 truncate mb-1">
              {client.full_name || "Unknown Client"}
            </h3>
            
            {/* Contact Info */}
            <div className="space-y-1">
              {client.email && (
                <p className="text-xs text-slate-600 flex items-center gap-1 truncate">
                  <Mail size={12} />
                  {client.email}
                </p>
              )}
              {client.phone && (
                <p className="text-xs text-slate-600 flex items-center gap-1">
                  <Phone size={12} />
                  {client.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <span className={`text-xs px-2 py-1 rounded-full font-semibold border ${statusColors[status.color]}`}>
          {status.status}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-xs text-slate-600 mb-1">Total Spent</p>
          <p className="text-lg font-bold text-slate-900">{formatCurrency(totalSpent)}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs text-blue-700 mb-1">Jobs</p>
          <p className="text-lg font-bold text-blue-900">{jobs.length}</p>
        </div>
      </div>

      {/* Tags */}
      {client.tags && client.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {client.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded font-medium"
            >
              {tag}
            </span>
          ))}
          {client.tags.length > 3 && (
            <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">
              +{client.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Internal Rating */}
      {client.internal_rating && (
        <div className="flex items-center gap-1 pt-3 border-t border-slate-200">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={14}
              className={
                star <= client.internal_rating
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-slate-300"
              }
            />
          ))}
          <span className="text-xs text-slate-600 ml-1">
            Internal Rating
          </span>
        </div>
      )}
    </button>
  );
}