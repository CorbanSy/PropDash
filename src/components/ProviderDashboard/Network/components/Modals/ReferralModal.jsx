// src/components/ProviderDashboard/Network/components/MyConnections/ReferralModal.jsx
import { useState, useEffect } from "react";
import { Send, X, Briefcase, Calendar, DollarSign, MapPin, AlertCircle, User } from "lucide-react";
import { supabase } from "../../../../../lib/supabaseClient";

export default function ReferralModal({ partner, currentUserId, onClose }) {
  const [step, setStep] = useState(1); // 1: Select job, 2: Confirm & send
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [customMessage, setCustomMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchAcceptedJobs();
  }, [currentUserId]);

  const fetchAcceptedJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select(`
          *,
          customer:customers(*)
        `)
        .eq("provider_id", currentUserId)
        .eq("status", "accepted")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAcceptedJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      alert("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleSendReferral = async () => {
    if (!selectedJob) {
      alert("Please select a job");
      return;
    }

    setSending(true);

    try {
      // Step 1: Create the referral record
      const { data: referralData, error: referralError } = await supabase
        .from("job_referrals")
        .insert({
          original_job_id: selectedJob.id,
          referring_provider_id: currentUserId,
          referred_provider_id: partner.providerId,
          customer_id: selectedJob.customer_id,
          commission_rate: 0.05,
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
          customer_id: selectedJob.customer_id,
          provider_id: partner.providerId,
          client_name: selectedJob.client_name,
          client_email: selectedJob.client_email,
          client_phone: selectedJob.client_phone,
          client_address: selectedJob.client_address,
          service_name: selectedJob.service_name,
          scheduled_date: selectedJob.scheduled_date,
          price: selectedJob.price, // ✅ Changed from budget
          status: "pending",
          category: selectedJob.category,
          notes: selectedJob.notes,
          is_platform_lead: false,
          referred_by: currentUserId,
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
          referred_to: partner.providerId,
          referral_id: referralData.id,
        })
        .eq("id", selectedJob.id);

      if (updateError) throw updateError;

      // Step 4: Send notification message to partner
      const notificationMessage = `🤝 Job Referral

${customMessage ? `Message: ${customMessage}\n\n` : ""}**Job Details:**
Service: ${selectedJob.service_category}
${selectedJob.description ? `Description: ${selectedJob.description}` : ""}
${selectedJob.preferred_date ? `Date: ${new Date(selectedJob.preferred_date).toLocaleDateString()}` : ""}
${selectedJob.price ? `Price: $${(selectedJob.price / 100).toFixed(0)}` : ""}
Location: ${selectedJob.location || "Not specified"}
${selectedJob.customer?.full_name ? `Customer: ${selectedJob.customer.full_name}` : ""}

Please review this job in your dashboard and accept or decline.`;

      // Check for existing conversation
      const { data: existingConv1 } = await supabase
        .from("provider_conversations")
        .select("id")
        .eq("provider1_id", currentUserId)
        .eq("provider2_id", partner.providerId)
        .maybeSingle();

      const { data: existingConv2 } = await supabase
        .from("provider_conversations")
        .select("id")
        .eq("provider1_id", partner.providerId)
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
            provider2_id: partner.providerId,
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
        receiver_id: partner.providerId,
        message: notificationMessage,
      });

      alert(`Job successfully referred to ${partner.business_name}!`);
      onClose();
    } catch (error) {
      console.error("Error referring job:", error);
      alert("Failed to refer job. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-100 p-2.5 rounded-full">
                <Send className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Refer Job</h3>
                <p className="text-sm text-slate-600">To: {partner.business_name}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Step {step} of 2: {step === 1 ? "Select Job" : "Confirm & Send"}
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition">
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full transition ${
                  s <= step ? "bg-purple-600" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Select Job */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Select a Job to Refer</h4>
                <p className="text-sm text-slate-600">
                  Choose one of your accepted jobs that you'd like to refer to {partner.business_name}
                </p>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-sm text-slate-600 mt-3">Loading your jobs...</p>
                </div>
              ) : acceptedJobs.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-lg">
                  <Briefcase className="text-slate-400 mx-auto mb-3" size={48} />
                  <p className="font-semibold text-slate-900 mb-1">No Accepted Jobs</p>
                  <p className="text-sm text-slate-600">
                    You don't have any accepted jobs to refer at the moment
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {acceptedJobs.map((job) => (
                    <button
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition ${
                        selectedJob?.id === job.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-slate-200 hover:border-purple-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                          <Briefcase className="text-purple-600" size={20} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-slate-900 mb-1">
                            {job.service_category || "Service Request"}
                          </h5>
                          
                          {job.description && (
                            <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                              {job.description}
                            </p>
                          )}

                          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                            {job.customer?.full_name && (
                              <div className="flex items-center gap-1">
                                <User size={12} />
                                <span className="truncate">{job.customer.full_name}</span>
                              </div>
                            )}
                            {job.preferred_date && (
                              <div className="flex items-center gap-1">
                                <Calendar size={12} />
                                <span>{new Date(job.preferred_date).toLocaleDateString()}</span>
                              </div>
                            )}
                            {job.price && (
                              <div className="flex items-center gap-1">
                                <DollarSign size={12} />
                                <span>${(job.price / 100).toFixed(0)}</span>
                              </div>
                            )}
                            {job.location && (
                              <div className="flex items-center gap-1">
                                <MapPin size={12} />
                                <span className="truncate">{job.location}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {selectedJob?.id === job.id && (
                          <div className="bg-purple-600 text-white rounded-full p-1 flex-shrink-0">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => setStep(2)}
                disabled={!selectedJob}
                className={`w-full px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2 ${
                  !selectedJob ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Next: Review & Send
              </button>
            </div>
          )}

          {/* Step 2: Confirm & Send */}
          {step === 2 && selectedJob && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Review & Confirm</h4>
                <p className="text-sm text-slate-600">
                  Review the job details before sending the referral
                </p>
              </div>

              {/* Important Notice */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-amber-800">
                    <p className="font-semibold mb-1">Important:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>This job will be transferred to {partner.business_name}</li>
                      <li>You'll earn a 5% commission when completed</li>
                      <li>Your job status will be updated to "referred"</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Job Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-5">
                <h5 className="font-semibold text-slate-900 mb-3">Job Details</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Service:</span>
                    <span className="font-semibold text-slate-900">{selectedJob.service_category}</span>
                  </div>
                  {selectedJob.customer?.full_name && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Customer:</span>
                      <span className="font-semibold text-slate-900">{selectedJob.customer.full_name}</span>
                    </div>
                  )}
                  {selectedJob.preferred_date && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Date:</span>
                      <span className="font-semibold text-slate-900">
                        {new Date(selectedJob.preferred_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {selectedJob.price && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Price:</span>
                      <span className="font-semibold text-slate-900">
                        ${(selectedJob.price / 100).toFixed(0)}
                      </span>
                    </div>
                  )}
                  {selectedJob.location && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Location:</span>
                      <span className="font-semibold text-slate-900">{selectedJob.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Commission Info */}
              {selectedJob.price && (
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-5">
                  <h5 className="font-semibold text-emerald-900 mb-3">Your Commission</h5>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-emerald-700">
                      ${((selectedJob.price * 0.05) / 100).toFixed(2)}
                    </span>
                    <span className="text-emerald-600">(5% of job total)</span>
                  </div>
                  <p className="text-sm text-emerald-700 mt-2">Earned when the job is completed</p>
                </div>
              )}

              {/* Custom Message */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Message to {partner.business_name} <span className="text-slate-500">(Optional)</span>
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Add any special notes about this job, customer preferences, or important details..."
                  rows={3}
                  className="w-full border-2 border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleSendReferral}
                  disabled={sending}
                  className={`flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2 ${
                    sending ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {sending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
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