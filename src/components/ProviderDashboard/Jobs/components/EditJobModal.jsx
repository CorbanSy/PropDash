//levlpro-mvp\src\components\ProviderDashboard\Jobs\components\EditJobModal.jsx
import { useState } from "react";
import { X, Save, Calendar, Clock, MapPin, DollarSign, FileText } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { supabase } from "../../../../lib/supabaseClient";
import { validateJob } from "../utils/jobHelpers";

export default function EditJobModal({ job, customers, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [jobData, setJobData] = useState({
    service_name: job.service_name || "",
    description: job.description || "",
    scheduled_date: job.scheduled_date || "",
    scheduled_time: job.scheduled_time || "",
    address: job.address || "",
    total: job.total || "",
    notes: job.notes || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateJob(jobData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setErrors([]);

    const { error } = await supabase
      .from("jobs")
      .update({
        service_name: jobData.service_name,
        description: jobData.description || null,
        scheduled_date: jobData.scheduled_date,
        scheduled_time: jobData.scheduled_time || null,
        address: jobData.address || null,
        total: parseFloat(jobData.total) || 0,
        notes: jobData.notes || null,
      })
      .eq("id", job.id);

    if (error) {
      setErrors(["Error updating job. Please try again."]);
      console.error(error);
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-secondary-200 p-6 flex items-start justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900">Edit Job</h2>
            <p className="text-xs text-secondary-500">Update job details</p>
          </div>
          <button onClick={onClose} className="text-secondary-400 hover:text-secondary-600 transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-error-50 border-2 border-error-300 rounded-lg p-4 shadow-sm">
              <p className="text-sm font-semibold text-error-900 mb-2">Please fix the following errors:</p>
              <ul className="text-sm text-error-700 list-disc list-inside">
                {errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Service Name */}
          <div>
            <label className="text-sm font-semibold text-secondary-700">Service Name *</label>
            <input
              type="text"
              required
              value={jobData.service_name}
              onChange={(e) => setJobData({ ...jobData, service_name: e.target.value })}
              className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all mt-2"
            />
          </div>

          {/* Date & Time */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-secondary-700">Scheduled Date *</label>
              <div className="relative mt-2">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" size={18} />
                <input
                  type="date"
                  required
                  value={jobData.scheduled_date}
                  onChange={(e) => setJobData({ ...jobData, scheduled_date: e.target.value })}
                  className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-secondary-700">Time</label>
              <div className="relative mt-2">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" size={18} />
                <input
                  type="time"
                  value={jobData.scheduled_time}
                  onChange={(e) => setJobData({ ...jobData, scheduled_time: e.target.value })}
                  className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all pl-10"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-semibold text-secondary-700">Address</label>
            <div className="relative mt-2">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" size={18} />
              <input
                type="text"
                value={jobData.address}
                onChange={(e) => setJobData({ ...jobData, address: e.target.value })}
                className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all pl-10"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-secondary-700">Description</label>
            <textarea
              value={jobData.description}
              onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
              className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all mt-2"
              rows={3}
            />
          </div>

          {/* Total */}
          <div>
            <label className="text-sm font-semibold text-secondary-700">Total ($) *</label>
            <div className="relative mt-2">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" size={18} />
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={jobData.total}
                onChange={(e) => setJobData({ ...jobData, total: e.target.value })}
                className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all pl-10"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-semibold text-secondary-700">Internal Notes</label>
            <div className="relative mt-2">
              <FileText className="absolute left-3 top-3 text-secondary-400" size={18} />
              <textarea
                value={jobData.notes}
                onChange={(e) => setJobData({ ...jobData, notes: e.target.value })}
                className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all pl-10"
                rows={3}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-secondary-400 text-secondary-700 px-5 py-3 rounded-lg font-semibold hover:bg-secondary-50 active:bg-secondary-100 transition-all inline-flex items-center justify-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 bg-primary-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-primary-700 active:bg-primary-800 transition-all shadow-sm hover:shadow-md inline-flex items-center justify-center gap-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Save size={18} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}