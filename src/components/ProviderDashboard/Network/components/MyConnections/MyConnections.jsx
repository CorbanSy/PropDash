// src/components/ProviderDashboard/Network/components/MyConnections/MyConnections.jsx
import { useState } from "react";
import { UserCheck } from "lucide-react";
import { supabase } from "../../../../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { theme } from "../../../../../styles/theme";
import { transformConnections, filterConnections, sortConnections, calculateStats } from "../../utils/connectionHelpers";
import ConnectionsHeader from "./ConnectionsHeader";
import ConnectionsStats from "./ConnectionsStats";
import ConnectionsSearch from "./ConnectionsSearch";
import ConnectionsGrid from "./ConnectionsGrid";
import PartnerProfile from "../PartnerProfile";
import PartnerAgreement from "../PartnerAgreement";
import ReferralModal from "../Modals/ReferralModal";

export default function MyConnections({ connections, currentUserId, onRefresh }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Modals
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);

  // Transform and filter data
  const transformedConnections = transformConnections(connections);
  const filteredConnections = filterConnections(transformedConnections, searchQuery, filterStatus);
  const sortedConnections = sortConnections(filteredConnections, sortBy);
  const stats = calculateStats(connections, transformedConnections);

  const handleViewProfile = (partner) => {
    setSelectedPartner(partner);
    setShowProfileModal(true);
  };

  const handleMessage = async (partner) => {
    try {
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
      } else {
        // Create new conversation
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

      navigate("/provider/messages", {
        state: {
          professionalId: partner.providerId,
          conversationId: conversationId,
          openTab: "professionals",
        },
      });
    } catch (error) {
      console.error("Error creating conversation:", error);
      alert("Failed to open conversation. Please try again.");
    }
  };

  const handleReferJob = (partner) => {
    setSelectedPartner(partner);
    setShowReferralModal(true);
  };

  const handleAcceptAgreement = async (agreement) => {
    // Save agreement acceptance to database
    try {
      const { error } = await supabase.from("partner_agreements").insert({
        provider_id: currentUserId,
        partner_id: selectedPartner.providerId,
        connection_id: selectedPartner.connectionId,
        agreement_text: agreement.terms,
        commission_rate: 0.05, // 5% default
        accepted_at: new Date().toISOString(),
      });

      if (error) throw error;

      alert("Partner agreement accepted!");
      setShowAgreementModal(false);
      onRefresh();
    } catch (error) {
      console.error("Error accepting agreement:", error);
      alert("Failed to save agreement. Please try again.");
    }
  };

  if (connections.length === 0) {
    return (
      <div className={`${theme.card.base} ${theme.card.padding} text-center py-12`}>
        <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserCheck className="text-slate-400" size={32} />
        </div>
        <h3 className={`${theme.text.h3} mb-2`}>No Connections Yet</h3>
        <p className={theme.text.body}>
          Connect with professionals in the Discover tab to start building your network
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ConnectionsHeader />
      
      <ConnectionsStats stats={stats} />

      <ConnectionsSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
        totalConnections={stats.total}
        filteredCount={sortedConnections.length}
      />

      <ConnectionsGrid
        connections={sortedConnections}
        currentUserId={currentUserId}
        onViewProfile={handleViewProfile}
        onMessage={handleMessage}
        onRefer={handleReferJob}
        onRefresh={onRefresh}
      />

      {/* Partner Profile Modal */}
      {showProfileModal && selectedPartner && (
        <PartnerProfile
          partner={selectedPartner}
          userId={currentUserId}
          onClose={() => {
            setShowProfileModal(false);
            setSelectedPartner(null);
          }}
          onRefresh={onRefresh}
        />
      )}

      {/* Partner Agreement Modal */}
      {showAgreementModal && selectedPartner && (
        <PartnerAgreement
          partner={selectedPartner}
          providerName="Your Business"
          onAccept={handleAcceptAgreement}
          onDecline={() => setShowAgreementModal(false)}
          onClose={() => setShowAgreementModal(false)}
        />
      )}

      {/* Referral Modal */}
      {showReferralModal && selectedPartner && (
        <ReferralModal
          partner={selectedPartner}
          currentUserId={currentUserId}
          onClose={() => {
            setShowReferralModal(false);
            setSelectedPartner(null);
          }}
        />
      )}
    </div>
  );
}