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
} from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import useAuth from "../../../hooks/useAuth";
import { theme } from "../../../styles/theme";

export default function Network() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("clients");
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [clients, setClients] = useState([]);
  const [professionals, setProfessionals] = useState([]);

  useEffect(() => {
    if (user) {
      fetchNetworkData();
    }
  }, [user]);

  const fetchNetworkData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch client connections
      const { data: clientsData, error: clientsError } = await supabase
        .from("professional_client_connections")
        .select(`
          *,
          customer:customers (
            id,
            full_name,
            phone,
            address,
            city,
            state,
            zip_code
          )
        `)
        .eq("provider_id", user.id)
        .order("connected_at", { ascending: false });

      if (clientsError) {
        console.error("Error fetching clients:", clientsError);
      } else if (clientsData) {
        console.log("Clients data:", clientsData);
        setClients(clientsData);
      }

      // Fetch professional network - using actual columns that exist
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
    } catch (err) {
      console.error("Exception fetching network data:", err);
    } finally {
      setLoading(false);
    }
  };

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
            Manage your client relationships and professional connections
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
          label="Total Clients"
          value={clients.length}
          color="blue"
        />
        <StatCard
          icon={<Briefcase size={20} />}
          label="Total Jobs"
          value={clients.reduce((sum, c) => sum + (c.total_jobs_together || 0), 0)}
          color="emerald"
        />
        <StatCard
          icon={<Award size={20} />}
          label="Professional Partners"
          value={professionals.length}
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
            Build lasting relationships with clients and connect with other professionals for referrals and collaborations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl font-bold mb-2">Client Network</div>
              <p className="text-sm text-blue-100">
                All clients are automatically added when you accept and complete jobs
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl font-bold mb-2">Pro Connections</div>
              <p className="text-sm text-blue-100">
                Connect with other professionals for referrals and collaborations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200">
        <TabButton
          active={activeTab === "clients"}
          onClick={() => setActiveTab("clients")}
          icon={<Users size={18} />}
          label={`Clients (${clients.length})`}
        />
        <TabButton
          active={activeTab === "professionals"}
          onClick={() => setActiveTab("professionals")}
          icon={<Award size={18} />}
          label={`Professionals (${professionals.length})`}
        />
      </div>

      {/* Tab Content */}
      {activeTab === "clients" && (
        <ClientsTab clients={clients} />
      )}
      {activeTab === "professionals" && (
        <ProfessionalsTab professionals={professionals} />
      )}
    </div>
  );
}

// Clients Tab
function ClientsTab({ clients }) {
  if (clients.length === 0) {
    return (
      <div className={`${theme.card.base} ${theme.card.padding} text-center py-12`}>
        <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="text-slate-400" size={32} />
        </div>
        <p className={`${theme.text.h4} mb-2`}>No Clients Yet</p>
        <p className={theme.text.body}>
          Clients are automatically added when you accept and complete jobs together
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {clients.map((connection) => (
        <ClientCard key={connection.id} connection={connection} />
      ))}
    </div>
  );
}

// Professionals Tab
function ProfessionalsTab({ professionals }) {
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

// Client Card Component
function ClientCard({ connection }) {
  const customer = connection.customer;
  if (!customer) return null;

  return (
    <div className={`${theme.card.base} ${theme.card.padding} ${theme.card.hover}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-lg mb-1">
            {customer.full_name || "Client"}
          </h3>
          <p className="text-sm text-slate-600 mb-2">
            {connection.total_jobs_together || 1} job{connection.total_jobs_together !== 1 ? 's' : ''} together
          </p>
        </div>
        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
          Client
        </div>
      </div>

      <div className="space-y-2 text-sm text-slate-600 mb-4">
        {customer.phone && (
          <div className="flex items-center gap-2">
            <Phone size={14} />
            <span>{customer.phone}</span>
          </div>
        )}
        {customer.city && (
          <div className="flex items-center gap-2">
            <MapPin size={14} />
            <span>{customer.city}{customer.state ? `, ${customer.state}` : ''} {customer.zip_code || ''}</span>
          </div>
        )}
        {customer.address && (
          <div className="flex items-center gap-2">
            <MapPin size={14} />
            <span className="text-xs">{customer.address}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          <span>
            Connected {new Date(connection.connected_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold hover:bg-blue-100 transition text-sm">
          View History
        </button>
        <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition text-sm">
          Message
        </button>
      </div>
    </div>
  );
}

// Professional Card Component
function ProfessionalCard({ connection }) {
  const provider = connection.connected_provider;
  if (!provider) return null;

  // Get primary service from service_categories or services_offered
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