// src/components/ProviderDashboard/Jobs/Jobs.jsx
import { useState, useEffect } from "react";
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  Calendar as CalendarIcon,
  List,
  Download,
  TrendingUp,
} from "lucide-react";
import { theme } from "../../../styles/theme";
import { supabase } from "../../../lib/supabaseClient";
import useAuth from "../../../hooks/useAuth";
import JobCard from "./components/JobCard";
import JobDetails from "./JobDetails";
import JobFilters from "./components/JobFilters";
import JobStats from "./components/JobStats";
import CreateJobModal from "./components/CreateJobModal";
import JobCalendarView from "./components/JobCalendarView";
import JobExport from "./components/JobExport";
import { getJobsByStatus } from "./utils/jobCalculations";

export default function Jobs() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // list or calendar

  // Filters
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all", // all, today, week, month
    minAmount: 0,
    sortBy: "date_desc", // date_desc, date_asc, amount_desc, amount_asc
  });

  useEffect(() => {
    fetchJobsAndCustomers();
  }, [user]);

  const fetchJobsAndCustomers = async () => {
    if (!user) return;

    // Fetch jobs
    const { data: jobsData } = await supabase
      .from("jobs")
      .select("*")
      .eq("provider_id", user.id)
      .order("scheduled_date", { ascending: false });

    // Fetch customers for quick reference
    const { data: customersData } = await supabase
      .from("customers")
      .select("*");

    if (jobsData) setJobs(jobsData);
    if (customersData) setCustomers(customersData);
    setLoading(false);
  };

  // Filter jobs
  const filteredJobs = jobs
    .filter(job => {
      // Search filter
      const matchesSearch =
        job.service_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Status filter
      if (filters.status !== "all" && job.status !== filters.status) return false;

      // Date range filter
      if (filters.dateRange !== "all") {
        const jobDate = new Date(job.scheduled_date);
        const now = new Date();
        
        if (filters.dateRange === "today") {
          if (jobDate.toDateString() !== now.toDateString()) return false;
        } else if (filters.dateRange === "week") {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (jobDate < weekAgo) return false;
        } else if (filters.dateRange === "month") {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (jobDate < monthAgo) return false;
        }
      }

      // Min amount filter
      if ((job.total || 0) < filters.minAmount) return false;

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "date_asc":
          return new Date(a.scheduled_date) - new Date(b.scheduled_date);
        case "date_desc":
          return new Date(b.scheduled_date) - new Date(a.scheduled_date);
        case "amount_asc":
          return (a.total || 0) - (b.total || 0);
        case "amount_desc":
          return (b.total || 0) - (a.total || 0);
        default:
          return new Date(b.scheduled_date) - new Date(a.scheduled_date);
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={theme.text.body}>Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className={theme.text.h1}>Jobs & Bookings</h1>
          <p className={`${theme.text.body} mt-1`}>
            Manage your scheduled and completed work
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowExport(true)}
            className={`${theme.button.secondary} flex items-center gap-2`}
          >
            <Download size={18} />
            Export
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className={`${theme.button.provider} flex items-center gap-2`}
          >
            <Plus size={18} />
            New Job
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <JobStats jobs={jobs} />

      {/* View Toggle & Search */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <List size={18} className="inline mr-2" />
              List
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                viewMode === "calendar"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <CalendarIcon size={18} className="inline mr-2" />
              Calendar
            </button>
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search jobs by service, client, or description..."
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
          <JobFilters
            filters={filters}
            setFilters={setFilters}
            jobs={jobs}
          />
        )}
      </div>

      {/* Jobs List or Calendar */}
      {viewMode === "list" ? (
        filteredJobs.length === 0 ? (
          <div className={`${theme.card.base} ${theme.card.padding} text-center py-12`}>
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="text-slate-400" size={32} />
            </div>
            <p className={`${theme.text.h4} mb-2`}>
              {searchQuery || showFilters ? "No Jobs Match Filters" : "No Jobs Yet"}
            </p>
            <p className={theme.text.body}>
              {searchQuery || showFilters
                ? "Try adjusting your search or filters"
                : "Create your first job to get started"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                customers={customers}
                onClick={() => setSelectedJob(job)}
              />
            ))}
          </div>
        )
      ) : (
        <JobCalendarView jobs={filteredJobs} onJobClick={setSelectedJob} />
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetails
          job={selectedJob}
          customers={customers}
          onClose={() => setSelectedJob(null)}
          onRefresh={fetchJobsAndCustomers}
        />
      )}

      {/* Create Job Modal */}
      {showCreateModal && (
        <CreateJobModal
          customers={customers}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchJobsAndCustomers();
          }}
        />
      )}

      {/* Export Modal */}
      {showExport && (
        <JobExport
          jobs={filteredJobs}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}