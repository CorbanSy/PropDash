// src/components/ProviderDashboard/Home.jsx
import { 
  Link as LinkIcon, 
  Wand2, 
  Clock, 
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Sparkles
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import useAuth from "../../hooks/useAuth";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [stats, setStats] = useState({
    thisWeek: 0,
    totalRevenue: 0,
    completedJobs: 0,
    pendingJobs: 0,
  });
  const [upcomingJobs, setUpcomingJobs] = useState([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch provider data and stats
  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;

      // Get provider info
      const { data: providerData } = await supabase
        .from("providers")
        .select("*")
        .eq("id", user.id)
        .single();

      setProvider(providerData);

      // Get jobs for stats
      const { data: jobsData } = await supabase
        .from("jobs")
        .select("*")
        .eq("provider_id", user.id)
        .order("scheduled_date", { ascending: true });

      if (jobsData) {
        // Calculate stats
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const thisWeekJobs = jobsData.filter(
          (job) => new Date(job.created_at) >= weekAgo
        );
        
        const completedJobs = jobsData.filter(
          (job) => job.status === "completed"
        );
        
        const totalRevenue = completedJobs.reduce(
          (sum, job) => sum + (job.price || 0),
          0
        );

        const pending = jobsData.filter(
          (job) => job.status === "pending" || job.status === "confirmed"
        );

        setStats({
          thisWeek: thisWeekJobs.length,
          totalRevenue: totalRevenue / 100, // Convert cents to dollars
          completedJobs: completedJobs.length,
          pendingJobs: pending.length,
        });

        // Set upcoming jobs (next 5)
        const upcoming = jobsData
          .filter((job) => 
            job.status !== "completed" && 
            job.status !== "cancelled" &&
            new Date(job.scheduled_date) > now
          )
          .slice(0, 5);

        setUpcomingJobs(upcoming);
      }

      setLoading(false);
    }

    fetchDashboardData();
  }, [user]);

  const handleCopy = () => {
    const bookingLink = `${window.location.origin}/book/${user.id}`;
    navigator.clipboard.writeText(bookingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = days[date.getDay()];
    const time = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    return `${day} ${time}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {getGreeting()}, {provider?.business_name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-slate-600 mt-1">
            Here's what's happening with your business today.
          </p>
        </div>
        
        {/* Quick Action Button */}
        <button
          onClick={() => navigate("/provider/quotes")}
          className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition shadow-lg shadow-purple-500/30"
        >
          <Wand2 size={18} />
          New Quote
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Calendar className="text-blue-600" />}
          label="This Week"
          value={stats.thisWeek}
          subtitle="new bookings"
          color="blue"
        />
        <StatCard
          icon={<DollarSign className="text-green-600" />}
          label="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          subtitle="all time"
          color="green"
        />
        <StatCard
          icon={<CheckCircle2 className="text-purple-600" />}
          label="Completed"
          value={stats.completedJobs}
          subtitle="total jobs"
          color="purple"
        />
        <StatCard
          icon={<Clock className="text-orange-600" />}
          label="Pending"
          value={stats.pendingJobs}
          subtitle="need attention"
          color="orange"
        />
      </div>

      {/* Status Alerts */}
      {provider && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Compliance Status */}
          {provider.license_type === "none" && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="font-semibold text-amber-900 text-sm">
                  $1,000 Job Limit Active
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Unlicensed providers cannot accept jobs over $1,000
                </p>
              </div>
            </div>
          )}

          {/* Verification Status */}
          {provider.verification_status === "pending" && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <Sparkles className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="font-semibold text-blue-900 text-sm">
                  Get Verified
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Upload your license to unlock higher job limits
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Booking Link Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <LinkIcon size={20} />
            <span className="font-bold">Your Booking Link</span>
          </div>
          <p className="text-sm opacity-90 mb-4">
            Share this link with clients to let them book appointments instantly
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={`${window.location.origin}/book/${user.id}`}
              readOnly
              className="flex-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 text-sm text-white placeholder-white/60"
            />
            <button
              onClick={handleCopy}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition flex items-center gap-2 font-medium"
            >
              {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* AI Quote Builder Card */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Wand2 size={20} />
            <span className="font-bold">AI Quote Builder</span>
          </div>
          <p className="text-sm opacity-90 mb-4">
            Turn photos into professional PDF estimates in seconds
          </p>
          <button
            onClick={() => navigate("/provider/quotes")}
            className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2.5 rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            Create New Quote
            <ExternalLink size={16} />
          </button>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Upcoming Bookings</h2>
          <button
            onClick={() => navigate("/provider/schedule")}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            View All
            <ExternalLink size={14} />
          </button>
        </div>

        {upcomingJobs.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-slate-400" size={32} />
            </div>
            <p className="text-slate-900 font-semibold mb-2">
              No upcoming bookings
            </p>
            <p className="text-slate-600 text-sm mb-4">
              Share your booking link to start getting booked by clients
            </p>
            <button
              onClick={handleCopy}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition inline-flex items-center gap-2"
            >
              <Copy size={16} />
              Copy Booking Link
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex items-center justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Clock className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {job.service_name || "Service"}
                    </h3>
                    <p className="text-sm text-slate-600 mb-1">
                      {job.client_name}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(job.scheduled_date)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-slate-900 mb-2">
                    ${(job.price / 100).toFixed(0)}
                  </p>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      job.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : job.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {job.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats Footer */}
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-green-600" size={20} />
          <h3 className="font-semibold text-slate-900">Performance</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-slate-900">{stats.completedJobs}</p>
            <p className="text-xs text-slate-600">Jobs Completed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              ${provider?.base_rate || 85}
            </p>
            <p className="text-xs text-slate-600">Hourly Rate</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {stats.completedJobs > 0 
                ? (stats.totalRevenue / stats.completedJobs).toFixed(0)
                : 0}
            </p>
            <p className="text-xs text-slate-600">Avg Job Value</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">4.9★</p>
            <p className="text-xs text-slate-600">Rating (Soon)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, subtitle, color }) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    purple: "bg-purple-50 border-purple-200",
    orange: "bg-orange-50 border-orange-200",
  };

  return (
    <div className={`${colorClasses[color]} border rounded-xl p-5`}>
      <div className="flex items-center justify-between mb-3">
        <div className="bg-white p-2 rounded-lg shadow-sm">
          {icon}
        </div>
      </div>
      <p className="text-sm font-medium text-slate-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900 mb-1">{value}</p>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}