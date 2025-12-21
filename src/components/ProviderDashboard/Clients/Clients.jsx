//levlpro-mvp\src\components\ProviderDashboard\Clients\Clients.jsx
import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  TrendingUp,
  DollarSign,
  Calendar,
  Star,
} from "lucide-react";
import { theme } from "../../../styles/theme";
import { supabase } from "../../../lib/supabaseClient";
import useAuth from "../../../hooks/useAuth";
import ClientCard from "./components/ClientCard";
import ClientProfile from "./ClientProfile";
import ClientFilters from "./components/ClientFilters";
import ClientStats from "./components/ClientStats";
import ExportMenu from "./components/ExportMenu";
import EditClientModal from "./components/EditClientModal";
import { getClientStatus, calculateCLV } from "./utils/clientCalculations";
import { exportToCSV } from "./utils/clientExport";

export default function Clients() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    status: "all", // all, active, dormant, lost
    tags: [],
    minSpent: 0,
    sortBy: "recent", // recent, spent, name, jobs
  });

  useEffect(() => {
    fetchClientsAndJobs();
  }, [user]);

  const fetchClientsAndJobs = async () => {
    if (!user) return;

    // Fetch all customers
    const { data: customersData } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    // Fetch all jobs for this provider
    const { data: jobsData } = await supabase
      .from("jobs")
      .select("*")
      .eq("provider_id", user.id)
      .order("created_at", { ascending: false });

    if (customersData) setClients(customersData);
    if (jobsData) setJobs(jobsData);
    setLoading(false);
  };

  // Filter and sort clients
  const filteredClients = clients
    .filter(client => {
      // Search filter
      const matchesSearch =
        client.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone?.includes(searchQuery);

      if (!matchesSearch) return false;

      // Get client jobs
      const clientJobs = jobs.filter(j => j.customer_id === client.id);

      // Status filter
      if (filters.status !== "all") {
        const status = getClientStatus(clientJobs).status.toLowerCase();
        if (status !== filters.status) return false;
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const clientTags = client.tags || [];
        const hasTag = filters.tags.some(tag => clientTags.includes(tag));
        if (!hasTag) return false;
      }

      // Min spent filter
      const totalSpent = clientJobs
        .filter(j => j.status === "completed")
        .reduce((sum, j) => sum + (j.total || 0), 0);
      if (totalSpent < filters.minSpent) return false;

      return true;
    })
    .sort((a, b) => {
      const aJobs = jobs.filter(j => j.customer_id === a.id);
      const bJobs = jobs.filter(j => j.customer_id === b.id);

      switch (filters.sortBy) {
        case "spent":
          const aSpent = aJobs.reduce((sum, j) => sum + (j.total || 0), 0);
          const bSpent = bJobs.reduce((sum, j) => sum + (j.total || 0), 0);
          return bSpent - aSpent;
        case "name":
          return (a.full_name || "").localeCompare(b.full_name || "");
        case "jobs":
          return bJobs.length - aJobs.length;
        case "recent":
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={theme.text.body}>Loading clients...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className={theme.text.h1}>Clients</h1>
          <p className={`${theme.text.body} mt-1`}>
            Manage your customer relationships and history
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className={`${theme.button.secondary} flex items-center gap-2`}
          >
            <Download size={18} />
            Export
          </button>
          <button
            onClick={() => setShowEditModal(true)}
            className={`${theme.button.provider} flex items-center gap-2`}
          >
            <Plus size={18} />
            Add Client
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <ClientStats clients={clients} jobs={jobs} />

      {/* Search & Filters */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <div className="flex flex-col md:flex-row gap-4">
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
              className={`${theme.input.base} ${theme.input.provider} pl-10`}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`${theme.button.secondary} flex items-center gap-2`}
          >
            <Filter size={18} />
            Filters
          </button>
        </div>

        {showFilters && (
          <ClientFilters
            filters={filters}
            setFilters={setFilters}
            clients={clients}
            jobs={jobs}
          />
        )}
      </div>

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <div className={`${theme.card.base} ${theme.card.padding} text-center py-12`}>
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-slate-400" size={32} />
          </div>
          <p className={`${theme.text.h4} mb-2`}>
            {searchQuery || showFilters ? "No Clients Match Filters" : "No Clients Yet"}
          </p>
          <p className={theme.text.body}>
            {searchQuery || showFilters
              ? "Try adjusting your search or filters"
              : "Clients will appear here as you complete jobs"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => {
            const clientJobs = jobs.filter(j => j.customer_id === client.id);
            return (
              <ClientCard
                key={client.id}
                client={client}
                jobs={clientJobs}
                onClick={() => setSelectedClient(client)}
              />
            );
          })}
        </div>
      )}

      {/* Client Profile Modal */}
      {selectedClient && (
        <ClientProfile
          client={selectedClient}
          jobs={jobs.filter(j => j.customer_id === selectedClient.id)}
          onClose={() => setSelectedClient(null)}
          onRefresh={fetchClientsAndJobs}
        />
      )}

      {/* Edit Client Modal */}
      {showEditModal && (
        <EditClientModal
          client={null}
          onClose={() => setShowEditModal(false)}
          onSuccess={fetchClientsAndJobs}
        />
      )}

      {/* Export Menu */}
      {showExportMenu && (
        <ExportMenu
          clients={filteredClients}
          jobs={jobs}
          onClose={() => setShowExportMenu(false)}
        />
      )}
    </div>
  );
}