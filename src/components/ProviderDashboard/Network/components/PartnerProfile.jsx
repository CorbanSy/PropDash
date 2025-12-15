// src/components/ProviderDashboard/Network/components/PartnerProfile.jsx
import { useState } from "react";
import {
  X,
  Star,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Award,
  Calendar,
  DollarSign,
  MessageSquare,
  Send,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { theme } from "../../../../styles/theme";
import { removeConnection } from "../utils/networkApi";

export default function PartnerProfile({ partner, userId, onClose, onRefresh }) {
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleRemoveConnection = async () => {
    setRemoving(true);
    try {
      await removeConnection(partner.connectionId);
      alert(`Connection with ${partner.business_name} has been removed`);
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Error removing connection:", error);
      alert("Failed to remove connection. Please try again.");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-start justify-between z-10">
          <div className="flex items-center gap-4">
            <img
              src={partner.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.id}`}
              alt={partner.business_name}
              className="w-20 h-20 rounded-full bg-white border-4 border-white/30"
            />
            <div>
              <h2 className="text-2xl font-bold mb-1">{partner.business_name}</h2>
              <p className="text-blue-100">{partner.trade}</p>
              {partner.verified && (
                <div className="flex items-center gap-1 mt-2 text-sm">
                  <Award size={16} />
                  <span>Verified Professional</span>
                </div>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <StatBox
              icon={<Star className="text-yellow-500" size={20} />}
              label="Rating"
              value={partner.rating ? partner.rating.toFixed(1) : "N/A"}
            />
            <StatBox
              icon={<Briefcase className="text-blue-600" size={20} />}
              label="Jobs Completed"
              value={partner.jobsCompleted || 0}
            />
            <StatBox
              icon={<Send className="text-purple-600" size={20} />}
              label="Jobs Referred"
              value={partner.jobsReferred || 0}
            />
          </div>

          {/* Contact Information */}
          <div className="bg-slate-50 rounded-lg p-5">
            <h3 className="font-semibold text-slate-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              {partner.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-slate-400" />
                  <span className="text-slate-700">{partner.phone}</span>
                </div>
              )}
              {partner.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-slate-400" />
                  <span className="text-slate-700">{partner.email}</span>
                </div>
              )}
              {partner.location && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin size={16} className="text-slate-400" />
                  <span className="text-slate-700">
                    {partner.location.city || "Location not set"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Specialties */}
          {partner.specialties && partner.specialties.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {partner.specialties.map((specialty, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Partnership Info */}
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-5">
            <h3 className="font-semibold text-emerald-900 mb-3">Partnership Status</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-emerald-700 mb-1">Connected Since</p>
                <p className="font-semibold text-emerald-900">
                  {partner.connectedAt
                    ? new Date(partner.connectedAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-emerald-700 mb-1">Response Time</p>
                <p className="font-semibold text-emerald-900">
                  {partner.avgResponseTime ? `~${partner.avgResponseTime}h` : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border-2 border-red-200 rounded-lg p-5 bg-red-50">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Remove Connection</h3>
                <p className="text-sm text-red-700">
                  This will permanently remove {partner.business_name} from your network. 
                  You can reconnect later by sending a new connection request.
                </p>
              </div>
            </div>

            {!showRemoveConfirm ? (
              <button
                onClick={() => setShowRemoveConfirm(true)}
                className="w-full px-4 py-2.5 border-2 border-red-400 text-red-700 rounded-lg font-semibold hover:bg-red-100 transition flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Remove Connection
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-red-900">
                  Are you sure? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRemoveConfirm(false)}
                    className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRemoveConnection}
                    disabled={removing}
                    className={`flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2 ${
                      removing ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {removing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Removing...
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        Yes, Remove
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value }) {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-lg p-4 text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-xs text-slate-600 mb-1">{label}</p>
      <p className="text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}