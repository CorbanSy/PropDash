//levlpro-mvp\src\components\ProviderDashboard\Network\components\Invites\InvitesTab.jsx
import { useState } from "react";
import { Bell, Clock } from "lucide-react";
import ReceivedInviteCard from "./ReceivedInviteCard";
import SentInviteCard from "./SentInviteCard";
import { useConnectionActions } from "../../hooks/useConnectionActions";
import { theme } from "../../../../../styles/theme";

export default function InvitesTab({ pendingInvites, sentInvites, onRefresh }) {
  const [activeSubTab, setActiveSubTab] = useState("received");
  const { acceptInvite, declineInvite, cancelInvite } = useConnectionActions(onRefresh);

  const handleAccept = async (inviteId, senderName) => {
    const result = await acceptInvite(inviteId);
    if (result.success) {
      alert(`✅ You're now connected with ${senderName}!`);
    } else {
      alert("Failed to accept connection. Please try again.");
    }
  };

  const handleDecline = async (inviteId) => {
    const result = await declineInvite(inviteId);
    if (result.success) {
      alert("Connection declined");
    } else {
      alert("Failed to decline connection. Please try again.");
    }
  };

  const handleCancel = async (inviteId) => {
    const result = await cancelInvite(inviteId);
    if (result.success) {
      alert("Connection invite cancelled");
    } else {
      alert("Failed to cancel invite. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab navigation */}
      <div className="flex gap-2 border-b border-slate-200">
        <SubTabButton
          active={activeSubTab === "received"}
          onClick={() => setActiveSubTab("received")}
          label={`Received (${pendingInvites.length})`}
        />
        <SubTabButton
          active={activeSubTab === "sent"}
          onClick={() => setActiveSubTab("sent")}
          label={`Sent (${sentInvites.length})`}
        />
      </div>

      {/* Received Invites */}
      {activeSubTab === "received" && (
        <>
          {pendingInvites.length === 0 ? (
            <EmptyState
              icon={<Bell size={32} />}
              title="No Pending Invites"
              description="Connection requests will appear here"
            />
          ) : (
            <div className="space-y-4">
              {pendingInvites.map((invite) => (
                <ReceivedInviteCard
                  key={invite.id}
                  invite={invite}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Sent Invites */}
      {activeSubTab === "sent" && (
        <>
          {sentInvites.length === 0 ? (
            <EmptyState
              icon={<Clock size={32} />}
              title="No Sent Invites"
              description="Your sent connection requests will appear here"
            />
          ) : (
            <div className="space-y-4">
              {sentInvites.map((invite) => (
                <SentInviteCard
                  key={invite.id}
                  invite={invite}
                  onCancel={handleCancel}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SubTabButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-semibold transition relative ${
        active ? "text-blue-700" : "text-slate-600"
      }`}
    >
      {label}
      {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>}
    </button>
  );
}

function EmptyState({ icon, title, description }) {
  return (
    <div className={`${theme.card.base} ${theme.card.padding} text-center py-12`}>
      <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <div className="text-slate-400">{icon}</div>
      </div>
      <p className={`${theme.text.h4} mb-2`}>{title}</p>
      <p className={theme.text.body}>{description}</p>
    </div>
  );
}