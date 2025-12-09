// src/components/CustomerDashboard/MyJobs/MyJobs.jsx
import { useState, useEffect } from "react";
import { Search, Filter, Calendar, Plus } from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import useAuth from "../../../hooks/useAuth";
import PostJobModal from "./components/PostJobModal";
import StatBox from "./components/StatBox";
import DetailedJobCard from "./components/DetailedJobCard";

export default function MyJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPostJobModal, setShowPostJobModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchJobs();
    } else {
      setLoading(false);
    }
  }, [user]);

  async function fetchJobs() {
    if (!user) return;

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

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Please log in to view your jobs</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Post Job Button */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Jobs</h1>
          <p className="text-slate-600 mt-1">Track and manage your service requests</p>
        </div>
        <button
          onClick={() => setShowPostJobModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-emerald-700 transition shadow-lg shadow-teal-500/30"
        >
          <Plus size={20} />
          Post a Job
        </button>
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
          <p className="text-slate-600 text-sm mb-4">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Post your first job to get started"}
          </p>
          {!searchQuery && statusFilter === "all" && (
            <button
              onClick={() => setShowPostJobModal(true)}
              className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
            >
              <Plus size={18} />
              Post Your First Job
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <DetailedJobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {/* Post Job Modal */}
      {showPostJobModal && (
        <PostJobModal
          onClose={() => setShowPostJobModal(false)}
          onSuccess={() => {
            setShowPostJobModal(false);
            fetchJobs();
          }}
          userId={user.id}
        />
      )}
    </div>
  );
}