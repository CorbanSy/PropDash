// src/components/ProviderDashboard/Network/components/Invites/SentInviteCard.jsx
import { useState } from "react";
import { X, Clock } from "lucide-react";
import { theme } from "../../../../../styles/theme";

export default function SentInviteCard({ invite, onCancel }) {
  const [loading, setLoading] = useState(false);
  const recipient = invite.recipient;
  
  if (!recipient) return null;

  const primaryService =
    recipient.service_categories?.[0] ||
    recipient.services_offered?.[0] ||
    "Service Provider";

  const handleCancel = async () => {
    setLoading(true);
    await onCancel(invite.id);
  };

  return (
    <div className={`${theme.card.base} ${theme.card.padding} border-l-4 border-amber-500`}>
      <div className="flex items-start gap-4">
        {/* Profile Photo */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
          {recipient.profile_photo ? (
            <img
              src={recipient.profile_photo}
              alt={recipient.business_name}
              className="w-full h-full object-cover"
            />
          ) : (
            recipient.business_name?.charAt(0).toUpperCase() || "P"
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">
                {recipient.business_name || "Professional"}
              </h3>
              <p className="text-sm text-slate-600 capitalize">{primaryService}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-semibold">
                <Clock size={12} />
                Pending
              </div>
              <div className="text-xs text-slate-500">
                {new Date(invite.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          {invite.notes && (
            <p className="text-sm text-slate-700 mb-3 p-3 bg-amber-50 rounded-lg">
              "{invite.notes}"
            </p>
          )}

          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin"></div>
                Cancelling...
              </>
            ) : (
              <>
                <X size={16} />
                Cancel Invite
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}