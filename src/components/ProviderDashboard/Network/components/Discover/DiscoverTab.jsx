// src/components/ProviderDashboard/Network/components/Discover/DiscoverTab.jsx
import { useState, useEffect, useMemo } from "react";
import { Users, Search } from "lucide-react";
import { theme } from "../../../../../styles/theme";
import SearchFilters from "./SearchFilters";
import ProfessionalCard from "./ProfessionalCard";
import ConnectionInviteModal from "../Modals/ConnectionInviteModal";
import { useConnectionActions } from "../../hooks/useConnectionActions";

export default function DiscoverTab({
  professionals,
  currentUserId,
  connections,
  sentInvites,
  pendingInvites,
  onRefresh,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState("all");
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);

  const { sendConnectionInvite, loading } = useConnectionActions(onRefresh);

  // Get IDs of already connected professionals (useMemo to prevent recreation)
  const connectedIds = useMemo(() => {
    return new Set(
      connections.map((c) => c.connected_provider?.id).filter(Boolean)
    );
  }, [connections]);

  // Filter out already connected professionals (useMemo to prevent recreation)
  const availableProfessionals = useMemo(() => {
    return professionals.filter((pro) => !connectedIds.has(pro.id));
  }, [professionals, connectedIds]);

  // Get unique service categories (useMemo to prevent recreation)
  const serviceCategories = useMemo(() => {
    return [
      "all",
      ...new Set(
        availableProfessionals.flatMap((p) => [
          ...(p.service_categories || []),
          ...(p.services_offered || []),
        ])
      ),
    ];
  }, [availableProfessionals]);

  // Filter professionals
  useEffect(() => {
    let filtered = availableProfessionals;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (pro) =>
          pro.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pro.service_categories?.some((cat) =>
            cat.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
          pro.services_offered?.some((service) =>
            service.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Service category filter
    if (selectedService !== "all") {
      filtered = filtered.filter(
        (pro) =>
          pro.service_categories?.includes(selectedService) ||
          pro.services_offered?.includes(selectedService)
      );
    }

    setFilteredProfessionals(filtered);
  }, [searchQuery, selectedService, availableProfessionals]);

  // Check connection status
  const getConnectionStatus = (professionalId) => {
    // Check if connected
    const isConnected = connectedIds.has(professionalId);
    if (isConnected) return "connected";

    // Check if invite sent
    const inviteSent = sentInvites.some((i) => i.recipient?.id === professionalId);
    if (inviteSent) return "pending_sent";

    // Check if invite received
    const inviteReceived = pendingInvites.some(
      (i) => i.sender?.id === professionalId
    );
    if (inviteReceived) return "pending_received";

    return "not_connected";
  };

  const handleSendInvite = (professional) => {
    setSelectedProfessional(professional);
    setShowInviteModal(true);
  };

  const handleConfirmInvite = async (message) => {
    const result = await sendConnectionInvite(
      currentUserId,
      selectedProfessional.id,
      message
    );

    if (result.success) {
      alert(`Connection invite sent to ${selectedProfessional.business_name}!`);
      setShowInviteModal(false);
      setSelectedProfessional(null);
    } else {
      alert("Failed to send invite. Please try again.");
    }
  };

  return (
    <>
      <SearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        serviceCategories={serviceCategories}
      />

      {/* Professionals Grid */}
      {filteredProfessionals.length === 0 ? (
        <div className={`${theme.card.base} ${theme.card.padding} text-center py-12`}>
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-slate-400" size={32} />
          </div>
          <p className={`${theme.text.h4} mb-2`}>No Professionals Found</p>
          <p className={theme.text.body}>
            {searchQuery || selectedService !== "all"
              ? "Try adjusting your filters"
              : connectedIds.size === professionals.length
              ? "You're already connected with all available professionals!"
              : "No professionals available"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProfessionals.map((professional) => (
            <ProfessionalCard
              key={professional.id}
              professional={professional}
              connectionStatus={getConnectionStatus(professional.id)}
              onSendInvite={handleSendInvite}
              currentUserId={currentUserId}
              connections={connections}
            />
          ))}
        </div>
      )}

      {/* Connection Invite Modal */}
      {showInviteModal && selectedProfessional && (
        <ConnectionInviteModal
          professional={selectedProfessional}
          onSend={handleConfirmInvite}
          onClose={() => {
            setShowInviteModal(false);
            setSelectedProfessional(null);
          }}
          loading={loading}
        />
      )}
    </>
  );
}