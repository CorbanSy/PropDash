// src/components/CustomerDashboard/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Star,
  TrendingUp,
  Wrench,
  Calendar,
  DollarSign,
  ArrowRight,
  MapPin,
  MessageSquare,
  FileText,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import useAuth from "../../hooks/useAuth";

export default function CustomerHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      // Get customer info
      const { data: customerData } = await supabase
        .from("customers")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (customerData) setCustomer(customerData);

      // Get customer jobs
      const { data: jobsData } = await supabase
        .from("jobs")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      // Get providers for jobs
      if (jobsData && jobsData.length > 0) {
        const providerIds = [...new Set(jobsData.map(j => j.provider_id).filter(Boolean))];
        
        if (providerIds.length > 0) {
          const { data: providersData } = await supabase
            .from("providers")
            .select("id, business_name")
            .in("id", providerIds);

          // Map provider names to jobs
          const jobsWithProviders = jobsData.map(job => ({
            ...job,
            provider_name: providersData?.find(p => p.id === job.provider_id)?.business_name || null
          }));

          setJobs(jobsWithProviders);
        } else {
          setJobs(jobsData);
        }
      }

      // Get quotes for customer
      const { data: quotesData } = await supabase
        .from("quotes")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      if (quotesData) setQuotes(quotesData);

      setLoading(false);
    }
    fetchData();
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const activeJobs = jobs.filter(
    (j) => j.status === "pending" || j.status === "confirmed"
  );
  const completedJobs = jobs.filter((j) => j.status === "completed");
  const pendingQuotes = quotes.filter(q => q.status === "pending");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {getGreeting()}, {customer?.full_name?.split(" ")[0] || "there"}! 👋
          </h1>
          <p className="text-slate-600 mt-1">
            Ready to get your home projects done?
          </p>
        </div>
        <button
          onClick={() => navigate("/customer/jobs?post=true")}
          className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition shadow-lg shadow-green-500/30"
        >
          <Plus size={18} />
          Post a Job
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Clock className="text-orange-600" />}
          label="Active Jobs"
          value={activeJobs.length}
          color="orange"
        />
        <StatCard
          icon={<CheckCircle2 className="text-green-600" />}
          label="Completed"
          value={completedJobs.length}
          color="green"
        />
        <StatCard
          icon={<FileText className="text-purple-600" />}
          label="Pending Quotes"
          value={pendingQuotes.length}
          color="purple"
        />
        <StatCard
          icon={<Calendar className="text-blue-600" />}
          label="Total Jobs"
          value={jobs.length}
          color="blue"
        />
      </div>

      {/* Pending Quotes Alert */}
      {pendingQuotes.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="bg-amber-100 p-2 rounded-lg">
              <AlertCircle className="text-amber-700" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 mb-1">
                You have {pendingQuotes.length} quote{pendingQuotes.length !== 1 ? 's' : ''} waiting for your review
              </h3>
              <p className="text-sm text-amber-700 mb-3">
                Review and accept quotes to schedule your services
              </p>
              <button
                onClick={() => navigate("/customer/jobs")}
                className="text-sm bg-amber-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-700 transition"
              >
                Review Quotes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Post Job Card */}
        <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg w-fit mb-4">
              <Plus size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Need Help?</h3>
            <p className="text-green-100 mb-4 text-sm">
              Post a job and get quotes from verified pros in your area
            </p>
            <button
              onClick={() => navigate("/customer/jobs?post=true")}
              className="bg-white text-green-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-green-50 transition flex items-center gap-2"
            >
              Post a Job
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Browse Pros Card */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg w-fit mb-4">
              <Search size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Browse Pros</h3>
            <p className="text-blue-100 mb-4 text-sm">
              Search our directory of trusted service professionals
            </p>
            <button
              onClick={() => navigate("/customer/browse")}
              className="bg-white text-blue-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center gap-2"
            >
              Browse Now
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Jobs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Recent Jobs</h2>
          <button
            onClick={() => navigate("/customer/jobs")}
            className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
          >
            View All
            <ArrowRight size={14} />
          </button>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wrench className="text-slate-400" size={32} />
            </div>
            <p className="text-slate-900 font-semibold mb-2">
              No jobs posted yet
            </p>
            <p className="text-slate-600 text-sm mb-6">
              Post your first job to get started
            </p>
            <button
              onClick={() => navigate("/customer/jobs?post=true")}
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Post a Job
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.slice(0, 5).map((job) => (
              <JobCard key={job.id} job={job} navigate={navigate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, color }) {
  const colorClasses = {
    orange: "bg-orange-50 border-orange-200",
    green: "bg-green-50 border-green-200",
    blue: "bg-blue-50 border-blue-200",
    purple: "bg-purple-50 border-purple-200",
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

// Job Card Component
function JobCard({ job, navigate }) {
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

  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div 
      className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer"
      onClick={() => navigate("/customer/jobs")}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 text-lg mb-1">
            {job.service_name || "Service Request"}
          </h3>
          {job.provider_name && (
            <p className="text-sm text-slate-600 mb-2">
              Provider: {job.provider_name}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            {job.scheduled_date && (
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {formatDate(job.scheduled_date)}
              </span>
            )}
            {job.price && (
              <span className="flex items-center gap-1.5">
                <DollarSign size={14} />
                ${(job.price / 100).toFixed(2)}
              </span>
            )}
            {job.address && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                {job.address}
              </span>
            )}
          </div>
        </div>
        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold border whitespace-nowrap ${getStatusColor(
            job.status
          )}`}
        >
          {job.status?.toUpperCase()}
        </span>
      </div>
      {job.notes && (
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{job.notes}</p>
      )}
      <div className="flex items-center gap-2">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            navigate("/customer/jobs");
          }}
          className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
        >
          View Details
          <ArrowRight size={14} />
        </button>
        {job.provider_id && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("/customer/messages", { 
                state: { providerId: job.provider_id, jobId: job.id } 
              });
            }}
            className="ml-auto p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
          >
            <MessageSquare size={16} className="text-slate-600" />
          </button>
        )}
      </div>
    </div>
  );
}