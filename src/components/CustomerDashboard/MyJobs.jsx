// src/components/CustomerDashboard/MyJobs.jsx
import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Star,
  MessageSquare,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import useAuth from "../../hooks/useAuth";

export default function MyJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      const { data, error } = await supabase
        .from("jobs")
        .select("*, providers(business_name, base_rate)")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setJobs(data);
        setFilteredJobs(data);
      }
      setLoading(false);
    }
    if (user) fetchJobs();
  }, [user]);

  useEffect(() => {
    let filtered = jobs;

    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.service_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.providers?.business_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [statusFilter, searchQuery, jobs]);

  const activeJobs = filteredJobs.filter(
    (j) => j.status === "pending" || j.status === "confirmed"
  );
  const completedJobs = filteredJobs.filter((j) => j.status === "completed");
  const cancelledJobs = filteredJobs.filter((j) => j.status === "cancelled");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Jobs</h1>
        <p className="text-slate-600 mt-1">Track and manage your service requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBox label="All Jobs" value={jobs.length} color="blue" />
        <StatBox label="Active" value={activeJobs.length} color="orange" />
        <StatBox label="Completed" value={completedJobs.length} color="green" />
        <StatBox label="Cancelled" value={cancelledJobs.length} color="red" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search jobs or providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="text-slate-400" size={32} />
          </div>
          <p className="text-slate-900 font-semibold mb-2">No jobs found</p>
          <p className="text-slate-600 text-sm">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Post your first job to get started"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <DetailedJobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

// Stat Box Component
function StatBox({ label, value, color }) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    orange: "bg-orange-50 border-orange-200 text-orange-600",
    green: "bg-green-50 border-green-200 text-green-600",
    red: "bg-red-50 border-red-200 text-red-600",
  };

  return (
    <div
      className={`${colorClasses[color]} border rounded-xl p-4 text-center`}
    >
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-sm font-medium opacity-80">{label}</p>
    </div>
  );
}

// Detailed Job Card Component
function DetailedJobCard({ job }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle2 size={14} />;
      case "pending":
        return <Clock size={14} />;
      case "completed":
        return <CheckCircle2 size={14} />;
      case "cancelled":
        return <XCircle size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 text-lg mb-2">
            {job.service_name || "Service Request"}
          </h3>
          {job.providers?.business_name && (
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
              <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                {job.providers.business_name}
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            {job.scheduled_date && (
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {formatDate(job.scheduled_date)}
              </span>
            )}
            {job.price && (
              <span className="flex items-center gap-1.5">
                <DollarSign size={14} />
                ${(job.price / 100).toFixed(0)}
              </span>
            )}
            {job.client_address && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                {job.client_address}
              </span>
            )}
          </div>
        </div>
        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold border flex items-center gap-1 ${getStatusColor(
            job.status
          )}`}
        >
          {getStatusIcon(job.status)}
          {job.status.toUpperCase()}
        </span>
      </div>

      {job.notes && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-slate-700">{job.notes}</p>
        </div>
      )}

      <div className="flex gap-2 pt-4 border-t border-slate-200">
        <button className="flex-1 py-2 px-4 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition flex items-center justify-center gap-2">
          <MessageSquare size={16} />
          Message
        </button>
        {job.status === "completed" && (
          <button className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center gap-2">
            <Star size={16} />
            Leave Review
          </button>
        )}
      </div>
    </div>
  );
}