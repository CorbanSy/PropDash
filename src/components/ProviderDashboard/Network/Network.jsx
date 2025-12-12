// src/components/ProviderDashboard/Network/Network.jsx
import { useState, useEffect } from "react";
import {
  Users,
  Briefcase,
  Star,
  TrendingUp,
  MapPin,
  Phone,
  Calendar,
  Award,
  UserPlus,
  CheckCircle,
  Shield,
  Search,
  Send,
  MessageSquare,
  X,
  UserCheck,
  UserX,
  Clock,
  Bell,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient";
import useAuth from "../../../hooks/useAuth";
import { theme } from "../../../styles/theme";
import MyConnections from "./components/MyConnections";

export default function Network() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("professionals");
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [connections, setConnections] = useState([]);
  const [allProfessionals, setAllProfessionals] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [sentInvites, setSentInvites] = useState([]);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState("all");
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);

  // Modals
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);

  useEffect(() => {
    if (user) {
      fetchNetworkData();
    }
  }, [user]);

  useEffect(() => {
    // Apply filters to all professionals
    let filtered = allProfessionals;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((pro) =>
        pro.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pro.service_categories?.some(cat => 
          cat.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        pro.services_offered?.some(service =>
          service.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Service category filter
    if (selectedService !== "all") {
      filtered = filtered.filter((pro) =>
        pro.service_categories?.includes(selectedService) ||
        pro.services_offered?.includes(selectedService)
      );
    }

    setFilteredProfessionals(filtered);
  }, [searchQuery, selectedService, allProfessionals]);

  const fetchNetworkData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch accepted connections
      const { data: connectionsData, error: connectionsError } = await supabase
        .from("professional_network")
        .select(`
          *,
          connected_provider:providers!professional_network_connected_provider_id_fkey (
            id,
            business_name,
            profile_photo,
            phone,
            phone_verified,
            services_offered,
            service_categories,
            base_rate,
            verification_status,
            is_online,
            is_available
          )
        `)
        .eq("provider_id", user.id)
        .eq("status", "accepted")
        .order("connected_at", { ascending: false });

      if (connectionsError) {
        console.error("Error fetching connections:", connectionsError);
      } else {
        setConnections(connectionsData || []);
      }

      // Fetch pending invites (received)
      const { data: pendingData, error: pendingError } = await supabase
        .from("professional_network")
        .select(`
          *,
          sender:providers!professional_network_provider_id_fkey (
            id,
            business_name,
            profile_photo,
            phone,
            services_offered,
            service_categories,
            base_rate,
            verification_status
          )
        `)
        .eq("connected_provider_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (pendingError) {
        console.error("Error fetching pending invites:", pendingError);
      } else {
        setPendingInvites(pendingData || []);
      }

      // Fetch sent invites
      const { data: sentData, error: sentError } = await supabase
        .from("professional_network")
        .select(`
          *,
          recipient:providers!professional_network_connected_provider_id_fkey (
            id,
            business_name,
            profile_photo,
            services_offered,
            service_categories
          )
        `)
        .eq("provider_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (sentError) {
        console.error("Error fetching sent invites:", sentError);
      } else {
        setSentInvites(sentData || []);
      }

      // Fetch ALL professionals
      const { data: allProData, error: allProError } = await supabase
        .from("providers")
        .select("*")
        .neq("id", user.id)
        .order("business_name", { ascending: true });

      if (allProError) {
        console.error("Error fetching all professionals:", allProError);
      } else {
        setAllProfessionals(allProData || []);
        setFilteredProfessionals(allProData || []);
      }
    } catch (err) {
      console.error("Exception fetching network data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Check if already connected or pending
  const getConnectionStatus = (professionalId) => {
    // Check if accepted connection
    const isConnected = connections.some(
      c => c.connected_provider?.id === professionalId
    );
    if (isConnected) return "connected";

    // Check if invite sent
    const inviteSent = sentInvites.some(
      i => i.recipient?.id === professionalId
    );
    if (inviteSent) return "pending_sent";

    // Check if invite received
    const inviteReceived = pendingInvites.some(
      i => i.sender?.id === professionalId
    );
    if (inviteReceived) return "pending_received";

    return "not_connected";
  };

  // Send connection invite
  const sendConnectionInvite = async (professional, message = "") => {
    try {
      const { error } = await supabase
        .from("professional_network")
        .insert({
          provider_id: user.id,
          connected_provider_id: professional.id,
          connection_type: "colleague",
          status: "pending",
          notes: message,
        });

      if (error) throw error;

      // Refresh data
      await fetchNetworkData();
      setShowInviteModal(false);
      setSelectedProfessional(null);
      
      alert(`Connection invite sent to ${professional.business_name}!`);
    } catch (error) {
      console.error("Error sending invite:", error);
      alert("Failed to send connection invite. Please try again.");
    }
  };

  // Accept connection invite
  const acceptInvite = async (inviteId) => {
    try {
      const { error } = await supabase
        .from("professional_network")
        .update({
          status: "accepted",
          connected_at: new Date().toISOString(),
        })
        .eq("id", inviteId);

      if (error) throw error;

      // Refresh data
      await fetchNetworkData();
      alert("Connection accepted!");
    } catch (error) {
      console.error("Error accepting invite:", error);
      alert("Failed to accept connection. Please try again.");
    }
  };

  // Decline connection invite
  const declineInvite = async (inviteId) => {
    try {
      const { error } = await supabase
        .from("professional_network")
        .delete()
        .eq("id", inviteId);

      if (error) throw error;

      // Refresh data
      await fetchNetworkData();
      alert("Connection declined");
    } catch (error) {
      console.error("Error declining invite:", error);
      alert("Failed to decline connection. Please try again.");
    }
  };

  // Cancel sent invite
  const cancelInvite = async (inviteId) => {
    try {
      const { error } = await supabase
        .from("professional_network")
        .delete()
        .eq("id", inviteId);

      if (error) throw error;

      // Refresh data
      await fetchNetworkData();
      alert("Connection invite cancelled");
    } catch (error) {
      console.error("Error cancelling invite:", error);
      alert("Failed to cancel invite. Please try again.");
    }
  };

  // Get unique service categories
  const serviceCategories = [
    "all",
    ...new Set(
      allProfessionals.flatMap(p => [
        ...(p.service_categories || []),
        ...(p.services_offered || [])
      ])
    )
  ];

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
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className={theme.text.h1}>Professional Network</h1>
          <p className={`${theme.text.body} mt-1`}>
            Connect with other professionals for referrals and collaborations
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Users size={20} />}
          label="All Professionals"
          value={allProfessionals.length}
          color="blue"
        />
        <StatCard
          icon={<UserCheck size={20} />}
          label="My Connections"
          value={connections.length}
          color="emerald"
        />
        <StatCard
          icon={<Clock size={20} />}
          label="Pending Invites"
          value={pendingInvites.length}
          color="amber"
          notification={pendingInvites.length > 0}
        />
        <StatCard
          icon={<Award size={20} />}
          label="Verified Pros"
          value={allProfessionals.filter(p => p.verification_status === "verified").length}
          color="purple"
        />
      </div>

      {/* Network Overview Banner */}
      <div className={`${theme.gradient.providerLight} rounded-2xl p-8 text-white relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <Users size={28} />
            <h2 className="text-2xl font-bold">Your Professional Network</h2>
          </div>
          <p className="text-blue-100 mb-6 max-w-2xl">
            Build your professional network by connecting with other service providers. Send referrals to trusted connections and grow your business together.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-xl font-bold mb-2">1. Find Professionals</div>
              <p className="text-sm text-blue-100">
                Browse and search for professionals by service or location
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-xl font-bold mb-2">2. Send Invite</div>
              <p className="text-sm text-blue-100">
                Request to connect with professionals you want to partner with
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-xl font-bold mb-2">3. Share Referrals</div>
              <p className="text-sm text-blue-100">
                Send customer referrals to your trusted connections
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        <TabButton
          active={activeTab === "professionals"}
          onClick={() => setActiveTab("professionals")}
          icon={<Users size={18} />}
          label="Discover"
        />
        <TabButton
          active={activeTab === "connections"}
          onClick={() => setActiveTab("connections")}
          icon={<UserCheck size={18} />}
          label={`My Connections (${connections.length})`}
        />
        <TabButton
          active={activeTab === "invites"}
          onClick={() => setActiveTab("invites")}
          icon={<Bell size={18} />}
          label={`Invites (${pendingInvites.length})`}
          notification={pendingInvites.length > 0}
        />
      </div>

      {/* Tab Content */}
      {activeTab === "professionals" && (
        <AllProfessionalsTab 
          professionals={filteredProfessionals}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          serviceCategories={serviceCategories}
          currentUserId={user.id}
          getConnectionStatus={getConnectionStatus}
          onSendInvite={(pro) => {
            setSelectedProfessional(pro);
            setShowInviteModal(true);
          }}
          connections={connections}
        />
      )}
      {activeTab === "connections" && (
        <MyConnections 
          connections={connections}
          currentUserId={user.id}
          onRefresh={fetchNetworkData}
        />
      )}
      {activeTab === "invites" && (
        <InvitesTab
          pendingInvites={pendingInvites}
          sentInvites={sentInvites}
          onAccept={acceptInvite}
          onDecline={declineInvite}
          onCancel={cancelInvite}
        />
      )}

      {/* Connection Invite Modal */}
      {showInviteModal && selectedProfessional && (
        <ConnectionInviteModal
          professional={selectedProfessional}
          onSend={sendConnectionInvite}
          onClose={() => {
            setShowInviteModal(false);
            setSelectedProfessional(null);
          }}
        />
      )}
    </div>
  );
}

// All Professionals Tab
function AllProfessionalsTab({ 
  professionals, 
  searchQuery, 
  setSearchQuery,
  selectedService,
  setSelectedService,
  serviceCategories,
  currentUserId,
  getConnectionStatus,
  onSendInvite,
  connections
}) {
  const navigate = useNavigate();

  const handleMessage = async (professional) => {
    const status = getConnectionStatus(professional.id);
    
    if (status !== "connected") {
      alert("You must be connected with this professional to send messages.");
      return;
    }

    try {
      // Check for existing conversation
      const { data: existingConv1 } = await supabase
        .from("provider_conversations")
        .select("id")
        .eq("provider1_id", currentUserId)
        .eq("provider2_id", professional.id)
        .maybeSingle();

      const { data: existingConv2 } = await supabase
        .from("provider_conversations")
        .select("id")
        .eq("provider1_id", professional.id)
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
            provider2_id: professional.id,
            last_message_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (convError) throw convError;
        conversationId = newConv.id;
      }

      navigate('/provider/messages', {
        state: {
          professionalId: professional.id,
          conversationId: conversationId,
          openTab: 'professionals'
        }
      });
    } catch (error) {
      console.error("Error creating conversation:", error);
      alert("Failed to open conversation. Please try again.");
    }
  };

  const handleReferral = (professional) => {
    const status = getConnectionStatus(professional.id);
    
    if (status !== "connected") {
      alert("You must be connected with this professional to send referrals. Send them a connection invite first!");
      return;
    }

    // Find the connection
    const connection = connections.find(
      c => c.connected_provider?.id === professional.id
    );

    if (connection) {
      navigate('/provider/network', {
        state: {
          openReferral: true,
          professionalId: professional.id,
          connectionId: connection.id
        }
      });
    }
  };

  return (
    <>
      {/* Search and Filter Bar */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Service Filter */}
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="border-2 border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Services</option>
            {serviceCategories
              .filter(cat => cat !== "all")
              .map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Professionals Grid */}
      {professionals.length === 0 ? (
        <div className={`${theme.card.base} ${theme.card.padding} text-center py-12`}>
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-slate-400" size={32} />
          </div>
          <p className={`${theme.text.h4} mb-2`}>No Professionals Found</p>
          <p className={theme.text.body}>
            {searchQuery || selectedService !== "all"
              ? "Try adjusting your filters"
              : "No professionals available"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {professionals.map((professional) => (
            <ProfessionalCard
              key={professional.id}
              professional={professional}
              connectionStatus={getConnectionStatus(professional.id)}
              onMessage={handleMessage}
              onReferral={handleReferral}
              onSendInvite={onSendInvite}
            />
          ))}
        </div>
      )}
    </>
  );
}

// Professional Card Component
function ProfessionalCard({ 
  professional, 
  connectionStatus,
  onMessage, 
  onReferral,
  onSendInvite 
}) {
  const isVerified = professional.verification_status === "verified";
  
  const serviceIcons = {
    handyman: "🔧",
    plumbing: "🚰",
    electrical: "⚡",
    hvac: "❄️",
    carpentry: "🪚",
    painting: "🎨",
    landscaping: "🌳",
    cleaning: "🧹",
    assembly: "📦",
  };

  const primaryService = professional.service_categories?.[0] || professional.services_offered?.[0] || "Service Provider";

  const getConnectionButton = () => {
    switch (connectionStatus) {
      case "connected":
        return (
          <div className="flex items-center gap-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg font-semibold text-sm">
            <UserCheck size={14} />
            Connected
          </div>
        );
      case "pending_sent":
        return (
          <div className="flex items-center gap-1 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg font-semibold text-sm">
            <Clock size={14} />
            Invite Sent
          </div>
        );
      case "pending_received":
        return (
          <div className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold text-sm">
            <Bell size={14} />
            Invited You
          </div>
        );
      default:
        return (
          <button
            onClick={() => onSendInvite(professional)}
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-sm"
          >
            <UserPlus size={14} />
            Connect
          </button>
        );
    }
  };

  return (
    <div className={`${theme.card.base} ${theme.card.padding} ${theme.card.hover}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          {/* Profile Photo */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
            {professional.profile_photo ? (
              <img
                src={professional.profile_photo}
                alt={professional.business_name}
                className="w-full h-full object-cover"
              />
            ) : (
              professional.business_name?.charAt(0).toUpperCase() || "P"
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-slate-900 text-base truncate">
                {professional.business_name || "Professional"}
              </h3>
              {isVerified && (
                <CheckCircle className="text-green-600 flex-shrink-0" size={14} />
              )}
            </div>
            <p className="text-xs text-slate-600 capitalize truncate">
              {primaryService}
            </p>
          </div>
        </div>
        
        {professional.is_online && (
          <div className="flex items-center gap-1 text-xs flex-shrink-0">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium">Online</span>
          </div>
        )}
      </div>

      {/* Services */}
      {(professional.service_categories || professional.services_offered) && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            {(professional.service_categories || professional.services_offered)?.slice(0, 3).map((service, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium"
              >
                <span>{serviceIcons[service] || "🔨"}</span>
                <span className="capitalize">{service}</span>
              </div>
            ))}
            {(professional.service_categories || professional.services_offered)?.length > 3 && (
              <div className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium">
                +{(professional.service_categories || professional.services_offered).length - 3}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="space-y-1.5 text-xs text-slate-600 mb-4">
        {professional.base_rate && (
          <div className="flex items-center gap-2">
            <TrendingUp size={12} />
            <span>${(professional.base_rate / 100).toFixed(0)}/hr</span>
          </div>
        )}
        {professional.verification_status && (
          <div className="flex items-center gap-2">
            <Shield size={12} className={professional.verification_status === 'verified' ? 'text-green-600' : 'text-slate-400'} />
            <span className="capitalize">{professional.verification_status}</span>
          </div>
        )}
      </div>

      {/* Connection Status */}
      <div className="mb-3">
        {getConnectionButton()}
      </div>

      {/* Actions */}
      {connectionStatus === "connected" && (
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onMessage(professional)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-sm"
          >
            <MessageSquare size={14} />
            Message
          </button>
          <button
            onClick={() => onReferral(professional)}
            className="flex items-center justify-center gap-2 px-3 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition text-sm"
          >
            <Send size={14} />
            Refer
          </button>
        </div>
      )}
    </div>
  );
}

// Connections Tab
function ConnectionsTab({ connections, currentUserId, onRefresh }) {
  const navigate = useNavigate();
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);

  const handleMessage = async (connection) => {
    const professional = connection.connected_provider;
    
    try {
      // Check for existing conversation
      const { data: existingConv1 } = await supabase
        .from("provider_conversations")
        .select("id")
        .eq("provider1_id", currentUserId)
        .eq("provider2_id", professional.id)
        .maybeSingle();

      const { data: existingConv2 } = await supabase
        .from("provider_conversations")
        .select("id")
        .eq("provider1_id", professional.id)
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
            provider2_id: professional.id,
            last_message_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (convError) throw convError;
        conversationId = newConv.id;
      }

      navigate('/provider/messages', {
        state: {
          professionalId: professional.id,
          conversationId: conversationId,
          openTab: 'professionals'
        }
      });
    } catch (error) {
      console.error("Error creating conversation:", error);
      alert("Failed to open conversation. Please try again.");
    }
  };

  const handleReferral = (connection) => {
    setSelectedConnection(connection);
    setShowReferralModal(true);
  };

  const handleRemoveConnection = async (connectionId) => {
    if (!confirm("Are you sure you want to remove this connection?")) return;

    try {
      const { error } = await supabase
        .from("professional_network")
        .delete()
        .eq("id", connectionId);

      if (error) throw error;

      alert("Connection removed");
      onRefresh();
    } catch (error) {
      console.error("Error removing connection:", error);
      alert("Failed to remove connection. Please try again.");
    }
  };

  if (connections.length === 0) {
    return (
      <div className={`${theme.card.base} ${theme.card.padding} text-center py-12`}>
        <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserCheck className="text-slate-400" size={32} />
        </div>
        <p className={`${theme.text.h4} mb-2`}>No Connections Yet</p>
        <p className={theme.text.body}>
          Connect with professionals in the Discover tab to start building your network
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {connections.map((connection) => (
          <ConnectionCard
            key={connection.id}
            connection={connection}
            onMessage={handleMessage}
            onReferral={handleReferral}
            onRemove={handleRemoveConnection}
          />
        ))}
      </div>

      {/* Referral Modal */}
      {showReferralModal && selectedConnection && (
        <ReferralModal
          connection={selectedConnection}
          currentUserId={currentUserId}
          onClose={() => {
            setShowReferralModal(false);
            setSelectedConnection(null);
          }}
        />
      )}
    </>
  );
}

// Connection Card Component
function ConnectionCard({ connection, onMessage, onReferral, onRemove }) {
  const provider = connection.connected_provider;
  if (!provider) return null;

  const primaryService = provider.service_categories?.[0] || provider.services_offered?.[0] || "Service Provider";

  return (
    <div className={`${theme.card.base} ${theme.card.padding} ${theme.card.hover}`}>
      <div className="flex items-start gap-4 mb-4">
        {/* Profile Photo */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 overflow-hidden">
          {provider.profile_photo ? (
            <img
              src={provider.profile_photo}
              alt={provider.business_name}
              className="w-full h-full object-cover"
            />
          ) : (
            provider.business_name?.charAt(0).toUpperCase() || "P"
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-slate-900 text-lg">
                  {provider.business_name || "Professional"}
                </h3>
                {provider.verification_status === "verified" && (
                  <CheckCircle className="text-green-600" size={16} />
                )}
              </div>
              <p className="text-sm text-slate-600 capitalize">{primaryService}</p>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold capitalize">
                {connection.connection_type || "Colleague"}
              </div>
              {provider.is_online && (
                <div className="flex items-center gap-1 text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 font-medium">Online</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5 text-sm text-slate-600 mb-3">
            {provider.phone && (
              <div className="flex items-center gap-2">
                <Phone size={14} />
                <span>{provider.phone}</span>
              </div>
            )}
            {provider.base_rate && (
              <div className="flex items-center gap-2">
                <TrendingUp size={14} />
                <span>${(provider.base_rate / 100).toFixed(0)}/hr</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar size={12} />
              <span>
                Connected {new Date(connection.connected_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {connection.notes && (
            <p className="text-sm text-slate-600 mb-3 p-3 bg-slate-50 rounded-lg italic">
              "{connection.notes}"
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => onMessage(connection)}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-sm flex items-center justify-center gap-1"
        >
          <MessageSquare size={14} />
          Message
        </button>
        <button
          onClick={() => onReferral(connection)}
          className="px-3 py-2 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition text-sm flex items-center justify-center gap-1"
        >
          <Send size={14} />
          Refer
        </button>
        <button
          onClick={() => onRemove(connection.id)}
          className="px-3 py-2 border-2 border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition text-sm flex items-center justify-center gap-1"
        >
          <UserX size={14} />
          Remove
        </button>
      </div>
    </div>
  );
}

// Invites Tab
function InvitesTab({ pendingInvites, sentInvites, onAccept, onDecline, onCancel }) {
  const [activeSubTab, setActiveSubTab] = useState("received");

  return (
    <div className="space-y-6">
      {/* Sub-tab navigation */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab("received")}
          className={`px-4 py-2 font-semibold transition relative ${
            activeSubTab === "received" ? "text-blue-700" : "text-slate-600"
          }`}
        >
          Received ({pendingInvites.length})
          {activeSubTab === "received" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>
          )}
        </button>
        <button
          onClick={() => setActiveSubTab("sent")}
          className={`px-4 py-2 font-semibold transition relative ${
            activeSubTab === "sent" ? "text-blue-700" : "text-slate-600"
          }`}
        >
          Sent ({sentInvites.length})
          {activeSubTab === "sent" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>
          )}
        </button>
      </div>

      {/* Received Invites */}
      {activeSubTab === "received" && (
        <>
          {pendingInvites.length === 0 ? (
            <div className={`${theme.card.base} ${theme.card.padding} text-center py-12`}>
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="text-slate-400" size={32} />
              </div>
              <p className={`${theme.text.h4} mb-2`}>No Pending Invites</p>
              <p className={theme.text.body}>
                Connection requests will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingInvites.map((invite) => (
                <ReceivedInviteCard
                  key={invite.id}
                  invite={invite}
                  onAccept={onAccept}
                  onDecline={onDecline}
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
            <div className={`${theme.card.base} ${theme.card.padding} text-center py-12`}>
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-slate-400" size={32} />
              </div>
              <p className={`${theme.text.h4} mb-2`}>No Sent Invites</p>
              <p className={theme.text.body}>
                Your sent connection requests will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sentInvites.map((invite) => (
                <SentInviteCard
                  key={invite.id}
                  invite={invite}
                  onCancel={onCancel}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Received Invite Card
function ReceivedInviteCard({ invite, onAccept, onDecline }) {
  const sender = invite.sender;
  if (!sender) return null;

  const primaryService = sender.service_categories?.[0] || sender.services_offered?.[0] || "Service Provider";

  return (
    <div className={`${theme.card.base} ${theme.card.padding} border-l-4 border-blue-500`}>
      <div className="flex items-start gap-4">
        {/* Profile Photo */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
          {sender.profile_photo ? (
            <img
              src={sender.profile_photo}
              alt={sender.business_name}
              className="w-full h-full object-cover"
            />
          ) : (
            sender.business_name?.charAt(0).toUpperCase() || "P"
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-slate-900 text-lg">
                  {sender.business_name || "Professional"}
                </h3>
                {sender.verification_status === "verified" && (
                  <CheckCircle className="text-green-600" size={16} />
                )}
              </div>
              <p className="text-sm text-slate-600 capitalize">{primaryService}</p>
            </div>
            <div className="text-xs text-slate-500">
              {new Date(invite.created_at).toLocaleDateString()}
            </div>
          </div>

          {invite.notes && (
            <p className="text-sm text-slate-700 mb-3 p-3 bg-blue-50 rounded-lg">
              "{invite.notes}"
            </p>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => onAccept(invite.id)}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              <Check size={16} />
              Accept
            </button>
            <button
              onClick={() => onDecline(invite.id)}
              className="flex-1 px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition flex items-center justify-center gap-2"
            >
              <X size={16} />
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sent Invite Card
function SentInviteCard({ invite, onCancel }) {
  const recipient = invite.recipient;
  if (!recipient) return null;

  const primaryService = recipient.service_categories?.[0] || recipient.services_offered?.[0] || "Service Provider";

  return (
    <div className={`${theme.card.base} ${theme.card.padding} border-l-4 border-amber-500`}>
      <div className="flex items-start gap-4">
        {/* Profile Photo */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
          {recipient.profile_photo ? (
            <img
              src={recipient.profile_photo}
              alt={recipient.business_name}
              className="w-full h-full object-cover"
            />
          ) : (
            recipient.business_name?.charAt(0).toUpperCase() || "P"
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">
                {recipient.business_name || "Professional"}
              </h3>
              <p className="text-sm text-slate-600 capitalize">{primaryService}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-semibold">
                <Clock size={12} />
                Pending
              </div>
              <div className="text-xs text-slate-500">
                {new Date(invite.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          {invite.notes && (
            <p className="text-sm text-slate-700 mb-3 p-3 bg-amber-50 rounded-lg">
              "{invite.notes}"
            </p>
          )}

          <button
            onClick={() => onCancel(invite.id)}
            className="px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition flex items-center gap-2"
          >
            <X size={16} />
            Cancel Invite
          </button>
        </div>
      </div>
    </div>
  );
}

// Connection Invite Modal
function ConnectionInviteModal({ professional, onSend, onClose }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);
    await onSend(professional, message);
    setSending(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2.5 rounded-full">
              <UserPlus className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Send Connection Invite</h3>
              <p className="text-sm text-slate-600">To: {professional.business_name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Add a message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi! I'd like to connect and explore collaboration opportunities..."
              rows={4}
              className="w-full border-2 border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
            <p className="text-xs text-slate-500 mt-1">
              Let them know why you'd like to connect
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {sending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </>
            ) : (
              <>
                <Send size={16} />
                Send Invite
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Referral Modal Component
function ReferralModal({ connection, currentUserId, onClose }) {
  const professional = connection.connected_provider;
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [serviceNeeded, setServiceNeeded] = useState("");
  const [notes, setNotes] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!customerName.trim() || !serviceNeeded.trim()) {
      alert("Please fill in customer name and service needed.");
      return;
    }

    setSending(true);
    try {
      const referralMessage = `🤝 New Referral

Customer: ${customerName}
${customerPhone ? `Phone: ${customerPhone}` : ''}
${customerEmail ? `Email: ${customerEmail}` : ''}
Service Needed: ${serviceNeeded}
${notes ? `Notes: ${notes}` : ''}

Please reach out to this customer!`;

      // Check for existing conversation
      const { data: existingConv1 } = await supabase
        .from("provider_conversations")
        .select("id")
        .eq("provider1_id", currentUserId)
        .eq("provider2_id", professional.id)
        .maybeSingle();

      const { data: existingConv2 } = await supabase
        .from("provider_conversations")
        .select("id")
        .eq("provider1_id", professional.id)
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
            provider2_id: professional.id,
            last_message_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (convError) throw convError;
        conversationId = newConv.id;
      }

      // Send referral as message
      const { error: messageError } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          receiver_id: professional.id,
          message: referralMessage,
        });

      if (messageError) throw messageError;

      alert(`Referral sent to ${professional.business_name}!`);
      onClose();
    } catch (error) {
      console.error("Error sending referral:", error);
      alert("Failed to send referral. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 my-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2.5 rounded-full">
              <Send className="text-purple-600" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Send Referral</h3>
              <p className="text-sm text-slate-600">To: {professional.business_name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Customer Name *
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="John Doe"
              className="w-full border-2 border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Customer Phone
            </label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full border-2 border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Customer Email
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full border-2 border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Service Needed *
            </label>
            <input
              type="text"
              value={serviceNeeded}
              onChange={(e) => setServiceNeeded(e.target.value)}
              placeholder="e.g., Kitchen plumbing repair"
              className="w-full border-2 border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional details about the job..."
              rows={3}
              className="w-full border-2 border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!customerName.trim() || !serviceNeeded.trim() || sending}
            className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? "Sending..." : "Send Referral"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, color, notification }) {
  const colors = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
  };

  return (
    <div className={`${colors[color]} border rounded-xl p-5 relative`}>
      {notification && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
          {value}
        </div>
      )}
      <div className="flex items-center justify-between mb-3">
        <div className="bg-white p-2 rounded-lg shadow-sm">
          {icon}
        </div>
      </div>
      <p className="text-sm font-medium opacity-80 mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

// Tab Button Component
function TabButton({ active, onClick, icon, label, notification }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 font-semibold transition relative whitespace-nowrap ${
        active ? "text-blue-700" : "text-slate-600 hover:text-slate-900"
      }`}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
        {notification && (
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </span>
      {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>}
    </button>
  );
}