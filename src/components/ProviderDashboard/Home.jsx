// src/components/ProviderDashboard/Home.jsx
import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  MapPin,
  Phone,
  MessageSquare,
  ExternalLink,
  Plus,
  Ban,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Sparkles,
  Users,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import useAuth from "../../hooks/useAuth";
import { theme } from "../../styles/theme";

export default function Home() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Fetch jobs
      const { data: jobsData } = await supabase
        .from("jobs")
        .select("*")
        .eq("provider_id", user.id)
        .order("scheduled_date", { ascending: true });

      // Fetch quotes
      const { data: quotesData } = await supabase
        .from("quotes")
        .select("*")
        .eq("provider_id", user.id)
        .order("created_at", { ascending: false });

      if (jobsData) setJobs(jobsData);
      if (quotesData) setQuotes(quotesData);
      setLoading(false);
    }
    if (user) fetchData();
  }, [user]);

  // Calculate today's data
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todaysJobs = jobs.filter((j) => {
    const jobDate = new Date(j.scheduled_date);
    jobDate.setHours(0, 0, 0, 0);
    return jobDate.getTime() === today.getTime() && j.status !== "cancelled";
  });

  const nextAppointment = jobs.find(
    (j) => new Date(j.scheduled_date) > new Date() && j.status !== "cancelled"
  );

  const todaysEarnings = todaysJobs
    .filter((j) => j.status === "completed")
    .reduce((sum, j) => sum + (j.price || 0), 0);

  // Calculate this week's data
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const thisWeeksJobs = jobs.filter((j) => {
    const jobDate = new Date(j.scheduled_date);
    return jobDate >= startOfWeek && jobDate < endOfWeek;
  });

  const thisWeeksEarnings = thisWeeksJobs
    .filter((j) => j.status === "completed")
    .reduce((sum, j) => sum + (j.price || 0), 0);

  // Upcoming jobs (next 7 days)
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  const upcomingJobs = jobs.filter(
    (j) =>
      new Date(j.scheduled_date) > new Date() &&
      new Date(j.scheduled_date) <= sevenDaysFromNow &&
      j.status !== "cancelled"
  );

  // Quote stats
  const pendingQuotes = quotes.filter((q) => q.status === "pending").length;
  const draftQuotes = quotes.filter((q) => q.status === "draft").length;
  const approvedQuotes = quotes.filter((q) => q.status === "approved").length;

  // Recent activity
  const recentActivity = [
    ...jobs.slice(0, 3).map((j) => ({
      type: "booking",
      message: `New booking: ${j.service_name}`,
      time: j.created_at,
      icon: Calendar,
      color: "blue",
    })),
    ...quotes.slice(0, 2).map((q) => ({
      type: "quote",
      message: `Quote ${q.status}: ${q.service_name || "Service"}`,
      time: q.created_at,
      icon: FileText,
      color: "purple",
    })),
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={theme.text.body}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 sm:pb-6">
      {/* ==================== HERO: TODAY AT A GLANCE ==================== */}
      <div className={`${theme.gradient.providerLight} rounded-2xl p-8 text-white`}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user.user_metadata?.full_name?.split(" ")[0] || "Pro"}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Today's Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <TodayMetric
            label="Jobs Today"
            value={todaysJobs.length}
            icon={<Calendar size={20} />}
          />
          <TodayMetric
            label="Today's Earnings"
            value={`$${(todaysEarnings / 100).toFixed(0)}`}
            icon={<DollarSign size={20} />}
          />
          <TodayMetric
            label="Pending Quotes"
            value={pendingQuotes}
            icon={<FileText size={20} />}
          />
          <TodayMetric
            label="This Week"
            value={thisWeeksJobs.length}
            icon={<TrendingUp size={20} />}
          />
        </div>

        {/* Next Appointment Highlight */}
        {nextAppointment && (
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-blue-100 text-sm font-medium mb-2">Next Appointment</p>
                <h3 className="text-xl font-bold mb-3">{nextAppointment.service_name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-blue-200" />
                    <span>
                      {new Date(nextAppointment.scheduled_date).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-blue-200" />
                    <span>{nextAppointment.client_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-200" />
                    <span>{nextAppointment.address || "Address TBD"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-blue-200" />
                    <span>${(nextAppointment.price / 100).toFixed(0)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
                  <Phone size={18} />
                </button>
                <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
                  <MessageSquare size={18} />
                </button>
                <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
                  <MapPin size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================== QUICK ACTIONS ==================== */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <h2 className={`${theme.text.h3} mb-4`}>Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <QuickActionButton
            to="/provider/quotes"
            icon={<FileText size={20} />}
            label="Create Quote"
            color="blue"
          />
          <QuickActionButton
            to="/provider/schedule"
            icon={<Plus size={20} />}
            label="Add Booking"
            color="emerald"
          />
          <QuickActionButton
            to="/provider/clients"
            icon={<MessageSquare size={20} />}
            label="Message Client"
            color="purple"
          />
          <QuickActionButton
            to="/provider/schedule"
            icon={<Ban size={20} />}
            label="Block Day"
            color="red"
          />
          <QuickActionButton
            to="/provider"
            icon={<ExternalLink size={20} />}
            label="Share Link"
            color="indigo"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ==================== UPCOMING JOBS ==================== */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`${theme.card.base} ${theme.card.padding}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={theme.text.h3}>Upcoming Jobs (Next 7 Days)</h2>
              <Link
                to="/provider/schedule"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All
                <ChevronRight size={16} />
              </Link>
            </div>

            {upcomingJobs.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="text-slate-400" size={32} />
                </div>
                <p className={theme.text.h4}>No Upcoming Jobs</p>
                <p className={`${theme.text.body} mt-2`}>
                  Share your booking link to get more bookings!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingJobs.slice(0, 5).map((job) => (
                  <UpcomingJobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>

          {/* ==================== SMART RECOMMENDATIONS ==================== */}
          <SmartRecommendations jobs={jobs} quotes={quotes} />
        </div>

        {/* ==================== SIDEBAR ==================== */}
        <div className="space-y-6">
          {/* Weekly Stats */}
          <div className={`${theme.card.base} ${theme.card.padding}`}>
            <h3 className={`${theme.text.h4} mb-4`}>This Week</h3>
            <div className="space-y-3">
              <WeeklyStat label="Bookings" value={thisWeeksJobs.length} icon={<Calendar size={16} />} />
              <WeeklyStat
                label="Earnings"
                value={`$${(thisWeeksEarnings / 100).toFixed(0)}`}
                icon={<DollarSign size={16} />}
              />
              <WeeklyStat
                label="Completed"
                value={thisWeeksJobs.filter((j) => j.status === "completed").length}
                icon={<CheckCircle2 size={16} />}
              />
              <WeeklyStat
                label="Pending"
                value={thisWeeksJobs.filter((j) => j.status === "pending").length}
                icon={<Clock size={16} />}
              />
            </div>
          </div>

          {/* Quote Pipeline */}
          <div className={`${theme.card.base} ${theme.card.padding}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={theme.text.h4}>Quote Pipeline</h3>
              <Link
                to="/provider/quotes"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View All
              </Link>
            </div>
            <div className="space-y-2">
              <QuotePipelineItem label="Draft" count={draftQuotes} color="slate" />
              <QuotePipelineItem label="Sent" count={pendingQuotes} color="amber" />
              <QuotePipelineItem label="Approved" count={approvedQuotes} color="emerald" />
            </div>
          </div>

          {/* Mini Calendar Preview */}
          <MiniCalendar jobs={jobs} />

          {/* Recent Activity */}
          <div className={`${theme.card.base} ${theme.card.padding}`}>
            <h3 className={`${theme.text.h4} mb-4`}>Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.length === 0 ? (
                <p className={`${theme.text.body} text-center py-4`}>No recent activity</p>
              ) : (
                recentActivity.map((activity, i) => (
                  <ActivityItem key={i} activity={activity} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== SUB-COMPONENTS ====================

function TodayMetric({ label, value, icon }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
      <div className="flex items-center gap-2 mb-2 text-blue-100">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function QuickActionButton({ to, icon, label, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200",
    emerald: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200",
    purple: "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200",
    red: "bg-red-50 text-red-700 hover:bg-red-100 border-red-200",
    indigo: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200",
  };

  return (
    <Link
      to={to}
      className={`${colors[color]} border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition font-medium text-sm`}
    >
      {icon}
      <span className="text-center">{label}</span>
    </Link>
  );
}

function UpcomingJobCard({ job }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return theme.badge.success;
      case "pending":
        return theme.badge.warning;
      case "completed":
        return theme.badge.info;
      default:
        return theme.badge.neutral;
    }
  };

  return (
    <div className={`${theme.card.base} ${theme.card.padding} ${theme.card.hover}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-slate-900">{job.service_name}</h4>
            <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getStatusBadge(job.status)}`}>
              {job.status}
            </span>
          </div>
          <div className="space-y-1 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>
                {new Date(job.scheduled_date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span>•</span>
              <Clock size={14} />
              <span>
                {new Date(job.scheduled_date).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={14} />
              <span>{job.client_name}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-slate-900">${(job.price / 100).toFixed(0)}</p>
          <div className="flex gap-1 mt-2">
            <button className="p-1.5 bg-slate-100 rounded hover:bg-slate-200 transition">
              <Phone size={14} className="text-slate-600" />
            </button>
            <button className="p-1.5 bg-slate-100 rounded hover:bg-slate-200 transition">
              <MessageSquare size={14} className="text-slate-600" />
            </button>
            <button className="p-1.5 bg-slate-100 rounded hover:bg-slate-200 transition">
              <MapPin size={14} className="text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SmartRecommendations({ jobs, quotes }) {
  const recommendations = [];

  // Check for empty slots
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);

  const tomorrowJobs = jobs.filter((j) => {
    const jobDate = new Date(j.scheduled_date);
    return jobDate >= tomorrow && jobDate < tomorrowEnd && j.status !== "cancelled";
  });

  if (tomorrowJobs.length === 0) {
    recommendations.push({
      icon: <Calendar size={20} />,
      color: "blue",
      message: "You have no bookings tomorrow",
      action: "Share your booking link to fill your schedule",
      link: "/provider",
    });
  }

  // Check for pending quotes
  const pendingQuotes = quotes.filter((q) => q.status === "pending");
  if (pendingQuotes.length > 0) {
    recommendations.push({
      icon: <FileText size={20} />,
      color: "amber",
      message: `${pendingQuotes.length} quotes awaiting response`,
      action: "Follow up with clients",
      link: "/provider/quotes",
    });
  }

  // Check for draft quotes
  const draftQuotes = quotes.filter((q) => q.status === "draft");
  if (draftQuotes.length > 0) {
    recommendations.push({
      icon: <Sparkles size={20} />,
      color: "purple",
      message: `${draftQuotes.length} draft quotes ready to send`,
      action: "Complete and send quotes",
      link: "/provider/quotes",
    });
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className={`${theme.card.base} ${theme.card.padding}`}>
      <div className="flex items-center gap-2 mb-4">
        <Zap className="text-amber-500" size={20} />
        <h3 className={theme.text.h3}>Smart Recommendations</h3>
      </div>
      <div className="space-y-3">
        {recommendations.map((rec, i) => (
          <Link
            key={i}
            to={rec.link}
            className={`block p-4 rounded-lg border-2 transition hover:shadow-md ${
              rec.color === "blue"
                ? "bg-blue-50 border-blue-200 hover:border-blue-300"
                : rec.color === "amber"
                ? "bg-amber-50 border-amber-200 hover:border-amber-300"
                : "bg-purple-50 border-purple-200 hover:border-purple-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg ${
                  rec.color === "blue"
                    ? "bg-blue-100 text-blue-700"
                    : rec.color === "amber"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {rec.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900 mb-1">{rec.message}</p>
                <p className="text-sm text-slate-600 flex items-center gap-1">
                  {rec.action}
                  <ArrowRight size={14} />
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function WeeklyStat({ label, value, icon }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-slate-600">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-lg font-bold text-slate-900">{value}</span>
    </div>
  );
}

function QuotePipelineItem({ label, count, color }) {
  const colors = {
    slate: "bg-slate-100 text-slate-700",
    amber: "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span className={`${colors[color]} px-3 py-1 rounded-full text-sm font-bold`}>{count}</span>
    </div>
  );
}

function MiniCalendar({ jobs }) {
  const today = new Date();
  const next5Days = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  const getJobsForDate = (date) => {
    return jobs.filter((j) => {
      const jobDate = new Date(j.scheduled_date);
      return (
        jobDate.toDateString() === date.toDateString() && j.status !== "cancelled"
      );
    });
  };

  return (
    <div className={`${theme.card.base} ${theme.card.padding}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={theme.text.h4}>This Week</h3>
        <Link to="/provider/schedule" className="text-sm font-medium text-blue-600 hover:text-blue-700">
          Full Calendar
        </Link>
      </div>
      <div className="space-y-2">
        {next5Days.map((date, i) => {
          const jobsOnDate = getJobsForDate(date);
          const isToday = date.toDateString() === today.toDateString();

          return (
            <div
              key={i}
              className={`p-3 rounded-lg border-2 ${
                isToday
                  ? "bg-blue-50 border-blue-300"
                  : jobsOnDate.length > 0
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm font-semibold ${
                      isToday ? "text-blue-900" : "text-slate-900"
                    }`}
                  >
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </p>
                  <p className="text-xs text-slate-600">
                    {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
                <div
                  className={`text-lg font-bold ${
                    isToday
                      ? "text-blue-700"
                      : jobsOnDate.length > 0
                      ? "text-emerald-700"
                      : "text-slate-400"
                  }`}
                >
                  {jobsOnDate.length}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActivityItem({ activity }) {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    emerald: "bg-emerald-100 text-emerald-700",
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-lg ${colors[activity.color]}`}>
        <activity.icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">{activity.message}</p>
        <p className="text-xs text-slate-500">{timeAgo(activity.time)}</p>
      </div>
    </div>
  );
}