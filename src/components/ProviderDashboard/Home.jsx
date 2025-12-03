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
import { theme } from "../../styles/theme";

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
        <div className={theme.text.body}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className={theme.text.h1}>
            {getGreeting()}, {provider?.business_name?.split(' ')[0] || 'there'}!
          </h1>
          <p className={`${theme.text.body} mt-1`}>
            Here's your business overview for today.
          </p>
        </div>
        
        {/* Quick Action Button */}
        <button
          onClick={() => navigate("/provider/quotes")}
          className={`hidden sm:flex items-center gap-2 ${theme.button.provider}`}
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
          icon={<DollarSign className="text-emerald-600" />}
          label="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          subtitle="all time"
          color="green"
        />
        <StatCard
          icon={<CheckCircle2 className="text-slate-600" />}
          label="Completed"
          value={stats.completedJobs}
          subtitle="total jobs"
          color="slate"
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
            <div className={theme.alert.warning}>
              <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="font-semibold text-sm">
                  $1,000 Job Limit Active
                </p>
                <p className="text-xs mt-1">
                  Unlicensed providers cannot accept jobs over $1,000
                </p>
              </div>
            </div>
          )}

          {/* Verification Status */}
          {provider.verification_status === "pending" && (
            <div className={theme.alert.info}>
              <Sparkles className="flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="font-semibold text-sm">
                  Get Verified
                </p>
                <p className="text-xs mt-1">
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
        <div className={`${theme.gradient.providerLight} p-6 rounded-xl text-white shadow-lg`}>
          <div className="flex items-center gap-2 mb-3">
            <LinkIcon size={20} />
            <span className="font-bold">Your Booking Link</span>
          </div>
          <p className="text-sm text-slate-100 mb-4">
            Share this link with clients for instant appointment booking
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
        <div className={`${theme.gradient.accent} p-6 rounded-xl text-white shadow-lg`}>
          <div className="flex items-center gap-2 mb-3">
            <Wand2 size={20} />
            <span className="font-bold">AI Quote Builder</span>
          </div>
          <p className="text-sm text-slate-100 mb-4">
            Generate professional estimates with intelligent pricing
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
          <h2 className={theme.text.h2}>Upcoming Bookings</h2>
          <button
            onClick={() => navigate("/provider/schedule")}
            className="text-sm text-blue-700 hover:text-blue-800 font-semibold flex items-center gap-1"
          >
            View All
            <ExternalLink size={14} />
          </button>
        </div>

        {upcomingJobs.length === 0 ? (
          <div className={`${theme.card.base} ${theme.card.padding} text-center py-12`}>
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-slate-400" size={32} />
            </div>
            <p className={`${theme.text.h4} mb-2`}>
              No Upcoming Bookings
            </p>
            <p className={`${theme.text.body} mb-4`}>
              Share your booking link to start receiving client appointments
            </p>
            <button
              onClick={handleCopy}
              className={`${theme.button.provider} inline-flex`}
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
                className={`${theme.card.base} ${theme.card.padding} ${theme.card.hover} flex items-center justify-between`}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Clock className="text-blue-700" size={20} />
                  </div>
                  <div>
                    <h3 className={`${theme.text.h4} mb-1`}>
                      {job.service_name || "Service"}
                    </h3>
                    <p className={`${theme.text.body} text-sm mb-1`}>
                      {job.client_name}
                    </p>
                    <p className={`${theme.text.caption} flex items-center gap-1`}>
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
                    className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                      job.status === "confirmed"
                        ? theme.badge.success
                        : job.status === "pending"
                        ? theme.badge.warning
                        : theme.badge.neutral
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
          <TrendingUp className="text-emerald-600" size={20} />
          <h3 className={theme.text.h3}>Performance Metrics</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-slate-900">{stats.completedJobs}</p>
            <p className={theme.text.caption}>Jobs Completed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              ${provider?.base_rate || 85}
            </p>
            <p className={theme.text.caption}>Hourly Rate</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              ${stats.completedJobs > 0 
                ? (stats.totalRevenue / stats.completedJobs).toFixed(0)
                : 0}
            </p>
            <p className={theme.text.caption}>Avg Job Value</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">4.9★</p>
            <p className={theme.text.caption}>Rating (Coming Soon)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, subtitle, color }) {
  const colorClasses = {
    blue: theme.statCard.blue,
    green: theme.statCard.green,
    slate: theme.statCard.slate,
    orange: theme.statCard.orange,
  };

  return (
    <div className={`${colorClasses[color]} border rounded-xl p-5`}>
      <div className="flex items-center justify-between mb-3">
        <div className="bg-white p-2 rounded-lg shadow-sm">
          {icon}
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-700 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900 mb-1">{value}</p>
      <p className={theme.text.caption}>{subtitle}</p>
    </div>
  );
}