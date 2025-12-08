// src/components/ProviderDashboard/Network/components/JobReferralFlow.jsx
import { useState } from "react";
import { X, User, Briefcase, Calendar, DollarSign, MapPin, MessageSquare, Send, Zap, Star } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { supabase } from "../../../../lib/supabaseClient";
import { findBestMatches } from "../utils/matchmakingAlgorithm";

export default function JobReferralFlow({ job, partners, userId, onClose, onSuccess }) {
  const [step, setStep] = useState(job ? 2 : 1); // Skip to step 2 if job provided
  const [loading, setLoading] = useState(false);

  // Form State
  const [jobData, setJobData] = useState({
    clientName: job?.clientName || "",
    clientEmail: job?.clientEmail || "",
    clientPhone: job?.clientPhone || "",
    serviceName: job?.serviceName || "",
    requiredTrade: job?.requiredTrade || "",
    scheduledDate: job?.scheduledDate || "",
    estimatedPrice: job?.estimatedPrice || "",
    location: job?.location || "",
    notes: job?.notes || "",
  });

  const [selectedPartner, setSelectedPartner] = useState(null);
  const [customMessage, setCustomMessage] = useState("");

  // Get best matches
  const matches = findBestMatches(
    jobData,
    partners,
    { lat: 40.7128, lng: -74.0060 }, // User location (would be from auth context)
    5
  );

  const handleSubmit = async () => {
    if (!selectedPartner) {
      alert("Please select a partner");
      return;
    }

    setLoading(true);

    const referralData = {
      referrer_id: userId,
      partner_id: selectedPartner.id,
      client_name: jobData.clientName,
      client_email: jobData.clientEmail,
      client_phone: jobData.clientPhone,
      service_name: jobData.serviceName,
      required_trade: jobData.requiredTrade,
      scheduled_date: jobData.scheduledDate,
      estimated_price: jobData.estimatedPrice,
      location: jobData.location,
      notes: jobData.notes,
      custom_message: customMessage,
      status: "pending",
      commission_rate: selectedPartner.tier === "vip" ? 0.10 : 0.05,
    };

    const { error } = await supabase.from("referred_jobs").insert([referralData]);

    if (error) {
      alert("Error sending referral");
      console.error(error);
    } else {
      // Create activity
      await supabase.from("network_activity").insert([{
        user_id: userId,
        type: "job_referred",
        message: `Referred ${jobData.serviceName} to ${selectedPartner.business_name}`,
      }]);

      alert("Job referral sent successfully!");
      onSuccess();
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between z-10">
          <div>
            <h2 className={theme.text.h2}>Refer Job to Partner</h2>
            <p className={theme.text.caption}>
              Step {step} of 3: {step === 1 ? "Job Details" : step === 2 ? "Select Partner" : "Confirm & Send"}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full transition ${
                  s <= step ? "bg-blue-600" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Job Details */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className={`${theme.text.h3} mb-4`}>Job Details</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={theme.text.label}>Client Name *</label>
                  <input
                    type="text"
                    required
                    value={jobData.clientName}
                    onChange={(e) => setJobData({ ...jobData, clientName: e.target.value })}
                    className={`${theme.input.base} ${theme.input.provider} mt-2`}
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className={theme.text.label}>Client Email</label>
                  <input
                    type="email"
                    value={jobData.clientEmail}
                    onChange={(e) => setJobData({ ...jobData, clientEmail: e.target.value })}
                    className={`${theme.input.base} ${theme.input.provider} mt-2`}
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className={theme.text.label}>Client Phone</label>
                  <input
                    type="tel"
                    value={jobData.clientPhone}
                    onChange={(e) => setJobData({ ...jobData, clientPhone: e.target.value })}
                    className={`${theme.input.base} ${theme.input.provider} mt-2`}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className={theme.text.label}>Service Needed *</label>
                  <input
                    type="text"
                    required
                    value={jobData.serviceName}
                    onChange={(e) => setJobData({ ...jobData, serviceName: e.target.value })}
                    className={`${theme.input.base} ${theme.input.provider} mt-2`}
                    placeholder="Lawn Mowing"
                  />
                </div>

                <div>
                  <label className={theme.text.label}>Trade Required *</label>
                  <select
                    required
                    value={jobData.requiredTrade}
                    onChange={(e) => setJobData({ ...jobData, requiredTrade: e.target.value })}
                    className={`${theme.input.base} ${theme.input.provider} mt-2`}
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
                  </select>
                </div>

                <div>
                  <label className={theme.text.label}>Scheduled Date</label>
                  <input
                    type="date"
                    value={jobData.scheduledDate}
                    onChange={(e) => setJobData({ ...jobData, scheduledDate: e.target.value })}
                    className={`${theme.input.base} ${theme.input.provider} mt-2`}
                  />
                </div>

                <div>
                  <label className={theme.text.label}>Estimated Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={jobData.estimatedPrice ? jobData.estimatedPrice / 100 : ""}
                    onChange={(e) => setJobData({ ...jobData, estimatedPrice: parseFloat(e.target.value) * 100 })}
                    className={`${theme.input.base} ${theme.input.provider} mt-2`}
                    placeholder="150"
                  />
                </div>

                <div>
                  <label className={theme.text.label}>Location</label>
                  <input
                    type="text"
                    value={jobData.location}
                    onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
                    className={`${theme.input.base} ${theme.input.provider} mt-2`}
                    placeholder="City, State"
                  />
                </div>
              </div>

              <div>
                <label className={theme.text.label}>Additional Notes</label>
                <textarea
                  value={jobData.notes}
                  onChange={(e) => setJobData({ ...jobData, notes: e.target.value })}
                  className={`${theme.input.base} ${theme.input.provider} mt-2`}
                  rows={3}
                  placeholder="Any special requirements or details..."
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!jobData.clientName || !jobData.serviceName || !jobData.requiredTrade}
                className={`w-full ${theme.button.provider} justify-center ${
                  (!jobData.clientName || !jobData.serviceName || !jobData.requiredTrade) ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Next: Select Partner
              </button>
            </div>
          )}

          {/* Step 2: Select Partner */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className={theme.text.h3}>Select Partner</h3>
                {matches.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-purple-600">
                    <Zap size={16} />
                    <span>AI Matched</span>
                  </div>
                )}
              </div>

              {matches.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-lg">
                  <p className={theme.text.body}>No partners available for this trade</p>
                  <p className="text-sm text-slate-500 mt-2">
                    Invite partners in {jobData.requiredTrade} to your network
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {matches.map((match) => (
                    <button
                      key={match.partner.id}
                      onClick={() => setSelectedPartner(match.partner)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition ${
                        selectedPartner?.id === match.partner.id
                          ? "border-blue-400 bg-blue-50"
                          : "border-slate-200 hover:border-blue-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={match.partner.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${match.partner.id}`}
                          alt={match.partner.business_name}
                          className="w-12 h-12 rounded-full bg-slate-200"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-slate-900">
                              {match.partner.business_name}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded font-medium">
                                {match.score}% match
                              </span>
                              {match.partner.tier === "vip" && (
                                <span className="text-xs px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded font-bold">
                                  VIP
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-3 text-xs text-slate-600">
                            <div className="flex items-center gap-1">
                              <Star size={12} className="text-yellow-500 fill-yellow-500" />
                              <span>{match.partner.rating?.toFixed(1)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Briefcase size={12} />
                              <span>{match.partner.jobsCompleted} jobs</span>
                            </div>
                            <div>
                              Commission: {match.partner.tier === "vip" ? "10%" : "5%"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className={`flex-1 ${theme.button.secondary} justify-center`}
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedPartner}
                  className={`flex-1 ${theme.button.provider} justify-center ${
                    !selectedPartner ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Next: Review
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm & Send */}
          {step === 3 && selectedPartner && (
            <div className="space-y-6">
              <h3 className={`${theme.text.h3} mb-4`}>Review & Send</h3>

              {/* Job Summary */}
              <div className="bg-slate-50 rounded-lg p-5">
                <h4 className="font-semibold text-slate-900 mb-4">Job Summary</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600 mb-1">Client</p>
                    <p className="font-semibold text-slate-900">{jobData.clientName}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 mb-1">Service</p>
                    <p className="font-semibold text-slate-900">{jobData.serviceName}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 mb-1">Trade</p>
                    <p className="font-semibold text-slate-900">{jobData.requiredTrade}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 mb-1">Estimated Price</p>
                    <p className="font-semibold text-slate-900">
                      ${(jobData.estimatedPrice / 100).toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Partner Info */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
                <h4 className="font-semibold text-blue-900 mb-4">Referring To</h4>
                <div className="flex items-center gap-3">
                  <img
                    src={selectedPartner.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPartner.id}`}
                    alt={selectedPartner.business_name}
                    className="w-16 h-16 rounded-full bg-slate-200"
                  />
                  <div>
                    <p className="font-bold text-slate-900 text-lg">{selectedPartner.business_name}</p>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        {selectedPartner.rating}
                      </span>
                      <span>•</span>
                      <span>{selectedPartner.jobsCompleted} jobs</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Commission Info */}
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-5">
                <h4 className="font-semibold text-emerald-900 mb-3">Your Commission</h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-emerald-700">
                    ${((jobData.estimatedPrice * (selectedPartner.tier === "vip" ? 0.10 : 0.05)) / 100).toFixed(2)}
                  </span>
                  <span className="text-emerald-600">
                    ({selectedPartner.tier === "vip" ? "10" : "5"}% of job total)
                  </span>
                </div>
                <p className="text-sm text-emerald-700 mt-2">
                  {selectedPartner.tier === "vip" ? "VIP partner rate" : "Standard rate"}
                </p>
              </div>

              {/* Custom Message */}
              <div>
                <label className={theme.text.label}>Custom Message to Partner (Optional)</label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className={`${theme.input.base} ${theme.input.provider} mt-2`}
                  rows={3}
                  placeholder="Add any special notes for your partner..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className={`flex-1 ${theme.button.secondary} justify-center`}
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`flex-1 ${theme.button.provider} justify-center ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Send size={18} />
                  {loading ? "Sending..." : "Send Referral"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}