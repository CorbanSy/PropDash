//levlpro-mvp\src\components\ProviderDashboard\Jobs\JobDetails.jsx
import { useState } from "react";
import { X, Briefcase, Edit, Trash2 } from "lucide-react";
import { theme } from "../../../styles/theme";
import { supabase } from "../../../lib/supabaseClient";
import JobStatusManager from "./components/JobStatusManager";
import JobTimeline from "./components/JobTimeline";
import JobNotes from "./components/JobNotes";
import JobPhotos from "./components/JobPhotos";
import PaymentTracker from "./components/PaymentTracker";
import EditJobModal from "./components/EditJobModal";
import { formatCurrency, formatDate, formatTime } from "./utils/jobCalculations";
import { getStatusBadge } from "./utils/jobHelpers";

export default function JobDetails({ job, customers, onClose, onRefresh }) {
  const [activeTab, setActiveTab] = useState("details");
  const [showEditModal, setShowEditModal] = useState(false);

  const customer = customers.find(c => c.id === job.customer_id);
  const clientName = customer?.full_name || job.client_name || "Unknown Client";
  const statusBadge = getStatusBadge(job.status);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      return;
    }

    const { error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", job.id);

    if (error) {
      alert("Error deleting job");
      console.error(error);
    } else {
      onRefresh();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-700 via-primary-800 to-primary-900 p-6 flex items-start justify-between z-10">
          <div className="flex items-center gap-4 text-white">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Briefcase size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{job.service_name || "Service"}</h2>
              <p className="text-primary-100">{clientName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-4 border-b-2 border-secondary-200 bg-secondary-50">
          <div className="flex gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="border-2 border-secondary-400 text-secondary-700 px-4 py-2 rounded-lg font-semibold hover:bg-secondary-50 active:bg-secondary-100 transition-all inline-flex items-center gap-2"
            >
              <Edit size={16} />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-error-50 text-error-700 rounded-lg font-semibold hover:bg-error-100 transition border-2 border-error-300 inline-flex items-center gap-2"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-secondary-200 px-6 overflow-x-auto">
          <TabButton
            active={activeTab === "details"}
            onClick={() => setActiveTab("details")}
            label="Details"
          />
          <TabButton
            active={activeTab === "status"}
            onClick={() => setActiveTab("status")}
            label="Status"
          />
          <TabButton
            active={activeTab === "timeline"}
            onClick={() => setActiveTab("timeline")}
            label="Timeline"
          />
          <TabButton
            active={activeTab === "notes"}
            onClick={() => setActiveTab("notes")}
            label="Notes"
          />
          <TabButton
            active={activeTab === "photos"}
            onClick={() => setActiveTab("photos")}
            label="Photos"
          />
          <TabButton
            active={activeTab === "payment"}
            onClick={() => setActiveTab("payment")}
            label="Payment"
          />
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold border-2 ${statusBadge.color}`}>
                <span className="text-lg">{statusBadge.icon}</span>
                <span>{statusBadge.label}</span>
              </div>

              {/* Job Info Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">Job Information</h3>
                  <div className="space-y-3">
                    <InfoRow label="Service" value={job.service_name || "N/A"} />
                    <InfoRow label="Date" value={formatDate(job.scheduled_date)} />
                    <InfoRow label="Time" value={job.scheduled_time ? formatTime(job.scheduled_time) : "Not set"} />
                    <InfoRow label="Address" value={job.address || "Not provided"} />
                    <InfoRow label="Total" value={formatCurrency(job.total || 0)} bold />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">Client Information</h3>
                  <div className="space-y-3">
                    <InfoRow label="Name" value={clientName} />
                    <InfoRow label="Email" value={customer?.email || job.client_email || "N/A"} />
                    <InfoRow label="Phone" value={customer?.phone || job.client_phone || "N/A"} />
                  </div>
                </div>
              </div>

              {/* Description */}
              {job.description && (
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">Description</h3>
                  <p className="text-secondary-700 bg-secondary-50 p-4 rounded-lg">
                    {job.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "status" && (
            <JobStatusManager job={job} onRefresh={onRefresh} />
          )}

          {activeTab === "timeline" && (
            <JobTimeline job={job} />
          )}

          {activeTab === "notes" && (
            <JobNotes job={job} onRefresh={onRefresh} />
          )}

          {activeTab === "photos" && (
            <JobPhotos job={job} onRefresh={onRefresh} />
          )}

          {activeTab === "payment" && (
            <PaymentTracker job={job} onRefresh={onRefresh} />
          )}
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <EditJobModal
            job={job}
            customers={customers}
            onClose={() => setShowEditModal(false)}
            onSuccess={() => {
              setShowEditModal(false);
              onRefresh();
            }}
          />
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 font-semibold transition-all duration-200 relative whitespace-nowrap ${
        active ? "text-primary-700" : "text-secondary-600 hover:text-secondary-900"
      }`}
    >
      {label}
      {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-700"></div>}
    </button>
  );
}

function InfoRow({ label, value, bold }) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-sm text-secondary-600">{label}:</span>
      <span className={`text-sm text-secondary-900 text-right ${bold ? "font-bold text-base" : ""}`}>
        {value}
      </span>
    </div>
  );
}