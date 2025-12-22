//levlpro-mvp\src\components\CustomerDashboard\Home.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
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

      const { data: customerData } = await supabase
        .from("customers")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (customerData) setCustomer(customerData);

      const { data: jobsData } = await supabase
        .from("jobs")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      if (jobsData) setJobs(jobsData);

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

  const activeJobs = jobs.filter(
    (j) => j.status === "pending" || j.status === "confirmed"
  );
  const completedJobs = jobs.filter((j) => j.status === "completed");
  const pendingQuotes = quotes.filter((q) => q.status === "pending");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-secondary-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 sm:pb-6">

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">
            Welcome back, {customer?.full_name?.split(" ")[0] || "there"}! 👋
          </h1>
          <p className="text-secondary-600 mt-1">
            Ready to get your home projects done?
          </p>
        </div>

        <button
          onClick={() => navigate("/customer/jobs?post=true")}
          className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-success-600 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-success-700 hover:to-emerald-700 transition shadow-lg shadow-success-500/30"
        >
          <Plus size={18} />
          Post a Job
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Active Jobs" value={activeJobs.length} icon={<Clock />} />
        <StatCard label="Completed" value={completedJobs.length} icon={<CheckCircle2 />} />
        <StatCard label="Pending Quotes" value={pendingQuotes.length} icon={<FileText />} />
        <StatCard label="Total Jobs" value={jobs.length} icon={<Calendar />} />
      </div>

      {/* PENDING QUOTES ALERT */}
      {pendingQuotes.length > 0 && (
        <div className="bg-gradient-to-br from-warning-50 to-warning-100 border-2 border-warning-300 rounded-xl p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-warning-100 p-2 rounded-lg">
              <AlertCircle className="text-warning-700" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-warning-900 mb-1">
                You have {pendingQuotes.length} quote
                {pendingQuotes.length !== 1 ? "s" : ""} waiting
              </h3>
              <p className="text-sm text-warning-700 mb-3">
                Review and approve quotes to schedule service
              </p>
              <button
                onClick={() => navigate("/customer/jobs")}
                className="bg-warning-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-warning-700 transition"
              >
                Review Quotes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ActionCard
          icon={<Plus size={24} />}
          title="Post a Job"
          description="Get quotes from verified providers in your area"
          gradient="from-primary-700 via-primary-800 to-primary-900"
          buttonText="Post a Job"
          onClick={() => navigate("/customer/jobs?post=true")}
        />

        <ActionCard
          icon={<Search size={24} />}
          title="Browse Providers"
          description="Find trusted professionals for your needs"
          gradient="from-secondary-700 via-secondary-800 to-secondary-900"
          buttonText="Browse Providers"
          onClick={() => navigate("/customer/browse")}
        />
      </div>

      {/* RECENT JOBS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-secondary-900">
            Recent Jobs
          </h2>
          <button
            onClick={() => navigate("/customer/jobs")}
            className="text-sm font-semibold text-primary-700 hover:text-primary-800 flex items-center gap-1 hover:underline"
          >
            View All
            <ArrowRight size={14} />
          </button>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-secondary-200 shadow-card p-12 text-center">
            <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wrench className="text-secondary-400" size={32} />
            </div>
            <p className="text-secondary-900 font-semibold mb-2">
              No jobs yet
            </p>
            <p className="text-secondary-600 text-sm mb-6">
              Post your first job to get started
            </p>
            <button
              onClick={() => navigate("/customer/jobs?post=true")}
              className="bg-gradient-to-r from-success-600 to-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-success-700 hover:to-emerald-700 transition shadow-lg shadow-success-500/30"
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

/* ---------------- SUB COMPONENTS ---------------- */

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white border-2 border-secondary-200 rounded-xl p-5 shadow-card">
      <div className="bg-secondary-100 p-2 rounded-lg w-fit mb-3 text-secondary-600">
        {icon}
      </div>
      <p className="text-sm font-medium text-secondary-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-secondary-900">{value}</p>
    </div>
  );
}

function ActionCard({ icon, title, description, gradient, buttonText, onClick }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} p-6 rounded-2xl text-white shadow-xl relative overflow-hidden`}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl" />
      </div>
      <div className="relative z-10">
        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg w-fit mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-white/80 mb-4 text-sm">{description}</p>
        <button
          onClick={onClick}
          className="bg-white text-secondary-900 px-6 py-2.5 rounded-xl font-semibold hover:bg-white/90 transition flex items-center gap-2"
        >
          {buttonText}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function JobCard({ job, navigate }) {
  return (
    <div
      className="bg-white rounded-xl border-2 border-secondary-200 shadow-card hover:shadow-card-hover hover:border-secondary-300 transition cursor-pointer p-5"
      onClick={() => navigate("/customer/jobs")}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-secondary-900">
          {job.service_name || "Service Request"}
        </h3>
        <span className="text-xs px-3 py-1 rounded-full font-semibold border bg-secondary-100 text-secondary-800 border-secondary-300">
          {job.status}
        </span>
      </div>

      <div className="text-sm text-secondary-600 space-y-1">
        {job.scheduled_date && (
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            {new Date(job.scheduled_date).toLocaleString()}
          </div>
        )}
        {job.price && (
          <div className="flex items-center gap-2">
            <DollarSign size={14} />
            ${(job.price / 100).toFixed(2)}
          </div>
        )}
        {job.address && (
          <div className="flex items-center gap-2">
            <MapPin size={14} />
            {job.address}
          </div>
        )}
      </div>

      {job.provider_id && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate("/customer/messages", {
              state: { providerId: job.provider_id, jobId: job.id },
            });
          }}
          className="mt-3 p-2 bg-secondary-100 rounded-lg hover:bg-secondary-200 transition"
        >
          <MessageSquare size={16} className="text-secondary-600" />
        </button>
      )}
    </div>
  );
}
