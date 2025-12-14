// src/components/ProviderDashboard/Network/components/JobReferralFlow.jsx
import { useState } from "react";
import { X, User, Briefcase, Calendar, DollarSign, MapPin, MessageSquare, Send, Zap, Star, AlertCircle } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { supabase } from "../../../../lib/supabaseClient";

export default function JobReferralFlow({ job, connections, currentUserId, onClose, onSuccess }) {
  const [step, setStep] = useState(1); // Start at partner selection
  const [loading, setLoading] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [customMessage, setCustomMessage] = useState("");

  // Filter connections by service match
  const matchedConnections = connections.filter(conn => {
    const partner = conn.connected_provider;
    if (!partner) return false;
    
    // Check if partner offers this service
    const services = [
      ...(partner.service_categories || []),
      ...(partner.services_offered || [])
    ];
    
    return services.some(service => 
      service.toLowerCase().includes(job.service_category?.toLowerCase() || "") ||
      job.service_category?.toLowerCase().includes(service.toLowerCase())
    );
  });

  const handleSubmit = async () => {
    if (!selectedPartner) {
      alert("Please select a partner");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create the referral record
      const { data: referralData, error: referralError } = await supabase
        .from("job_referrals")
        .insert({
          original_job_id: job.id,
          referring_provider_id: currentUserId,
          referred_provider_id: selectedPartner.providerId,
          customer_id: job.customer_id,
          commission_rate: 0.05, // 5% standard rate
          status: "pending",
          notes: customMessage,
        })
        .select()
        .single();

      if (referralError) throw referralError;

      // Step 2: Create a new job for the referred partner
      const { data: newJob, error: jobError } = await supabase
        .from("jobs")
        .insert({
          customer_id: job.customer_id,
          provider_id: selectedPartner.providerId, // Assign to new provider
          service_category: job.service_category,
          description: job.description,
          preferred_date: job.preferred_date,
          preferred_time: job.preferred_time,
          location: job.location,
          budget: job.budget,
          status: "pending", // Partner needs to accept
          urgency: job.urgency,
          property_type: job.property_type,
          referred_by: currentUserId, // Track referral
          referral_id: referralData.id,
        })
        .select()
        .single();

      if (jobError) throw jobError;

      // Step 3: Update original job status to "referred"
      const { error: updateError } = await supabase
        .from("jobs")
        .update({
          status: "referred",
          referred_to: selectedPartner.providerId,
          referral_id: referralData.id,
        })
        .eq("id", job.id);

      if (updateError) throw updateError;

      // Step 4: Send notification message to partner
      const notificationMessage = `🤝 Job Referral from ${job.provider?.business_name || "a partner"}

${customMessage ? `Message: ${customMessage}\n\n` : ""}**Job Details:**
Service: ${job.service_category}
${job.description ? `Description: ${job.description}` : ""}
${job.preferred_date ? `Date: ${new Date(job.preferred_date).toLocaleDateString()}` : ""}
${job.budget ? `Budget: $${(job.budget / 100).toFixed(0)}` : ""}
Location: ${job.location || "Not specified"}

Please review this job in your dashboard and accept or decline.`;

      // Check for existing conversation
      const { data: existingConv1 } = await supabase
        .from("provider_conversations")
        .select("id")
        .eq("provider1_id", currentUserId)
        .eq("provider2_id", selectedPartner.providerId)
        .maybeSingle();

      const { data: existingConv2 } = await supabase
        .from("provider_conversations")
        .select("id")
        .eq("provider1_id", selectedPartner.providerId)
        .eq("provider2_id", currentUserId)
        .maybeSingle();

      let conversationId;
      const existingConv = existingConv1 || existingConv2;

      if (existingConv) {
        conversationId = existingConv.id;
        await supabase
          .from("provider_conversations")
          .update({ last_message_at: new Date().toISOString() })
          .eq("id", conversationId);
      } else {
        const { data: newConv, error: convError } = await supabase
          .from("provider_conversations")
          .insert({
            provider1_id: currentUserId,
            provider2_id: selectedPartner.providerId,
            last_message_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (convError) throw convError;
        conversationId = newConv.id;
      }

      // Send message
      await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: currentUserId,
        receiver_id: selectedPartner.providerId,
        message: notificationMessage,
      });

      alert(`Job successfully referred to ${selectedPartner.business_name}!`);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error referring job:", error);
      alert("Failed to refer job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between z-10">
          <div>
            <h2 className={theme.text.h2}>Refer Job to Connection</h2>
            <p className={theme.text.caption}>
              Transfer this job to a trusted partner in your network
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Job Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Briefcase className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-lg mb-1">
                  {job.service_category || "Service Request"}
                </h3>
                {job.description && (
                  <p className="text-sm text-slate-700 mb-3">{job.description}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {job.client?.name && (
                <div>
                  <p className="text-slate-600 mb-1 flex items-center gap-1">
                    <User size={12} />
                    Client
                  </p>
                  <p className="font-semibold text-slate-900">{job.client.name}</p>
                </div>
              )}
              {job.preferred_date && (
                <div>
                  <p className="text-slate-600 mb-1 flex items-center gap-1">
                    <Calendar size={12} />
                    Preferred Date
                  </p>
                  <p className="font-semibold text-slate-900">
                    {new Date(job.preferred_date).toLocaleDateString()}
                  </p>
                </div>
              )}
              {job.budget && (
                <div>
                  <p className="text-slate-600 mb-1 flex items-center gap-1">
                    <DollarSign size={12} />
                    Budget
                  </p>
                  <p className="font-semibold text-slate-900">
                    ${(job.budget / 100).toFixed(0)}
                  </p>
                </div>
              )}
              {job.location && (
                <div>
                  <p className="text-slate-600 mb-1 flex items-center gap-1">
                    <MapPin size={12} />
                    Location
                  </p>
                  <p className="font-semibold text-slate-900">{job.location}</p>
                </div>
              )}
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">Important:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>This job will be transferred to the selected partner</li>
                  <li>You'll earn a 5% commission when the job is completed</li>
                  <li>The partner can accept or decline the referral</li>
                  <li>Your original job status will be updated to "referred"</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 1: Select Partner */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className={`${theme.text.h3} mb-2`}>Select Connection</h3>
                <p className="text-sm text-slate-600">
                  {matchedConnections.length > 0
                    ? `${matchedConnections.length} connection(s) match this service`
                    : "No connections match this service"}
                </p>
              </div>

              {matchedConnections.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-lg">
                  <p className={theme.text.body}>
                    No connections found for {job.service_category}
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    Connect with professionals in this service area first
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {matchedConnections.map((connection) => {
                    const partner = connection.connected_provider;
                    if (!partner) return null;

                    // Transform to match expected format
                    const transformedPartner = {
                      id: connection.id,
                      providerId: partner.id,
                      business_name: partner.business_name,
                      avatar_url: partner.profile_photo,
                      trade: partner.service_categories?.[0] || partner.services_offered?.[0] || "Professional",
                      verified: partner.verification_status === "verified",
                      rating: 4.8, // Add actual rating if available
                      jobsCompleted: 0, // Add actual stats if available
                      base_rate: partner.base_rate,
                      is_online: partner.is_online,
                    };

                    return (
                      <button
                        key={connection.id}
                        onClick={() => setSelectedPartner(transformedPartner)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition ${
                          selectedPartner?.id === transformedPartner.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 hover:border-blue-200"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Profile Photo */}
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
                            {partner.profile_photo ? (
                              <img
                                src={partner.profile_photo}
                                alt={partner.business_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              partner.business_name?.charAt(0).toUpperCase() || "P"
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-slate-900">
                                {partner.business_name || "Professional"}
                              </h4>
                              <div className="flex items-center gap-2">
                                {partner.verification_status === "verified" && (
                                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                                    Verified
                                  </span>
                                )}
                                {partner.is_online && (
                                  <div className="flex items-center gap-1 text-xs text-green-700">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    Online
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-slate-600">
                              <div className="flex items-center gap-1">
                                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                <span>{transformedPartner.rating.toFixed(1)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Briefcase size={12} />
                                <span>{transformedPartner.jobsCompleted} jobs</span>
                              </div>
                              {partner.base_rate && (
                                <div className="flex items-center gap-1">
                                  <DollarSign size={12} />
                                  <span>${(partner.base_rate / 100).toFixed(0)}/hr</span>
                                </div>
                              )}
                            </div>

                            <div className="mt-2">
                              <div className="flex flex-wrap gap-1">
                                {(partner.service_categories || partner.services_offered || [])
                                  .slice(0, 3)
                                  .map((service, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded"
                                    >
                                      {service}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              <button
                onClick={() => setStep(2)}
                disabled={!selectedPartner}
                className={`w-full ${theme.button.provider} justify-center ${
                  !selectedPartner ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Next: Add Message
              </button>
            </div>
          )}

          {/* Step 2: Add Message & Confirm */}
          {step === 2 && selectedPartner && (
            <div className="space-y-6">
              <div>
                <h3 className={`${theme.text.h3} mb-2`}>Review & Send</h3>
              </div>

              {/* Selected Partner */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
                <h4 className="font-semibold text-blue-900 mb-4">Referring To</h4>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                    {selectedPartner.avatar_url ? (
                      <img
                        src={selectedPartner.avatar_url}
                        alt={selectedPartner.business_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      selectedPartner.business_name?.charAt(0).toUpperCase() || "P"
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">
                      {selectedPartner.business_name}
                    </p>
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
              {job.budget && (
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-5">
                  <h4 className="font-semibold text-emerald-900 mb-3">Your Commission</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-emerald-700">
                      ${((job.budget * 0.05) / 100).toFixed(2)}
                    </span>
                    <span className="text-emerald-600">(5% of job total)</span>
                  </div>
                  <p className="text-sm text-emerald-700 mt-2">
                    Earned when the job is completed
                  </p>
                </div>
              )}

              {/* Custom Message */}
              <div>
                <label className={theme.text.label}>
                  Message to Partner <span className="text-slate-500">(Optional)</span>
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className={`${theme.input.base} ${theme.input.provider} mt-2`}
                  rows={4}
                  placeholder="Add any special notes about this job, client preferences, or important details..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
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
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Referral
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}