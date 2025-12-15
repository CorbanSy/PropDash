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
  Plus,
  FileText,
  CheckCircle2,
  ChevronRight,
  Users,
  Power,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import useAuth from "../../hooks/useAuth";
import { theme } from "../../styles/theme";
import { useJobOfferListener } from "../../hooks/useJobOfferListener";
import JobOfferModal from "./JobOfferModal";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [togglingOnline, setTogglingOnline] = useState(false);
  
  const {
      currentOffer,
      isListening,
      acceptOffer,
      declineOffer,
      handleTimeout,
  } = useJobOfferListener(user?.id);

  useEffect(() => {
    console.log('🏠 Home component mounted');
    console.log('👤 User ID:', user?.id);
    console.log('📬 Current offer:', currentOffer);
    console.log('👂 Is listening:', isListening);
  }, [user?.id, currentOffer, isListening]);

  useEffect(() => {
    async function fetchProviderStatus() {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from("providers")
        .select("is_online, is_available")
        .eq("id", user.id)
        .single();
      
      if (data) {
        setIsOnline(data.is_online);
      }
    }
    
    fetchProviderStatus();
  }, [user?.id]);

  const toggleOnlineStatus = async () => {
    setTogglingOnline(true);
    
    try {
      const newStatus = !isOnline;
      
      const { error } = await supabase
        .from("providers")
        .update({ 
          is_online: newStatus,
          is_available: newStatus
        })
        .eq("id", user.id);
      
      if (error) throw error;
      
      setIsOnline(newStatus);
      
      if (newStatus) {
        try {
          console.log("🔍 Checking for pending jobs to dispatch...");
          
          const { data: pendingJobs, error: fetchError } = await supabase
            .from("jobs")
            .select("id, service_name, status")
            .in("status", ["pending_dispatch", "unassigned"])
            .order("created_at", { ascending: false });
          
          if (fetchError) throw fetchError;
          
          console.log("📋 Found pending jobs:", pendingJobs?.length || 0);
          
          if (pendingJobs && pendingJobs.length > 0) {
            let dispatchedCount = 0;
            
            for (const job of pendingJobs) {
              console.log(`🚀 Dispatching job ${job.id}...`);
              
              const { data: dispatchResult, error: dispatchError } = await supabase
                .rpc('dispatch_job_to_providers', { p_job_id: job.id });
              
              if (!dispatchError && dispatchResult && dispatchResult.length > 0) {
                const { total_providers_found } = dispatchResult[0];
                if (total_providers_found > 0) {
                  dispatchedCount++;
                  console.log(`✅ Job ${job.service_name} dispatched to ${total_providers_found} providers`);
                }
              }
            }
            
            if (dispatchedCount > 0) {
              alert(`✅ You're now ONLINE! We found ${dispatchedCount} pending job${dispatchedCount > 1 ? 's' : ''} and sent them your way!`);
            } else {
              alert("✅ You're now ONLINE and ready to receive job offers!");
            }
          } else {
            alert("✅ You're now ONLINE and ready to receive job offers!");
          }
        } catch (dispatchErr) {
          console.error("Error checking/dispatching pending jobs:", dispatchErr);
          alert("✅ You're now ONLINE and ready to receive job offers!");
        }
      } else {
        alert("⏸️ You're now OFFLINE. You won't receive new job offers.");
      }
    } catch (error) {
      console.error("Error toggling online status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setTogglingOnline(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const { data: jobsData } = await supabase
        .from("jobs")
        .select("*")
        .eq("provider_id", user.id)
        .order("scheduled_date", { ascending: true });

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-secondary-700">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 sm:pb-6">
      {/* ONLINE/OFFLINE TOGGLE - Corporate Style */}
      <div 
        className={`rounded-2xl p-6 border-2 shadow-lg transition-all duration-300 ${
          isOnline 
            ? "bg-gradient-to-br from-success-50 to-emerald-50 border-success-300" 
            : "bg-gradient-to-br from-secondary-50 to-slate-50 border-secondary-300"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl transition-all duration-300 ${
              isOnline ? "bg-success-100" : "bg-secondary-200"
            }`}>
              <Power size={24} className={isOnline ? "text-success-700" : "text-secondary-600"} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-bold text-secondary-900">
                  {isOnline ? "You're Online" : "You're Offline"}
                </h3>
                {isOnline && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold text-success-700 px-2 py-1 bg-success-100 rounded-full">
                      ACTIVE
                    </span>
                  </div>
                )}
              </div>
              <p className="text-sm text-secondary-600">
                {isOnline 
                  ? "Ready to receive job offers from customers in your area" 
                  : "Go online to start receiving job offers"}
              </p>
            </div>
          </div>
          
          <button
            onClick={toggleOnlineStatus}
            disabled={togglingOnline}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg flex items-center gap-2 ${
              isOnline
                ? "bg-secondary-600 hover:bg-secondary-700 text-white shadow-secondary-500/30"
                : "bg-gradient-to-r from-success-600 to-emerald-600 hover:from-success-700 hover:to-emerald-700 text-white shadow-success-500/30"
            } disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105`}
          >
            {togglingOnline ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </>
            ) : isOnline ? (
              <>
                <Power size={18} />
                Go Offline
              </>
            ) : (
              <>
                <Power size={18} />
                Go Online
              </>
            )}
          </button>
        </div>
      </div>

      {/* Listening Indicator - Corporate Style */}
      {isOnline && isListening && (
        <div className="bg-primary-50 border-2 border-primary-300 rounded-xl p-4 flex items-center gap-3 shadow-sm">
          <div className="w-3 h-3 bg-primary-600 rounded-full animate-pulse"></div>
          <div className="flex-1">
            <p className="text-sm text-primary-900 font-semibold">
              🔔 Listening for Job Offers
            </p>
            <p className="text-xs text-primary-700">
              You'll receive instant notifications when new jobs are available
            </p>
          </div>
        </div>
      )}

      {/* HERO: TODAY AT A GLANCE - Corporate Primary Gradient */}
      <div className="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user.user_metadata?.full_name?.split(" ")[0] || "Pro"}! 👋
            </h1>
            <p className="text-primary-100 text-lg">
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
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-primary-100 text-sm font-medium mb-2">Next Appointment</p>
                <h3 className="text-xl font-bold mb-3">{nextAppointment.service_name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-primary-200" />
                    <span>
                      {new Date(nextAppointment.scheduled_date).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-primary-200" />
                    <span>{nextAppointment.client_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-primary-200" />
                    <span>{nextAppointment.address || "Address TBD"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-primary-200" />
                    <span>${(nextAppointment.price / 100).toFixed(0)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => window.location.href = `tel:${nextAppointment.client_phone}`}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all duration-200"
                >
                  <Phone size={18} />
                </button>
                <button 
                  onClick={() => navigate('/provider/messages', { 
                    state: { customerId: nextAppointment.customer_id, jobId: nextAppointment.id } 
                  })}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all duration-200"
                >
                  <MessageSquare size={18} />
                </button>
                <button 
                  onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(nextAppointment.address || nextAppointment.client_name)}`, '_blank')}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all duration-200"
                >
                  <MapPin size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QUICK ACTIONS - Corporate Style */}
      <div className="bg-white rounded-xl border-2 border-secondary-200 shadow-card p-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-3">
          <QuickActionButton
            to="/provider/quotes"
            icon={<FileText size={20} />}
            label="Create Quote"
            color="primary"
          />
          <QuickActionButton
            to="/provider/schedule"
            icon={<Plus size={20} />}
            label="View Schedule"
            color="success"
          />
          <QuickActionButton
            to="/provider/messages"
            icon={<MessageSquare size={20} />}
            label="Messages"
            color="premium"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* UPCOMING JOBS */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border-2 border-secondary-200 shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-secondary-900">
                Upcoming Jobs (Next 7 Days)
              </h2>
              <Link
                to="/provider/schedule"
                className="text-sm font-semibold text-primary-700 hover:text-primary-800 flex items-center gap-1 hover:underline transition"
              >
                View All
                <ChevronRight size={16} />
              </Link>
            </div>

            {upcomingJobs.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="text-secondary-400" size={32} />
                </div>
                <p className="text-lg font-semibold text-secondary-900">No Upcoming Jobs</p>
                <p className="text-secondary-600 mt-2">
                  Go online to start receiving job offers!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingJobs.slice(0, 5).map((job) => (
                  <UpcomingJobCard key={job.id} job={job} navigate={navigate} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          {/* Weekly Stats */}
          <div className="bg-white rounded-xl border-2 border-secondary-200 shadow-card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">This Week</h3>
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
          <div className="bg-white rounded-xl border-2 border-secondary-200 shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">Quote Pipeline</h3>
              <Link
                to="/provider/quotes"
                className="text-sm font-semibold text-primary-700 hover:text-primary-800 hover:underline transition"
              >
                View All
              </Link>
            </div>
            <div className="space-y-2">
              <QuotePipelineItem label="Draft" count={draftQuotes} color="secondary" />
              <QuotePipelineItem label="Sent" count={pendingQuotes} color="warning" />
              <QuotePipelineItem label="Approved" count={approvedQuotes} color="success" />
            </div>
          </div>
        </div>
      </div>

      {currentOffer && (
        <JobOfferModal
          jobOffer={currentOffer}
          onAccept={acceptOffer}
          onDecline={declineOffer}
          onTimeout={handleTimeout}
        />
      )}
    </div>
  );
}

// SUB-COMPONENTS

function TodayMetric({ label, value, icon }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
      <div className="flex items-center gap-2 mb-2 text-primary-100">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function QuickActionButton({ to, icon, label, color }) {
  const colors = {
    primary: "bg-primary-50 text-primary-700 hover:bg-primary-100 border-primary-200",
    success: "bg-success-50 text-success-700 hover:bg-success-100 border-success-200",
    premium: "bg-premium-50 text-premium-700 hover:bg-premium-100 border-premium-200",
  };

  return (
    <Link
      to={to}
      className={`${colors[color]} border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all duration-300 font-semibold text-sm hover:scale-105`}
    >
      {icon}
      <span className="text-center">{label}</span>
    </Link>
  );
}

function UpcomingJobCard({ job, navigate }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-success-100 text-success-800 border-success-300";
      case "pending":
        return "bg-warning-100 text-warning-800 border-warning-300";
      case "completed":
        return "bg-primary-100 text-primary-800 border-primary-300";
      default:
        return "bg-secondary-100 text-secondary-800 border-secondary-300";
    }
  };

  const handleMessageClick = () => {
    navigate('/provider/messages', { 
      state: { customerId: job.customer_id, jobId: job.id } 
    });
  };

  return (
    <div className="bg-white rounded-xl border-2 border-secondary-200 shadow-card p-4 hover:shadow-card-hover hover:border-secondary-300 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-secondary-900">{job.service_name}</h4>
            <span className={`text-xs px-2 py-1 rounded-full font-semibold border ${getStatusBadge(job.status)}`}>
              {job.status}
            </span>
          </div>
          <div className="space-y-1 text-sm text-secondary-600">
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
          <p className="text-lg font-bold text-secondary-900">${(job.price / 100).toFixed(0)}</p>
          <div className="flex gap-1 mt-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `tel:${job.client_phone}`;
              }}
              className="p-1.5 bg-secondary-100 rounded hover:bg-secondary-200 transition"
            >
              <Phone size={14} className="text-secondary-600" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleMessageClick();
              }}
              className="p-1.5 bg-secondary-100 rounded hover:bg-secondary-200 transition"
            >
              <MessageSquare size={14} className="text-secondary-600" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                window.open(`https://maps.google.com/?q=${encodeURIComponent(job.address || job.client_name)}`, '_blank');
              }}
              className="p-1.5 bg-secondary-100 rounded hover:bg-secondary-200 transition"
            >
              <MapPin size={14} className="text-secondary-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function WeeklyStat({ label, value, icon }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-secondary-600">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-lg font-bold text-secondary-900">{value}</span>
    </div>
  );
}

function QuotePipelineItem({ label, count, color }) {
  const colors = {
    secondary: "bg-secondary-100 text-secondary-700",
    warning: "bg-warning-100 text-warning-700",
    success: "bg-success-100 text-success-700",
  };

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium text-secondary-700">{label}</span>
      <span className={`${colors[color]} px-3 py-1 rounded-full text-sm font-bold`}>{count}</span>
    </div>
  );
}