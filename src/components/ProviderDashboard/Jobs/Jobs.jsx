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
  AlertCircle,
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
import AvailableJobCard from "./components/AvailableJobCard";
import { getJobsByStatus } from "./utils/jobCalculations";

export default function Jobs() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]); // Assigned jobs
  const [availableJobs, setAvailableJobs] = useState([]); // Available jobs
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // list or calendar
  const [jobsTab, setJobsTab] = useState("assigned"); // assigned or available

  // Filters
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    minAmount: 0,
    sortBy: "date_desc",
  });

  useEffect(() => {
    fetchJobsAndCustomers();
  }, [user]);

  const fetchJobsAndCustomers = async () => {
    if (!user) return;

    try {
      // Fetch assigned jobs
      const { data: assignedJobsData } = await supabase
        .from("jobs")
        .select("*")
        .eq("provider_id", user.id)
        .order("scheduled_date", { ascending: false });

      // Fetch provider's service categories
      const { data: providerData } = await supabase
        .from("providers")
        .select("service_categories")
        .eq("id", user.id)
        .single();

      // Fetch available jobs matching provider's services
      let availableJobsQuery = supabase
        .from("jobs")
        .select("*")
        .in("status", ["pending_dispatch", "dispatching", "unassigned"])
        .is("provider_id", null);

      // Filter by service categories if provider has them
      if (providerData?.service_categories?.length > 0) {
        availableJobsQuery = availableJobsQuery.in(
          "category",
          providerData.service_categories
        );
      }

      const { data: availableJobsData } = await availableJobsQuery.order(
        "created_at",
        { ascending: false }
      );

      // Fetch customers
      const { data: customersData } = await supabase
        .from("customers")
        .select("*");

      if (assignedJobsData) setJobs(assignedJobsData);
      if (availableJobsData) setAvailableJobs(availableJobsData);
      if (customersData) setCustomers(customersData);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter jobs (works for both assigned and available)
  const filterJobsList = (jobsList) => {
    return jobsList
      .filter((job) => {
        // Search filter
        const matchesSearch =
          job.service_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.notes?.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        // Status filter (only for assigned jobs)
        if (
          jobsTab === "assigned" &&
          filters.status !== "all" &&
          job.status !== filters.status
        )
          return false;

        // Date range filter
        if (filters.dateRange !== "all" && job.scheduled_date) {
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
        if ((job.price || 0) < filters.minAmount) return false;

        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case "date_asc":
            return new Date(a.scheduled_date || a.created_at) - new Date(b.scheduled_date || b.created_at);
          case "date_desc":
            return new Date(b.scheduled_date || b.created_at) - new Date(a.scheduled_date || a.created_at);
          case "amount_asc":
            return (a.price || 0) - (b.price || 0);
          case "amount_desc":
            return (b.price || 0) - (a.price || 0);
          default:
            return new Date(b.created_at) - new Date(a.created_at);
        }
      });
  };

  const filteredJobs = filterJobsList(jobs);
  const filteredAvailableJobs = filterJobsList(availableJobs);

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
            Manage your scheduled work and find new opportunities
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

      {/* Stats Overview - Only for assigned jobs */}
      {jobsTab === "assigned" && <JobStats jobs={jobs} />}

      {/* Jobs Tab Toggle */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setJobsTab("assigned")}
          className={`px-6 py-3 font-semibold transition relative ${
            jobsTab === "assigned"
              ? "text-blue-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          My Jobs ({jobs.length})
          {jobsTab === "assigned" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
          )}
        </button>
        <button
          onClick={() => setJobsTab("available")}
          className={`px-6 py-3 font-semibold transition relative ${
            jobsTab === "available"
              ? "text-blue-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Available Jobs ({availableJobs.length})
          {jobsTab === "available" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
          )}
        </button>
      </div>

      {/* Search & View Toggle */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* View Mode Toggle - Only for assigned jobs */}
          {jobsTab === "assigned" && (
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
          )}

          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder={`Search ${jobsTab === "assigned" ? "your" : "available"} jobs...`}
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

        {showFilters && <JobFilters filters={filters} setFilters={setFilters} jobs={jobs} />}
      </div>

      {/* Jobs Display */}
      {jobsTab === "assigned" ? (
        // Assigned Jobs View
        viewMode === "list" ? (
          filteredJobs.length === 0 ? (
            <div className={`${theme.card.base} ${theme.card.padding} text-center py-12`}>
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="text-slate-400" size={32} />
              </div>
              <p className={`${theme.text.h4} mb-2`}>
                {searchQuery || showFilters ? "No Jobs Match Filters" : "No Assigned Jobs Yet"}
              </p>
              <p className={theme.text.body}>
                {searchQuery || showFilters
                  ? "Try adjusting your search or filters"
                  : "Check the Available Jobs tab for new opportunities"}
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
          <JobCalendarView 
            jobs={filteredJobs} 
            onJobClick={setSelectedJob}
            customers={customers}  // ✅ Add this
          />
        )
      ) : (
        // Available Jobs View
        filteredAvailableJobs.length === 0 ? (
          <div className={`${theme.card.base} ${theme.card.padding} text-center py-12`}>
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-blue-600" size={32} />
            </div>
            <p className={`${theme.text.h4} mb-2`}>No Available Jobs</p>
            <p className={theme.text.body}>
              {searchQuery
                ? "No jobs match your search"
                : "No new jobs matching your services. Check back later!"}
            </p>
          </div>
        ) : (
          <div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">
                    💼 {filteredAvailableJobs.length} job
                    {filteredAvailableJobs.length !== 1 ? "s" : ""} available matching your services
                  </p>
                  <p className="text-blue-700">
                    These jobs are currently being dispatched to qualified providers. Accept quickly to secure the work!
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredAvailableJobs.map((job) => (
                <AvailableJobCard
                  key={job.id}
                  job={job}
                  customers={customers}
                  onAccept={async () => {
                    await fetchJobsAndCustomers(); // Refresh data
                    setJobsTab("assigned"); // ✅ Auto-switch to My Jobs tab
                  }}
                />
              ))}
            </div>
          </div>
        )
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
        <JobExport jobs={filteredJobs} onClose={() => setShowExport(false)} />
      )}
    </div>
  );
}