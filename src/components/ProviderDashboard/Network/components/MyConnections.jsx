// src/components/ProviderDashboard/Network/components/MyConnections.jsx
import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  UserCheck,
  TrendingUp,
  Award,
  Send,
  MessageSquare,
  UserX,
  Calendar,
  Star,
  DollarSign,
  ChevronDown,
  FileText,
} from "lucide-react";
import { supabase } from "../../../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import PartnerCard from "./PartnerCard";
import PartnerProfile from "./PartnerProfile";
import PartnerAgreement from "./PartnerAgreement";
import { theme } from "../../../../styles/theme";

export default function MyConnections({ connections, currentUserId, onRefresh }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [showDropdown, setShowDropdown] = useState(false);

  // Modals
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);

  // Transform connections data to match PartnerCard expected format
  const transformedConnections = connections.map((connection) => {
    const provider = connection.connected_provider;
    return {
      id: connection.id,
      connectionId: connection.id,
      providerId: provider.id,
      business_name: provider.business_name,
      avatar_url: provider.profile_photo,
      trade: provider.service_categories?.[0] || provider.services_offered?.[0] || "Professional",
      verified: provider.verification_status === "verified",
      rating: 4.8, // You can add this to providers table
      reviewCount: 0, // You can add this
      jobsCompleted: 0, // Track from jobs table
      jobsReferred: 0, // Track from referrals
      location: {
        city: provider.service_areas?.[0] || "Not specified",
      },
      avgResponseTime: 2,
      specialties: provider.service_categories || provider.services_offered || [],
      status: connection.status === "accepted" ? "active" : "inactive",
      phone: provider.phone,
      email: null, // Add to providers if needed
      bio: null, // Add to providers if needed
      connected_at: connection.connected_at,
      connection_type: connection.connection_type,
      notes: connection.notes,
      commissionsEarned: 0, // Calculate from commissions table
      is_online: provider.is_online,
      base_rate: provider.base_rate,
    };
  });

  // Filter connections
  const filteredConnections = transformedConnections.filter((partner) => {
    // Search filter
    if (searchQuery) {
      const matchesSearch =
        partner.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.trade?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.specialties?.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        );
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filterStatus !== "all") {
      if (filterStatus === "active" && partner.status !== "active") return false;
      if (filterStatus === "verified" && !partner.verified) return false;
      if (filterStatus === "online" && !partner.is_online) return false;
    }

    return true;
  });

  // Sort connections
  const sortedConnections = [...filteredConnections].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.connected_at) - new Date(a.connected_at);
      case "name":
        return (a.business_name || "").localeCompare(b.business_name || "");
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "jobs":
        return (b.jobsReferred || 0) - (a.jobsReferred || 0);
      default:
        return 0;
    }
  });

  // Calculate stats
  const stats = {
    total: connections.length,
    active: transformedConnections.filter((p) => p.status === "active").length,
    verified: transformedConnections.filter((p) => p.verified).length,
    totalReferrals: transformedConnections.reduce(
      (sum, p) => sum + (p.jobsReferred || 0),
      0
    ),
    totalEarnings: transformedConnections.reduce(
      (sum, p) => sum + (p.commissionsEarned || 0),
      0
    ),
  };

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
          Connect with professionals in the Discover tab to start building your
          network
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          icon={<Users size={18} />}
          label="Total"
          value={stats.total}
          color="blue"
        />
        <StatCard
          icon={<UserCheck size={18} />}
          label="Active"
          value={stats.active}
          color="green"
        />
        <StatCard
          icon={<Award size={18} />}
          label="Verified"
          value={stats.verified}
          color="purple"
        />
        <StatCard
          icon={<Send size={18} />}
          label="Referrals"
          value={stats.totalReferrals}
          color="amber"
        />
        <StatCard
          icon={<DollarSign size={18} />}
          label="Earned"
          value={`$${stats.totalEarnings}`}
          color="emerald"
        />
      </div>

      {/* Search, Filter, and Sort */}
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
              placeholder="Search connections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border-2 border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Connections</option>
            <option value="active">Active Only</option>
            <option value="verified">Verified Only</option>
            <option value="online">Online Now</option>
          </select>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 border-2 border-slate-300 rounded-lg px-4 py-2.5 hover:bg-slate-50 transition"
            >
              <Filter size={18} />
              <span className="text-sm font-medium">
                Sort:{" "}
                {sortBy === "recent"
                  ? "Recent"
                  : sortBy === "name"
                  ? "Name"
                  : sortBy === "rating"
                  ? "Rating"
                  : "Jobs"}
              </span>
              <ChevronDown size={16} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 bg-white border-2 border-slate-200 rounded-lg shadow-lg z-10 min-w-[160px]">
                <button
                  onClick={() => {
                    setSortBy("recent");
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm"
                >
                  Most Recent
                </button>
                <button
                  onClick={() => {
                    setSortBy("name");
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm"
                >
                  Name (A-Z)
                </button>
                <button
                  onClick={() => {
                    setSortBy("rating");
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm"
                >
                  Highest Rated
                </button>
                <button
                  onClick={() => {
                    setSortBy("jobs");
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm"
                >
                  Most Referrals
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="mt-3 text-sm text-slate-600">
          Showing {sortedConnections.length} of {stats.total} connections
        </div>
      </div>

      {/* Connections Grid */}
      {sortedConnections.length === 0 ? (
        <div className={`${theme.card.base} ${theme.card.padding} text-center py-12`}>
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-slate-400" size={32} />
          </div>
          <h3 className={`${theme.text.h3} mb-2`}>No Matches Found</h3>
          <p className={theme.text.body}>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedConnections.map((partner) => (
            <div key={partner.id} className="relative">
              <PartnerCard partner={partner} onClick={() => handleViewProfile(partner)} />
              
              {/* Quick Actions Overlay */}
              <div className="absolute top-2 right-2 flex gap-2">
                {partner.is_online && (
                  <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Online
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

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
          providerName="Your Business" // Pass actual provider name
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

// Stat Card Component
function StatCard({ icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
  };

  return (
    <div className={`${colors[color]} border rounded-xl p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-white p-1.5 rounded-lg shadow-sm">{icon}</div>
        <p className="text-xs font-medium opacity-80">{label}</p>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

// Referral Modal Component
function ReferralModal({ partner, currentUserId, onClose }) {
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
${customerPhone ? `Phone: ${customerPhone}` : ""}
${customerEmail ? `Email: ${customerEmail}` : ""}
Service Needed: ${serviceNeeded}
${notes ? `Notes: ${notes}` : ""}

Please reach out to this customer!`;

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

        await supabase
          .from("provider_conversations")
          .update({ last_message_at: new Date().toISOString() })
          .eq("id", conversationId);
      } else {
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

      // Send referral as message
      const { error: messageError } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: currentUserId,
        receiver_id: partner.providerId,
        message: referralMessage,
      });

      if (messageError) throw messageError;

      alert(`Referral sent to ${partner.business_name}!`);
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
              <p className="text-sm text-slate-600">To: {partner.business_name}</p>
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