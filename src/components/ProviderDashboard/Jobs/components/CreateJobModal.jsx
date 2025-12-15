// src/components/ProviderDashboard/Jobs/components/CreateJobModal.jsx
import { useState } from "react";
import { X, Calendar, Clock, MapPin, DollarSign, User, FileText } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { supabase } from "../../../../lib/supabaseClient";
import useAuth from "../../../../hooks/useAuth";
import { validateJob } from "../utils/jobHelpers";

export default function CreateJobModal({ customers, onClose, onSuccess }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [jobData, setJobData] = useState({
    service_name: "",
    description: "",
    customer_id: "",
    client_name: "",
    client_email: "",
    client_phone: "",
    scheduled_date: "",
    scheduled_time: "",
    address: "",
    estimated_hours: "",
    hourly_rate: "",
    total: "",
    notes: "",
    status: "scheduled",
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

    const { error } = await supabase.from("jobs").insert({
      provider_id: user.id,
      customer_id: jobData.customer_id || null,
      service_name: jobData.service_name,
      description: jobData.description || null,
      client_name: jobData.client_name || null,
      client_email: jobData.client_email || null,
      client_phone: jobData.client_phone || null,
      scheduled_date: jobData.scheduled_date,
      scheduled_time: jobData.scheduled_time || null,
      address: jobData.address || null,
      total: parseFloat(jobData.total) || 0,
      notes: jobData.notes || null,
      status: jobData.status,
    });

    if (error) {
      setErrors(["Error creating job. Please try again."]);
      console.error(error);
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  const handleCustomerSelect = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setJobData({
        ...jobData,
        customer_id: customerId,
        client_name: customer.full_name || "",
        client_email: customer.email || "",
        client_phone: customer.phone || "",
        address: customer.address || jobData.address,
      });
    } else {
      setJobData({
        ...jobData,
        customer_id: "",
        client_name: "",
        client_email: "",
        client_phone: "",
      });
    }
  };

  const calculateTotal = () => {
    if (jobData.estimated_hours && jobData.hourly_rate) {
      const total = parseFloat(jobData.estimated_hours) * parseFloat(jobData.hourly_rate);
      setJobData({ ...jobData, total: total.toFixed(2) });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-700 via-primary-800 to-primary-900 p-6 flex items-start justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">Create New Job</h2>
            <p className="text-primary-100">Add a new job to your schedule</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
              placeholder="e.g., Kitchen Faucet Repair, Deck Staining, etc."
            />
          </div>

          {/* Customer Selection */}
          <div>
            <label className="text-sm font-semibold text-secondary-700">Customer</label>
            <select
              value={jobData.customer_id}
              onChange={(e) => handleCustomerSelect(e.target.value)}
              className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all mt-2"
            >
              <option value="">New Customer (Enter Details Below)</option>
              <option disabled>──────────</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.full_name} - {customer.email || customer.phone}
                </option>
              ))}
            </select>
          </div>

          {/* Client Info (if no customer selected) */}
          {!jobData.customer_id && (
            <div className="bg-secondary-50 rounded-lg p-4 border-2 border-secondary-200 space-y-4">
              <h3 className="font-semibold text-secondary-900">New Customer Information</h3>
              
              <div>
                <label className="text-sm font-semibold text-secondary-700">Full Name *</label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" size={18} />
                  <input
                    type="text"
                    required={!jobData.customer_id}
                    value={jobData.client_name}
                    onChange={(e) => setJobData({ ...jobData, client_name: e.target.value })}
                    className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all pl-10"
                    placeholder="John Smith"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-secondary-700">Email</label>
                  <input
                    type="email"
                    value={jobData.client_email}
                    onChange={(e) => setJobData({ ...jobData, client_email: e.target.value })}
                    className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all mt-2"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-secondary-700">Phone</label>
                  <input
                    type="tel"
                    value={jobData.client_phone}
                    onChange={(e) => setJobData({ ...jobData, client_phone: e.target.value })}
                    className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all mt-2"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>
          )}

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
                placeholder="123 Main St, City, State 12345"
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
              placeholder="Details about the work to be done..."
            />
          </div>

          {/* Pricing */}
          <div className="bg-primary-50 rounded-lg p-4 border-2 border-primary-300 shadow-sm">
            <h4 className="font-semibold text-secondary-900 mb-3">Pricing</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-semibold text-secondary-700">Est. Hours</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={jobData.estimated_hours}
                  onChange={(e) => setJobData({ ...jobData, estimated_hours: e.target.value })}
                  onBlur={calculateTotal}
                  className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all mt-2"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-secondary-700">Hourly Rate ($)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={jobData.hourly_rate}
                  onChange={(e) => setJobData({ ...jobData, hourly_rate: e.target.value })}
                  onBlur={calculateTotal}
                  className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all mt-2"
                  placeholder="0"
                />
              </div>

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
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Internal Notes */}
          <div>
            <label className="text-sm font-semibold text-secondary-700">Internal Notes</label>
            <div className="relative mt-2">
              <FileText className="absolute left-3 top-3 text-secondary-400" size={18} />
              <textarea
                value={jobData.notes}
                onChange={(e) => setJobData({ ...jobData, notes: e.target.value })}
                className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all pl-10"
                rows={3}
                placeholder="Private notes about this job (not visible to client)..."
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
              <Calendar size={18} />
              {loading ? "Creating..." : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}