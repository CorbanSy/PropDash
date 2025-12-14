// src/components/ProviderDashboard/Network/Network.jsx
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useNetworkData } from "./hooks/useNetworkData";
import NetworkHeader from "./components/Shared/NetworkHeader";
import NetworkStats from "./components/Shared/NetworkStats";
import DiscoverTab from "./components/Discover/DiscoverTab";
import MyConnections from "./components/MyConnections";
import InvitesTab from "./components/Invites/InvitesTab";
import CommissionLedger from "./components/CommissionLedger"; // ✅ ADD
import { X } from "lucide-react"; // ✅ ADD
import { theme } from "../../../styles/theme";

export default function Network() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("professionals");
  const [showEarningsModal, setShowEarningsModal] = useState(false); // ✅ ADD

  // Custom hook handles all data fetching
  const {
    loading,
    connections,
    allProfessionals,
    pendingInvites,
    sentInvites,
    stats,
    refreshData,
  } = useNetworkData(user);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-slate-600">
          <div className="w-6 h-6 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
          Loading network...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={theme.text.body}>Please log in to view your network.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <NetworkHeader />
      
      <NetworkStats
        totalProfessionals={allProfessionals.length}
        totalConnections={connections.length}
        pendingInvites={pendingInvites.length}
        verifiedPros={stats.verifiedPros}
        totalEarnings={stats.totalEarnings || 0} // ✅ ADD
        onEarningsClick={() => setShowEarningsModal(true)} // ✅ ADD
      />

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        <TabButton
          active={activeTab === "professionals"}
          onClick={() => setActiveTab("professionals")}
          label="Discover"
        />
        <TabButton
          active={activeTab === "connections"}
          onClick={() => setActiveTab("connections")}
          label={`My Connections (${connections.length})`}
        />
        <TabButton
          active={activeTab === "invites"}
          onClick={() => setActiveTab("invites")}
          label={`Invites (${pendingInvites.length})`}
          notification={pendingInvites.length > 0}
        />
      </div>

      {/* Tab Content */}
      {activeTab === "professionals" && (
        <DiscoverTab
          professionals={allProfessionals}
          currentUserId={user.id}
          connections={connections}
          sentInvites={sentInvites}
          pendingInvites={pendingInvites}
          onRefresh={refreshData}
        />
      )}

      {activeTab === "connections" && (
        <MyConnections
          connections={connections}
          currentUserId={user.id}
          onRefresh={refreshData}
        />
      )}

      {activeTab === "invites" && (
        <InvitesTab
          pendingInvites={pendingInvites}
          sentInvites={sentInvites}
          onRefresh={refreshData}
        />
      )}

      {/* ✅ Earnings Modal */}
      {showEarningsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto my-8">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Commission Earnings</h2>
                <p className="text-sm text-slate-600">Track your referral income and payments</p>
              </div>
              <button
                onClick={() => setShowEarningsModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <CommissionLedger userId={user.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Tab Button Component
function TabButton({ active, onClick, label, notification }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 font-semibold transition relative whitespace-nowrap ${
        active ? "text-blue-700" : "text-slate-600 hover:text-slate-900"
      }`}
    >
      <span className="flex items-center gap-2">
        {label}
        {notification && (
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </span>
      {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>}
    </button>
  );
}