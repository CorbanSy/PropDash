// src/components/ProviderDashboard/Clients.jsx
import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Calendar,
  Star,
  TrendingUp,
  CheckCircle2,
  Clock,
  MessageSquare,
  ExternalLink,
  UserPlus,
  Filter,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import useAuth from "../../hooks/useAuth";

export default function Clients() {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent"); // 'recent', 'name', 'value', 'jobs'
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch clients from jobs
  useEffect(() => {
    async function fetchClients() {
      if (!user) return;

      const { data: jobsData } = await supabase
        .from("jobs")
        .select("*")
        .eq("provider_id", user.id)
        .order("created_at", { ascending: false });

      if (jobsData) {
        // Group jobs by client
        const clientMap = {};

        jobsData.forEach((job) => {
          const clientKey = job.client_email || job.client_phone || job.client_name;
          
          if (!clientMap[clientKey]) {
            clientMap[clientKey] = {
              name: job.client_name,
              email: job.client_email,
              phone: job.client_phone,
              address: job.client_address,
              jobs: [],
              totalSpent: 0,
              completedJobs: 0,
              lastJobDate: job.created_at,
            };
          }

          clientMap[clientKey].jobs.push(job);
          if (job.status === "completed") {
            clientMap[clientKey].totalSpent += job.price || 0;
            clientMap[clientKey].completedJobs += 1;
          }
          
          // Update last job date
          if (new Date(job.created_at) > new Date(clientMap[clientKey].lastJobDate)) {
            clientMap[clientKey].lastJobDate = job.created_at;
          }
        });

        const clientsArray = Object.values(clientMap);
        setClients(clientsArray);
        setFilteredClients(clientsArray);
      }

      setLoading(false);
    }
    fetchClients();
  }, [user]);

  // Filter and sort
  useEffect(() => {
    let filtered = clients;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (client) =>
          client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.phone?.includes(searchQuery)
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "value":
          return b.totalSpent - a.totalSpent;
        case "jobs":
          return b.jobs.length - a.jobs.length;
        case "recent":
        default:
          return new Date(b.lastJobDate) - new Date(a.lastJobDate);
      }
    });

    setFilteredClients(filtered);
  }, [searchQuery, sortBy, clients]);

  const totalClients = clients.length;
  const repeatClients = clients.filter((c) => c.jobs.length > 1).length;
  const totalRevenue = clients.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgJobValue = totalRevenue / clients.reduce((sum, c) => sum + c.completedJobs, 0) || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading clients...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Clients</h1>
          <p className="text-slate-600 mt-1">
            Manage your customer relationships
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="text-blue-600" />}
          label="Total Clients"
          value={totalClients}
          color="blue"
        />
        <StatCard
          icon={<TrendingUp className="text-green-600" />}
          label="Repeat Clients"
          value={repeatClients}
          color="green"
        />
        <StatCard
          icon={<DollarSign className="text-purple-600" />}
          label="Total Revenue"
          value={`$${(totalRevenue / 100).toFixed(0)}`}
          color="purple"
        />
        <StatCard
          icon={<CheckCircle2 className="text-orange-600" />}
          label="Avg Job Value"
          value={`$${(avgJobValue / 100).toFixed(0)}`}
          color="orange"
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="recent">Most Recent</option>
              <option value="name">Name (A-Z)</option>
              <option value="value">Highest Value</option>
              <option value="jobs">Most Jobs</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients List */}
      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-slate-400" size={32} />
          </div>
          <p className="text-slate-900 font-semibold mb-2">
            {searchQuery ? "No clients found" : "No clients yet"}
          </p>
          <p className="text-slate-600 text-sm">
            {searchQuery
              ? "Try adjusting your search"
              : "Clients will appear here once you complete jobs"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client, index) => (
            <ClientCard
              key={index}
              client={client}
              onClick={() => setSelectedClient(client)}
            />
          ))}
        </div>
      )}

      {/* Client Detail Modal */}
      {selectedClient && (
        <ClientDetailModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, color }) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    purple: "bg-purple-50 border-purple-200",
    orange: "bg-orange-50 border-orange-200",
  };

  return (
    <div className={`${colorClasses[color]} border rounded-xl p-5`}>
      <div className="flex items-center justify-between mb-3">
        <div className="bg-white p-2 rounded-lg shadow-sm">{icon}</div>
      </div>
      <p className="text-sm font-medium text-slate-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

// Client Card Component
function ClientCard({ client, onClick }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition cursor-pointer"
    >
      {/* Client Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
          <Users className="text-blue-600" size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 mb-1 truncate">
            {client.name || "Unnamed Client"}
          </h3>
          <p className="text-xs text-slate-600 flex items-center gap-1 mb-1">
            <Calendar size={12} />
            Last job: {formatDate(client.lastJobDate)}
          </p>
          {client.jobs.length > 1 && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              Repeat Customer
            </span>
          )}
        </div>
      </div>

      {/* Client Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-slate-200">
        <div>
          <p className="text-xs text-slate-600 mb-1">Total Jobs</p>
          <p className="text-lg font-bold text-slate-900">{client.jobs.length}</p>
        </div>
        <div>
          <p className="text-xs text-slate-600 mb-1">Total Spent</p>
          <p className="text-lg font-bold text-green-600">
            ${(client.totalSpent / 100).toFixed(0)}
          </p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 text-xs">
        {client.phone && (
          <p className="text-slate-600 flex items-center gap-2 truncate">
            <Phone size={12} />
            {client.phone}
          </p>
        )}
        {client.email && (
          <p className="text-slate-600 flex items-center gap-2 truncate">
            <Mail size={12} />
            {client.email}
          </p>
        )}
      </div>
    </div>
  );
}

// Client Detail Modal
function ClientDetailModal({ client, onClose }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "confirmed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-4 rounded-xl">
              <Users className="text-blue-600" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">
                {client.name || "Unnamed Client"}
              </h2>
              <div className="space-y-1">
                {client.email && (
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <Mail size={14} />
                    {client.email}
                  </p>
                )}
                {client.phone && (
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <Phone size={14} />
                    {client.phone}
                  </p>
                )}
                {client.address && (
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <MapPin size={14} />
                    {client.address}
                  </p>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Stats */}
        <div className="p-6 border-b border-slate-200">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900 mb-1">
                {client.jobs.length}
              </p>
              <p className="text-xs text-slate-600">Total Jobs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 mb-1">
                ${(client.totalSpent / 100).toFixed(0)}
              </p>
              <p className="text-xs text-slate-600">Total Spent</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900 mb-1">
                {client.completedJobs}
              </p>
              <p className="text-xs text-slate-600">Completed</p>
            </div>
          </div>
        </div>

        {/* Job History */}
        <div className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar size={18} />
            Job History
          </h3>
          <div className="space-y-3">
            {client.jobs.map((job) => (
              <div
                key={job.id}
                className="bg-slate-50 rounded-lg p-4 border border-slate-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-1">
                      {job.service_name || "Service"}
                    </h4>
                    <p className="text-xs text-slate-600">
                      {formatDate(job.scheduled_date || job.created_at)}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold border ${getStatusColor(
                      job.status
                    )}`}
                  >
                    {job.status.toUpperCase()}
                  </span>
                </div>
                {job.price && (
                  <p className="text-sm font-semibold text-slate-900">
                    ${(job.price / 100).toFixed(0)}
                  </p>
                )}
                {job.notes && (
                  <p className="text-xs text-slate-600 mt-2">{job.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// X icon component
function X({ size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}