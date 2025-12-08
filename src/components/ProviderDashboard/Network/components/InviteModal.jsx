// src/components/ProviderDashboard/Network/components/InviteModal.jsx
import { useState } from "react";
import { X, Send, Sparkles, User, Mail, Phone, Briefcase } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { supabase } from "../../../../lib/supabaseClient";
import SmartInviteGenerator from "./SmartInviteGenerator";

export default function InviteModal({ userId, onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1: form, 2: smart invite
  const [loading, setLoading] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    phone: "",
    trade: "",
    customMessage: "",
  });

  const referralLink = `${window.location.origin}/invite/${userId}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inviteForm.name || !inviteForm.email) {
      alert("Please enter name and email");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("referrals").insert({
      referrer_id: userId,
      referred_business_name: inviteForm.name,
      referred_email: inviteForm.email,
      referred_phone: inviteForm.phone,
      trade: inviteForm.trade,
      custom_message: inviteForm.customMessage,
      status: "pending",
      invite_sent_at: new Date().toISOString(),
    });

    if (error) {
      alert("Error sending invite");
      console.error(error);
      setLoading(false);
    } else {
      // Create activity
      await supabase.from("network_activity").insert([{
        user_id: userId,
        type: "referral_sent",
        message: `Invited ${inviteForm.name} to join network`,
      }]);

      alert("Invitation sent successfully!");
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-start justify-between z-10">
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-1">Invite a Partner</h2>
            <p className="text-blue-100">Build your trusted network</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setStep(1)}
            className={`flex-1 py-4 font-semibold transition relative ${
              step === 1 ? "text-blue-700 bg-blue-50" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <User size={18} />
              Quick Invite
            </div>
            {step === 1 && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>}
          </button>
          <button
            onClick={() => setStep(2)}
            className={`flex-1 py-4 font-semibold transition relative ${
              step === 2 ? "text-blue-700 bg-blue-50" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Sparkles size={18} />
              Smart Invite
            </div>
            {step === 2 && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>}
          </button>
        </div>

        <div className="p-6">
          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={theme.text.label}>Business Name *</label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                    className={`${theme.input.base} ${theme.input.provider} pl-10`}
                    placeholder="Mike's Plumbing"
                  />
                </div>
              </div>

              <div>
                <label className={theme.text.label}>Email *</label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    required
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    className={`${theme.input.base} ${theme.input.provider} pl-10`}
                    placeholder="mike@plumbing.com"
                  />
                </div>
              </div>

              <div>
                <label className={theme.text.label}>Phone</label>
                <div className="relative mt-2">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="tel"
                    value={inviteForm.phone}
                    onChange={(e) => setInviteForm({ ...inviteForm, phone: e.target.value })}
                    className={`${theme.input.base} ${theme.input.provider} pl-10`}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className={theme.text.label}>Trade/Service</label>
                <div className="relative mt-2">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <select
                    value={inviteForm.trade}
                    onChange={(e) => setInviteForm({ ...inviteForm, trade: e.target.value })}
                    className={`${theme.input.base} ${theme.input.provider} pl-10`}
                  >
                    <option value="">Select Trade</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Landscaping">Landscaping</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Painting">Painting</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Roofing">Roofing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={theme.text.label}>Personal Message (Optional)</label>
                <textarea
                  value={inviteForm.customMessage}
                  onChange={(e) => setInviteForm({ ...inviteForm, customMessage: e.target.value })}
                  className={`${theme.input.base} ${theme.input.provider} mt-2`}
                  rows={3}
                  placeholder="Add a personal note to your invitation..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full ${theme.button.provider} justify-center ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Send size={18} />
                {loading ? "Sending..." : "Send Invitation"}
              </button>
            </form>
          ) : (
            <SmartInviteGenerator userId={userId} referralLink={referralLink} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
}