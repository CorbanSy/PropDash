//levlpro-mvp\src\components\CustomerDashboard\MyJobs\MyJobs.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Filter, Calendar, Plus } from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import useAuth from "../../../hooks/useAuth";
import PostJobModal from "./components/PostJobModal/PostJobModal";
import StatBox from "./components/StatBox";
import DetailedJobCard from "./components/DetailedJobCard";

export default function MyJobs() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // Check for ?post=true query parameter on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('post') === 'true') {
      setShowPostJobModal(true);
      // Remove the query parameter from URL after opening modal
      navigate('/customer/jobs', { replace: true });
    }
  }, [location.search, navigate]);

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
      .select(`
        *,
        providers!jobs_provider_id_fkey(business_name, base_rate)
      `)
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching jobs:", error);
    }

    if (data) {
      console.log("📋 Fetched jobs:", data);
      setJobs(data);
      setFilteredJobs(data);
    }
    setLoading(false);
  }

  // Handle delete job
  const handleDeleteJob = async (jobId) => {
    try {
      console.log("🗑️ Attempting to delete job:", jobId);
      
      const { data, error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", jobId)
        .eq("customer_id", user.id)
        .select();

      console.log("Delete response:", { data, error });

      if (error) {
        console.error("Delete error:", error);
        alert(`Failed to delete job: ${error.message}`);
        return;
      }

      if (!data || data.length === 0) {
        alert("Job could not be deleted. It may have already been accepted by a provider.");
        return;
      }

      // Remove from local state
      setJobs(jobs.filter((job) => job.id !== jobId));
      setFilteredJobs(filteredJobs.filter((job) => job.id !== jobId));
      
      console.log("✅ Job deleted successfully");
    } catch (error) {
      console.error("Exception deleting job:", error);
      alert("Failed to delete job. Please try again.");
    }
  };

  // Handle edit job
  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowPostJobModal(true);
  };

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
    (j) => j.status === "pending_dispatch" || 
          j.status === "dispatching" || 
          j.status === "accepted" || 
          j.status === "en_route" || 
          j.status === "in_progress"
  );
  const completedJobs = filteredJobs.filter((j) => j.status === "completed");
  const cancelledJobs = filteredJobs.filter((j) => j.status === "cancelled" || j.status === "unassigned");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-secondary-700">Loading jobs...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-secondary-700">Please log in to view your jobs</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Post Job Button */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">My Jobs</h1>
          <p className="text-secondary-600 mt-1">Track and manage your service requests</p>
        </div>
        <button
          onClick={() => {
            setEditingJob(null);
            setShowPostJobModal(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg shadow-primary-500/20 hover:scale-105"
        >
          <Plus size={20} />
          Post a Job
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBox label="All Jobs" value={jobs.length} color="primary" />
        <StatBox label="Active" value={activeJobs.length} color="warning" />
        <StatBox label="Completed" value={completedJobs.length} color="success" />
        <StatBox label="Cancelled" value={cancelledJobs.length} color="error" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border-2 border-secondary-200 shadow-card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search jobs or providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-300"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={18} className="text-secondary-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border-2 border-secondary-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-300"
            >
              <option value="all">All Status</option>
              <option value="pending_dispatch">Pending Dispatch</option>
              <option value="dispatching">Dispatching</option>
              <option value="accepted">Accepted</option>
              <option value="en_route">En Route</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="unassigned">Unassigned</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-secondary-200 shadow-card p-12 text-center">
          <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="text-secondary-400" size={32} />
          </div>
          <p className="text-secondary-900 font-semibold mb-2">No jobs found</p>
          <p className="text-secondary-600 text-sm mb-4">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Post your first job to get started"}
          </p>
          {!searchQuery && statusFilter === "all" && (
            <button
              onClick={() => {
                setEditingJob(null);
                setShowPostJobModal(true);
              }}
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-primary-700 transition-all duration-300 shadow-lg shadow-primary-500/20"
            >
              <Plus size={18} />
              Post Your First Job
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <DetailedJobCard
              key={job.id}
              job={job}
              onEdit={handleEditJob}
              onDelete={handleDeleteJob}
            />
          ))}
        </div>
      )}

      {/* Post Job Modal */}
      {showPostJobModal && (
        <PostJobModal
          onClose={() => {
            setShowPostJobModal(false);
            setEditingJob(null);
          }}
          onSuccess={() => {
            setShowPostJobModal(false);
            setEditingJob(null);
            fetchJobs();
          }}
          userId={user.id}
          editingJob={editingJob}
        />
      )}
    </div>
  );
}