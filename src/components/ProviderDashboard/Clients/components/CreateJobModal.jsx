//levlpro-mvp\src\components\ProviderDashboard\Clients\components\CreateJobModal.jsx
import { useState } from "react";
import { X, Calendar, DollarSign, Clock, MapPin, FileText } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { supabase } from "../../../../lib/supabaseClient";
import useAuth from "../../../../hooks/useAuth";

export default function CreateJobModal({ client, onClose, onSuccess }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [jobData, setJobData] = useState({
    service_name: "",
    description: "",
    scheduled_date: "",
    scheduled_time: "",
    address: client.address || "",
    estimated_hours: "",
    hourly_rate: "",
    total: "",
    notes: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("jobs").insert({
      provider_id: user.id,
      customer_id: client.id,
      service_name: jobData.service_name,
      description: jobData.description,
      scheduled_date: jobData.scheduled_date,
      scheduled_time: jobData.scheduled_time,
      address: jobData.address,
      total: parseFloat(jobData.total) || 0,
      notes: jobData.notes,
      status: "scheduled",
    });

    if (error) {
      alert("Error creating job");
      console.error(error);
    } else {
      onSuccess();
    }

    setLoading(false);
  };

  const calculateTotal = () => {
    if (jobData.estimated_hours && jobData.hourly_rate) {
      const total = parseFloat(jobData.estimated_hours) * parseFloat(jobData.hourly_rate);
      setJobData({ ...jobData, total: total.toFixed(2) });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between z-10">
          <div>
            <h2 className={theme.text.h2}>Schedule Job</h2>
            <p className={theme.text.caption}>
              for {client.full_name || "Unknown Client"}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Service Name */}
          <div>
            <label className={theme.text.label}>Service Name *</label>
            <input
              type="text"
              required
              value={jobData.service_name}
              onChange={(e) => setJobData({ ...jobData, service_name: e.target.value })}
              className={`${theme.input.base} ${theme.input.provider} mt-2`}
              placeholder="e.g., Kitchen Faucet Repair"
            />
          </div>

          {/* Description */}
          <div>
            <label className={theme.text.label}>Description</label>
            <textarea
              value={jobData.description}
              onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
              className={`${theme.input.base} ${theme.input.provider} mt-2`}
              rows={3}
              placeholder="Details about the job..."
            />
          </div>

          {/* Date & Time */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={theme.text.label}>Scheduled Date *</label>
              <div className="relative mt-2">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="date"
                  required
                  value={jobData.scheduled_date}
                  onChange={(e) => setJobData({ ...jobData, scheduled_date: e.target.value })}
                  className={`${theme.input.base} ${theme.input.provider} pl-10`}
                />
              </div>
            </div>

            <div>
              <label className={theme.text.label}>Time</label>
              <div className="relative mt-2">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="time"
                  value={jobData.scheduled_time}
                  onChange={(e) => setJobData({ ...jobData, scheduled_time: e.target.value })}
                  className={`${theme.input.base} ${theme.input.provider} pl-10`}
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className={theme.text.label}>Address</label>
            <div className="relative mt-2">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={jobData.address}
                onChange={(e) => setJobData({ ...jobData, address: e.target.value })}
                className={`${theme.input.base} ${theme.input.provider} pl-10`}
                placeholder="123 Main St, City, State"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-slate-50 rounded-lg p-4 border-2 border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-3">Pricing</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className={theme.text.label}>Hours</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={jobData.estimated_hours}
                  onChange={(e) => setJobData({ ...jobData, estimated_hours: e.target.value })}
                  onBlur={calculateTotal}
                  className={`${theme.input.base} ${theme.input.provider} mt-2`}
                  placeholder="0"
                />
              </div>

              <div>
                <label className={theme.text.label}>Rate ($/hr)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={jobData.hourly_rate}
                  onChange={(e) => setJobData({ ...jobData, hourly_rate: e.target.value })}
                  onBlur={calculateTotal}
                  className={`${theme.input.base} ${theme.input.provider} mt-2`}
                  placeholder="0"
                />
              </div>

              <div>
                <label className={theme.text.label}>Total ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={jobData.total}
                  onChange={(e) => setJobData({ ...jobData, total: e.target.value })}
                  className={`${theme.input.base} ${theme.input.provider} mt-2`}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={theme.text.label}>Internal Notes</label>
            <div className="relative mt-2">
              <FileText className="absolute left-3 top-3 text-slate-400" size={18} />
              <textarea
                value={jobData.notes}
                onChange={(e) => setJobData({ ...jobData, notes: e.target.value })}
                className={`${theme.input.base} ${theme.input.provider} pl-10`}
                rows={3}
                placeholder="Any special requirements or reminders..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 ${theme.button.secondary} justify-center`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 ${theme.button.provider} justify-center ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Calendar size={18} />
              {loading ? "Creating..." : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}