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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient";
import useAuth from "../../../hooks/useAuth";
import { theme } from "../../../styles/theme";

export default function Network() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("professionals");
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [professionals, setProfessionals] = useState([]);
  const [allProfessionals, setAllProfessionals] = useState([]);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState("all");
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);

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
      // Fetch professional network connections
      const { data: professionalsData, error: professionalsError } = await supabase
        .from("professional_network")
        .select(`
          *,
          connected_provider:providers!professional_network_connected_provider_id_fkey (
            id,
            business_name,
            phone,
            phone_verified,
            services_offered,
            service_categories,
            base_rate,
            verification_status,
            is_online,
            is_available,
            latitude,
            longitude
          )
        `)
        .eq("provider_id", user.id)
        .order("connected_at", { ascending: false });

      if (professionalsError) {
        console.error("Error fetching professionals:", professionalsError);
      } else if (professionalsData) {
        console.log("Professionals data:", professionalsData);
        setProfessionals(professionalsData);
      }

      // Fetch ALL professionals from database (for the professionals tab)
      const { data: allProData, error: allProError } = await supabase
        .from("providers")
        .select("*")
        .neq("id", user.id) // Exclude current user
        .order("business_name", { ascending: true });

      if (allProError) {
        console.error("Error fetching all professionals:", allProError);
      } else if (allProData) {
        console.log("All professionals:", allProData);
        setAllProfessionals(allProData);
        setFilteredProfessionals(allProData);
      }
    } catch (err) {
      console.error("Exception fetching network data:", err);
    } finally {
      setLoading(false);
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
        <div className={theme.text.body}>Loading network...</div>
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
        <button
          className={`${theme.button.provider} flex items-center gap-2`}
          onClick={() => alert("Add connection feature coming soon!")}
        >
          <UserPlus size={18} />
          Add Connection
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<Users size={20} />}
          label="All Professionals"
          value={allProfessionals.length}
          color="blue"
        />
        <StatCard
          icon={<UserPlus size={20} />}
          label="My Connections"
          value={professionals.length}
          color="emerald"
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
            Connect with other professionals in your area for referrals, collaborations, and business growth opportunities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl font-bold mb-2">Find Professionals</div>
              <p className="text-sm text-blue-100">
                Browse all professionals in the network and send messages or referrals
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl font-bold mb-2">Grow Together</div>
              <p className="text-sm text-blue-100">
                Build lasting connections for mutual referrals and collaborative opportunities
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200">
        <TabButton
          active={activeTab === "professionals"}
          onClick={() => setActiveTab("professionals")}
          icon={<Users size={18} />}
          label={`All Professionals (${allProfessionals.length})`}
        />
        <TabButton
          active={activeTab === "connections"}
          onClick={() => setActiveTab("connections")}
          icon={<UserPlus size={18} />}
          label={`My Connections (${professionals.length})`}
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
        />
      )}
      {activeTab === "connections" && (
        <ProfessionalConnectionsTab professionals={professionals} />
      )}
    </div>
  );
}

// All Professionals Tab (NEW)
function AllProfessionalsTab({ 
  professionals, 
  searchQuery, 
  setSearchQuery,
  selectedService,
  setSelectedService,
  serviceCategories,
  currentUserId 
}) {
  const navigate = useNavigate();
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);

  const handleMessage = async (professional) => {
    try {
      // Check for existing conversation in provider_conversations table
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
        // Create new provider conversation
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

      // Navigate to messages with professional info
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
    setSelectedProfessional(professional);
    setShowReferralModal(true);
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
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Service Filter */}
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
            <AllProfessionalCard
              key={professional.id}
              professional={professional}
              onMessage={handleMessage}
              onReferral={handleReferral}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showReferralModal && selectedProfessional && (
        <ReferralModal
          professional={selectedProfessional}
          currentUserId={currentUserId}
          onClose={() => {
            setShowReferralModal(false);
            setSelectedProfessional(null);
          }}
        />
      )}
    </>
  );
}

