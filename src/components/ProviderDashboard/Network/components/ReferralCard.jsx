// src/components/ProviderDashboard/Network/components/ReferralCard.jsx
import { useState } from "react";
import { Mail, Phone, Send, Clock, CheckCircle2, XCircle, MoreVertical } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { getReferralLifecycle } from "../utils/networkCalculations";

export default function ReferralCard({ referral, onRefresh }) {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusBadge = (status) => {
    switch (status) {
      case "joined":
        return {
          badge: theme.badge.success,
          icon: <CheckCircle2 size={14} />,
          text: "Joined",
        };
      case "pending":
        return {
          badge: theme.badge.warning,
          icon: <Clock size={14} />,
          text: "Pending",
        };
      case "declined":
        return {
          badge: theme.badge.error,
          icon: <XCircle size={14} />,
          text: "Declined",
        };
      default:
        return {
          badge: theme.badge.neutral,
          icon: <Send size={14} />,
          text: status,
        };
    }
  };

  const handleResend = async () => {
    // TODO: Implement resend invitation
    console.log("Resend invitation to:", referral.referred_email);
    setShowMenu(false);
  };

  const handleDelete = async () => {
    if (confirm(`Remove ${referral.referred_business_name} from referrals?`)) {
      // TODO: Implement delete
      console.log("Delete referral:", referral.id);
      setShowMenu(false);
      onRefresh();
    }
  };

  const status = getStatusBadge(referral.status);
  const lifecycle = getReferralLifecycle(referral);

  return (
    <div className={`${theme.card.base} ${theme.card.padding} relative`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        {/* Left Side - Info */}
        <div className="flex items-start gap-3 flex-1">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-700 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
            {referral.referred_business_name?.charAt(0) || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 text-lg mb-1">
              {referral.referred_business_name}
            </h3>
            <div className="space-y-1 text-sm text-slate-600">
              {referral.trade && (
                <p className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                    {referral.trade}
                  </span>
                </p>
              )}
              {referral.referred_email && (
                <p className="flex items-center gap-2">
                  <Mail size={14} />
                  <span className="truncate">{referral.referred_email}</span>
                </p>
              )}
              {referral.referred_phone && (
                <p className="flex items-center gap-2">
                  <Phone size={14} />
                  {referral.referred_phone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Status & Actions */}
        <div className="flex items-start gap-2">
          <span className={`text-xs px-3 py-1 rounded-full font-semibold border flex items-center gap-1 ${status.badge}`}>
            {status.icon}
            {status.text}
          </span>

          {/* More Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-slate-100 rounded transition"
            >
              <MoreVertical size={18} className="text-slate-600" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-20">
                  {referral.status === "pending" && (
                    <button
                      onClick={handleResend}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                    >
                      <Send size={16} />
                      Resend Invitation
                    </button>
                  )}
                  <button
                    onClick={() => {
                      // TODO: View details
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <CheckCircle2 size={16} />
                    View Details
                  </button>
                  <div className="border-t border-slate-200 my-1"></div>
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <XCircle size={16} />
                    Remove
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Referral Lifecycle Progress */}
      {referral.status === "joined" && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-xs font-semibold text-slate-700 mb-3">Referral Progress</p>
          <div className="flex items-center gap-2">
            {lifecycle.map((step, index) => (
              <div key={step.key} className="flex items-center flex-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step.complete
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {step.complete ? "✓" : index + 1}
                </div>
                {index < lifecycle.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-1 ${
                      step.complete ? "bg-green-300" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-slate-600">
            <span>Invited</span>
            <span>Paid</span>
          </div>
        </div>
      )}

      {/* Stats for Joined Partners */}
      {referral.status === "joined" && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="bg-blue-50 rounded-lg p-2 text-center">
            <p className="text-xs text-blue-700 mb-1">Jobs</p>
            <p className="text-lg font-bold text-blue-900">{referral.jobsReferred || 0}</p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-2 text-center">
            <p className="text-xs text-emerald-700 mb-1">Completed</p>
            <p className="text-lg font-bold text-emerald-900">{referral.jobsCompleted || 0}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-2 text-center">
            <p className="text-xs text-purple-700 mb-1">Earned</p>
            <p className="text-lg font-bold text-purple-900">
              ${(referral.commissionsEarned || 0).toFixed(0)}
            </p>
          </div>
        </div>
      )}

      {/* Pending Actions */}
      {referral.status === "pending" && (
        <button
          onClick={handleResend}
          className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition flex items-center justify-center gap-2 border-t border-slate-200 pt-4"
        >
          <Send size={14} />
          Resend Invitation
        </button>
      )}
    </div>
  );
}