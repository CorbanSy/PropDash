// src/components/ProviderDashboard/Clients/components/QuickActions.jsx
import { useState } from "react";
import { Phone, Mail, MessageSquare, Calendar, Star, Edit, FileText } from "lucide-react";
import { theme } from "../../../../styles/theme";
import CreateJobModal from "./CreateJobModal";
import RequestReviewModal from "./RequestReviewModal";
import EditClientModal from "./EditClientModal";

export default function QuickActions({ client, onRefresh }) {
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [showRequestReview, setShowRequestReview] = useState(false);
  const [showEditClient, setShowEditClient] = useState(false);

  const handleCall = () => {
    if (client.phone) {
      window.location.href = `tel:${client.phone}`;
    } else {
      alert("No phone number available");
    }
  };

  const handleEmail = () => {
    if (client.email) {
      window.location.href = `mailto:${client.email}`;
    } else {
      alert("No email available");
    }
  };

  const handleSMS = () => {
    if (client.phone) {
      window.location.href = `sms:${client.phone}`;
    } else {
      alert("No phone number available");
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleCall}
          className={`${theme.button.secondary} flex items-center gap-2`}
        >
          <Phone size={16} />
          Call
        </button>

        <button
          onClick={handleEmail}
          className={`${theme.button.secondary} flex items-center gap-2`}
        >
          <Mail size={16} />
          Email
        </button>

        <button
          onClick={handleSMS}
          className={`${theme.button.secondary} flex items-center gap-2`}
        >
          <MessageSquare size={16} />
          Text
        </button>

        <button
          onClick={() => setShowCreateJob(true)}
          className={`${theme.button.provider} flex items-center gap-2`}
        >
          <Calendar size={16} />
          Schedule Job
        </button>

        <button
          onClick={() => setShowRequestReview(true)}
          className={`${theme.button.secondary} flex items-center gap-2`}
        >
          <Star size={16} />
          Request Review
        </button>

        <button
          onClick={() => setShowEditClient(true)}
          className={`${theme.button.secondary} flex items-center gap-2`}
        >
          <Edit size={16} />
          Edit Info
        </button>
      </div>

      {/* Modals */}
      {showCreateJob && (
        <CreateJobModal
          client={client}
          onClose={() => setShowCreateJob(false)}
          onSuccess={() => {
            setShowCreateJob(false);
            onRefresh();
          }}
        />
      )}

      {showRequestReview && (
        <RequestReviewModal
          client={client}
          onClose={() => setShowRequestReview(false)}
        />
      )}

      {showEditClient && (
        <EditClientModal
          client={client}
          onClose={() => setShowEditClient(false)}
          onSuccess={() => {
            setShowEditClient(false);
            onRefresh();
          }}
        />
      )}
    </>
  );
}