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
  const [jobs, setJobs] = useState([]);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [jobsTab, setJobsTab] = useState("assigned");

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
    const { data: assignedJobsData } = await supabase
      .from("jobs")
      .select("*")
      .eq("provider_id", user.id)
      .order("scheduled_date", { ascending: false });

    console.log("✅ User ID:", user.id);

    const { data: providerData } = await supabase
      .from("providers")
      .select("service_categories")
      .eq("id", user.id)
      .single();

    console.log("✅ Provider Data:", providerData);
    console.log("✅ Service Categories:", providerData?.service_categories);

    let availableJobsQuery = supabase
      .from("jobs")
      .select("*")
      .in("status", ["pending_dispatch", "dispatching", "unassigned"])
      .is("provider_id", null);

    if (providerData?.service_categories?.length > 0) {
      availableJobsQuery = availableJobsQuery.in(
        "category",
        providerData.service_categories
      );
      console.log("✅ Filtering by categories:", providerData.service_categories);
    }

    const { data: availableJobsData, error: availableJobsError } = await availableJobsQuery.order(
      "created_at",
      { ascending: false }
    );

    console.log("✅ Available Jobs Query Error:", availableJobsError);
    console.log("✅ Available Jobs Data:", availableJobsData);
    console.log("✅ Number of available jobs:", availableJobsData?.length);

    const { data: customersData } = await supabase
      .from("customers")
      .select("*");

    if (assignedJobsData) setJobs(assignedJobsData);
    if (availableJobsData) setAvailableJobs(availableJobsData);
    if (customersData) setCustomers(customersData);
  } catch (error) {
    console.error("❌ Error fetching jobs:", error);
  } finally {
    setLoading(false);
  }
};

  const filterJobsList = (jobsList) => {
    return jobsList
      .filter((job) => {
        const matchesSearch =
          job.service_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.notes?.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (
          jobsTab === "assigned" &&
          filters.status !== "all" &&
          job.status !== filters.status
        )
          return false;

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
        <div className="text-secondary-700">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">Jobs & Bookings</h1>
          <p className="text-secondary-700 mt-1 leading-relaxed">
            Manage your scheduled work and find new opportunities
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowExport(true)}
            className="border-2 border-secondary-400 text-secondary-700 px-4 py-2 rounded-lg font-semibold hover:bg-secondary-50 active:bg-secondary-100 transition-all inline-flex items-center gap-2"
          >
            <Download size={18} />
            Export
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-primary-700 active:bg-primary-800 transition-all shadow-sm hover:shadow-md inline-flex items-center gap-2"
          >
            <Plus size={18} />
            New Job
          </button>
        </div>
      </div>

      {/* Stats Overview - Only for assigned jobs */}
      {jobsTab === "assigned" && <JobStats jobs={jobs} />}

      {/* Jobs Tab Toggle */}
      <div className="flex gap-2 border-b border-secondary-200">
        <button
          onClick={() => setJobsTab("assigned")}
          className={`px-6 py-3 font-semibold transition-all duration-200 relative ${
            jobsTab === "assigned"
              ? "text-primary-700"
              : "text-secondary-600 hover:text-secondary-900"
          }`}
        >
          My Jobs ({jobs.length})
          {jobsTab === "assigned" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-700"></div>
          )}
        </button>
        <button
          onClick={() => setJobsTab("available")}
          className={`px-6 py-3 font-semibold transition-all duration-200 relative ${
            jobsTab === "available"
              ? "text-primary-700"
              : "text-secondary-600 hover:text-secondary-900"
          }`}
        >
          Available Jobs ({availableJobs.length})
          {jobsTab === "available" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-700"></div>
          )}
        </button>
      </div>

      {/* Search & View Toggle */}
      <div className="bg-white rounded-xl border-2 border-secondary-200 shadow-card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* View Mode Toggle - Only for assigned jobs */}
          {jobsTab === "assigned" && (
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-primary-600 text-white"
                    : "bg-secondary-100 text-secondary-600 hover:bg-secondary-200"
                }`}
              >
                <List size={18} className="inline mr-2" />
                List
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  viewMode === "calendar"
                    ? "bg-primary-600 text-white"
                    : "bg-secondary-100 text-secondary-600 hover:bg-secondary-200"
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
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
              size={18}
            />
            <input
              type="text"
              placeholder={`Search ${jobsTab === "assigned" ? "your" : "available"} jobs...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="border-2 border-secondary-400 text-secondary-700 px-4 py-2 rounded-lg font-semibold hover:bg-secondary-50 active:bg-secondary-100 transition-all inline-flex items-center gap-2"
          >
            <Filter size={18} />
            Filters
          </button>
        </div>

        {showFilters && <JobFilters filters={filters} setFilters={setFilters} jobs={jobs} />}
      </div>

      {/* Jobs Display */}
      {jobsTab === "assigned" ? (
        viewMode === "list" ? (
          filteredJobs.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-secondary-200 shadow-card p-6 text-center py-12">
              <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="text-secondary-400" size={32} />
              </div>
              <p className="text-lg font-semibold text-secondary-900 mb-2">
                {searchQuery || showFilters ? "No Jobs Match Filters" : "No Assigned Jobs Yet"}
              </p>
              <p className="text-secondary-600">
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
            customers={customers}
          />
        )
      ) : (
        filteredAvailableJobs.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-secondary-200 shadow-card p-6 text-center py-12">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-primary-600" size={32} />
            </div>
            <p className="text-lg font-semibold text-secondary-900 mb-2">No Available Jobs</p>
            <p className="text-secondary-600">
              {searchQuery
                ? "No jobs match your search"
                : "No new jobs matching your services. Check back later!"}
            </p>
          </div>
        ) : (
          <div>
            <div className="bg-primary-50 border-2 border-primary-300 rounded-xl p-4 mb-4 shadow-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-primary-700 flex-shrink-0" size={20} />
                <div className="text-sm text-primary-900">
                  <p className="font-semibold mb-1">
                    💼 {filteredAvailableJobs.length} job
                    {filteredAvailableJobs.length !== 1 ? "s" : ""} available matching your services
                  </p>
                  <p className="text-primary-700">
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
                    await fetchJobsAndCustomers();
                    setJobsTab("assigned");
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