// All Professional Card Component (NEW)
function AllProfessionalCard({ professional, onMessage, onReferral }) {
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

  return (
    <div className={`${theme.card.base} ${theme.card.padding} ${theme.card.hover}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-slate-900 text-lg">
              {professional.business_name || "Professional"}
            </h3>
            {isVerified && (
              <CheckCircle className="text-green-600 flex-shrink-0" size={16} />
            )}
          </div>
          <p className="text-sm text-slate-600 capitalize">
            {primaryService}
          </p>
        </div>
        {professional.is_online && (
          <div className="flex items-center gap-1 text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium">Online</span>
          </div>
        )}
      </div>

      {/* Services */}
      {(professional.service_categories || professional.services_offered) && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
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
                +{(professional.service_categories || professional.services_offered).length - 3} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="space-y-2 text-sm text-slate-600 mb-4">
        {professional.phone && (
          <div className="flex items-center gap-2">
            <Phone size={14} />
            <span>{professional.phone}</span>
            {professional.phone_verified && (
              <CheckCircle className="text-green-600" size={12} />
            )}
          </div>
        )}
        {professional.base_rate && (
          <div className="flex items-center gap-2">
            <TrendingUp size={14} />
            <span>${(professional.base_rate / 100).toFixed(0)}/hr</span>
          </div>
        )}
        {professional.verification_status && (
          <div className="flex items-center gap-2">
            <Shield size={14} className={professional.verification_status === 'verified' ? 'text-green-600' : 'text-slate-400'} />
            <span className="capitalize">{professional.verification_status}</span>
          </div>
        )}
      </div>

      {/* Actions */}
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
    </div>
  );
}

// Referral Modal Component (NEW)
function ReferralModal({ professional, currentUserId, onClose }) {
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

      // Check for existing conversation in provider_conversations table
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
        
        // Update last_message_at
        await supabase
          .from("provider_conversations")
          .update({ last_message_at: new Date().toISOString() })
          .eq("id", conversationId);
      } else {
        // Create new provider conversation
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
         onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl max-w-md w-full p-6 my-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-full">
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
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!customerName.trim() || !serviceNeeded.trim() || sending}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? "Sending..." : "Send Referral"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Professional Connections Tab (formerly ProfessionalsTab)
function ProfessionalConnectionsTab({ professionals }) {
  if (professionals.length === 0) {
    return (
      <div className={`${theme.card.base} ${theme.card.padding} text-center py-12`}>
        <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Award className="text-slate-400" size={32} />
        </div>
        <p className={`${theme.text.h4} mb-2`}>No Professional Connections Yet</p>
        <p className={theme.text.body}>
          Connect with other professionals for referrals and collaborations
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {professionals.map((connection) => (
        <ProfessionalCard key={connection.id} connection={connection} />
      ))}
    </div>
  );
}

// Professional Card Component (for connections tab)
function ProfessionalCard({ connection }) {
  const provider = connection.connected_provider;
  if (!provider) return null;

  const primaryService = provider.service_categories?.[0] || provider.services_offered?.[0] || "Service Provider";

  return (
    <div className={`${theme.card.base} ${theme.card.padding} ${theme.card.hover}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 text-lg mb-1">
            {provider.business_name || "Professional"}
          </h3>
          <p className="text-sm text-slate-600 mb-2 capitalize">
            {primaryService}
          </p>
        </div>
        <div className="flex flex-col gap-2 items-end">
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

      <div className="space-y-2 text-sm text-slate-600 mb-4">
        {provider.phone && (
          <div className="flex items-center gap-2">
            <Phone size={14} />
            <span>{provider.phone}</span>
            {provider.phone_verified && (
              <CheckCircle className="text-green-600" size={14} />
            )}
          </div>
        )}
        {provider.base_rate && (
          <div className="flex items-center gap-2">
            <TrendingUp size={14} />
            <span>${(provider.base_rate / 100).toFixed(0)}/hr base rate</span>
          </div>
        )}
        {provider.verification_status && (
          <div className="flex items-center gap-2">
            <Shield size={14} className={provider.verification_status === 'verified' ? 'text-green-600' : 'text-slate-400'} />
            <span className="capitalize">{provider.verification_status}</span>
          </div>
        )}
        {provider.service_categories && provider.service_categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {provider.service_categories.slice(0, 3).map((cat, i) => (
              <span key={i} className="text-xs bg-slate-100 px-2 py-1 rounded capitalize">
                {cat}
              </span>
            ))}
            {provider.service_categories.length > 3 && (
              <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                +{provider.service_categories.length - 3} more
              </span>
            )}
          </div>
        )}
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          <span>
            Connected {new Date(connection.connected_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {connection.notes && (
        <p className="text-sm text-slate-600 mb-4 p-3 bg-slate-50 rounded-lg italic">
          "{connection.notes}"
        </p>
      )}

      <div className="flex gap-2">
        <button className="flex-1 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg font-semibold hover:bg-purple-100 transition text-sm">
          View Profile
        </button>
        <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition text-sm">
          Message
        </button>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
  };

  return (
    <div className={`${colors[color]} border rounded-xl p-5`}>
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
function TabButton({ active, onClick, icon, label }) {
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
      </span>
      {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>}
    </button>
  );
}