//levlpro-mvp\src\components\ProviderDashboard\Network\components\Invites\ReceivedInviteCard.jsx
import { useState } from "react";
import { Check, X, CheckCircle } from "lucide-react";
import { theme } from "../../../../../styles/theme";

export default function ReceivedInviteCard({ invite, onAccept, onDecline }) {
  const [loading, setLoading] = useState(false);
  const sender = invite.sender;
  
  if (!sender) return null;

  const primaryService =
    sender.service_categories?.[0] || sender.services_offered?.[0] || "Service Provider";

  const handleAccept = async () => {
    setLoading(true);
    try {
      await onAccept(invite.id, sender.business_name);
    } catch (error) {
      console.error("Error in handleAccept:", error);
    } finally {
      setLoading(false); // ✅ FIXED: Always reset loading state
    }
  };

  const handleDecline = async () => {
    setLoading(true);
    try {
      await onDecline(invite.id);
    } catch (error) {
      console.error("Error in handleDecline:", error);
    } finally {
      setLoading(false); // ✅ FIXED: Always reset loading state
    }
  };

  return (
    <div className={`${theme.card.base} ${theme.card.padding} border-l-4 border-blue-500`}>
      <div className="flex items-start gap-4">
        {/* Profile Photo */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
          {sender.profile_photo ? (
            <img
              src={sender.profile_photo}
              alt={sender.business_name}
              className="w-full h-full object-cover"
            />
          ) : (
            sender.business_name?.charAt(0).toUpperCase() || "P"
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-slate-900 text-lg">
                  {sender.business_name || "Professional"}
                </h3>
                {sender.verification_status === "verified" && (
                  <CheckCircle className="text-green-600" size={16} />
                )}
              </div>
              <p className="text-sm text-slate-600 capitalize">{primaryService}</p>
            </div>
            <div className="text-xs text-slate-500">
              {new Date(invite.created_at).toLocaleDateString()}
            </div>
          </div>

          {invite.notes && (
            <p className="text-sm text-slate-700 mb-3 p-3 bg-blue-50 rounded-lg">
              "{invite.notes}"
            </p>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleAccept}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Accepting...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Accept
                </>
              )}
            </button>
            <button
              onClick={handleDecline}
              disabled={loading}
              className="flex-1 px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                "Declining..."
              ) : (
                <>
                  <X size={16} />
                  Decline
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}