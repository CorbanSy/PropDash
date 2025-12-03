// src/components/ProviderDashboard/Schedule.jsx
import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Plus,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit2,
  Trash2,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import useAuth from "../../hooks/useAuth";

export default function Schedule() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("calendar"); // 'calendar' or 'availability'
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch jobs
  useEffect(() => {
    async function fetchJobs() {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("provider_id", user.id)
        .order("scheduled_date", { ascending: true });

      if (data) {
        setJobs(data);
        setFilteredJobs(data);
      }
      setLoading(false);
    }
    if (user) fetchJobs();
  }, [user]);

  // Filter jobs
  useEffect(() => {
    let filtered = jobs;

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.service_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [statusFilter, searchQuery, jobs]);

  const getJobsForDate = (date) => {
    return jobs.filter((job) => {
      const jobDate = new Date(job.scheduled_date);
      return (
        jobDate.toDateString() === date.toDateString() &&
        job.status !== "cancelled"
      );
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

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
        return <AlertCircle size={14} />;
      case "completed":
        return <CheckCircle2 size={14} />;
      case "cancelled":
        return <XCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  const upcomingJobs = filteredJobs.filter(
    (job) =>
      new Date(job.scheduled_date) > new Date() && job.status !== "cancelled"
  );
  const pastJobs = filteredJobs.filter(
    (job) =>
      new Date(job.scheduled_date) <= new Date() || job.status === "cancelled"
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading schedule...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Schedule</h1>
          <p className="text-slate-600 mt-1">
            Manage your bookings and availability
          </p>
        </div>
        <button className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-lg shadow-blue-500/30">
          <Plus size={18} />
          Add Booking
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("calendar")}
          className={`px-4 py-2.5 font-medium transition relative ${
            activeTab === "calendar"
              ? "text-blue-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <span className="flex items-center gap-2">
            <Calendar size={18} />
            Calendar View
          </span>
          {activeTab === "calendar" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("availability")}
          className={`px-4 py-2.5 font-medium transition relative ${
            activeTab === "availability"
              ? "text-blue-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <span className="flex items-center gap-2">
            <Clock size={18} />
            Availability
          </span>
          {activeTab === "availability" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
          )}
        </button>
      </div>

      {activeTab === "calendar" ? (
        <>
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox
              label="Total Bookings"
              value={jobs.length}
              color="blue"
            />
            <StatBox
              label="Upcoming"
              value={upcomingJobs.length}
              color="green"
            />
            <StatBox
              label="Completed"
              value={jobs.filter((j) => j.status === "completed").length}
              color="purple"
            />
            <StatBox
              label="This Week"
              value={
                jobs.filter((j) => {
                  const jobDate = new Date(j.scheduled_date);
                  const now = new Date();
                  const weekFromNow = new Date(
                    now.getTime() + 7 * 24 * 60 * 60 * 1000
                  );
                  return jobDate >= now && jobDate <= weekFromNow;
                }).length
              }
              color="orange"
            />
          </div>

          {/* Filters */}
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
                  placeholder="Search by client or service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-slate-600" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

          {/* Upcoming Bookings */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Upcoming Bookings ({upcomingJobs.length})
            </h2>
            {upcomingJobs.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="text-slate-400" size={32} />
                </div>
                <p className="text-slate-900 font-semibold mb-2">
                  No upcoming bookings
                </p>
                <p className="text-slate-600 text-sm">
                  Your schedule is clear. Share your booking link to get booked!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>

          {/* Past Bookings */}
          {pastJobs.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Past Bookings ({pastJobs.length})
              </h2>
              <div className="space-y-3">
                {pastJobs.slice(0, 5).map((job) => (
                  <JobCard key={job.id} job={job} isPast />
                ))}
              </div>
              {pastJobs.length > 5 && (
                <button className="w-full mt-4 py-2 text-blue-600 font-medium hover:text-blue-700 transition">
                  View All Past Bookings ({pastJobs.length})
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        <AvailabilitySettings />
      )}
    </div>
  );
}

// Job Card Component
function JobCard({ job, isPast = false }) {
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
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition ${
        isPast ? "opacity-75" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 text-lg mb-1">
            {job.service_name || "Service"}
          </h3>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formatDate(job.scheduled_date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {formatTime(job.scheduled_date)}
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xl font-bold text-slate-900 mb-2">
            ${(job.price / 100).toFixed(0)}
          </p>
          <span
            className={`text-xs px-3 py-1 rounded-full font-semibold border ${getStatusColor(
              job.status
            )}`}
          >
            {job.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Client Info */}
      <div className="border-t border-slate-200 pt-4 space-y-2">
        <p className="text-sm font-medium text-slate-700">Client Details</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-slate-600">
          {job.client_name && (
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              <span>{job.client_name}</span>
            </div>
          )}
          {job.client_phone && (
            <div className="flex items-center gap-2">
              <Phone size={14} />
              <span>{job.client_phone}</span>
            </div>
          )}
          {job.client_email && (
            <div className="flex items-center gap-2">
              <Mail size={14} />
              <span>{job.client_email}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {!isPast && (
        <div className="border-t border-slate-200 pt-4 mt-4 flex gap-2">
          <button className="flex-1 py-2 px-4 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition flex items-center justify-center gap-2">
            <Edit2 size={16} />
            Edit
          </button>
          <button className="flex-1 py-2 px-4 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition flex items-center justify-center gap-2">
            <XCircle size={16} />
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

// Stat Box Component
function StatBox({ label, value, color }) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
    orange: "bg-orange-50 border-orange-200 text-orange-600",
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

// Availability Settings Component
function AvailabilitySettings() {
  const [availability, setAvailability] = useState([
    { day: "Monday", start: "09:00", end: "17:00", enabled: true },
    { day: "Tuesday", start: "09:00", end: "17:00", enabled: true },
    { day: "Wednesday", start: "09:00", end: "17:00", enabled: true },
    { day: "Thursday", start: "09:00", end: "17:00", enabled: true },
    { day: "Friday", start: "09:00", end: "17:00", enabled: true },
    { day: "Saturday", start: "10:00", end: "15:00", enabled: false },
    { day: "Sunday", start: "10:00", end: "15:00", enabled: false },
  ]);

  const toggleDay = (index) => {
    const updated = [...availability];
    updated[index].enabled = !updated[index].enabled;
    setAvailability(updated);
  };

  const updateTime = (index, field, value) => {
    const updated = [...availability];
    updated[index][field] = value;
    setAvailability(updated);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
        <div>
          <p className="font-semibold text-blue-900 text-sm mb-1">
            Set Your Weekly Availability
          </p>
          <p className="text-xs text-blue-700">
            These hours will be shown to clients when they try to book through
            your booking link.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-6">
          Weekly Schedule
        </h3>
        <div className="space-y-4">
          {availability.map((day, index) => (
            <div
              key={day.day}
              className="flex items-center gap-4 pb-4 border-b border-slate-200 last:border-0"
            >
              <div className="w-32">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={day.enabled}
                    onChange={() => toggleDay(index)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span
                    className={`font-medium ${
                      day.enabled ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    {day.day}
                  </span>
                </label>
              </div>

              {day.enabled ? (
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="time"
                    value={day.start}
                    onChange={(e) =>
                      updateTime(index, "start", e.target.value)
                    }
                    className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <span className="text-slate-600">to</span>
                  <input
                    type="time"
                    value={day.end}
                    onChange={(e) => updateTime(index, "end", e.target.value)}
                    className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              ) : (
                <span className="text-slate-400 text-sm flex-1">
                  Unavailable
                </span>
              )}
            </div>
          ))}
        </div>

        <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Save Availability
        </button>
      </div>
    </div>
  );
}