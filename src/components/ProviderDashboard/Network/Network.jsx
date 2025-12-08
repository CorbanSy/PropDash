// src/components/ProviderDashboard/Network/Network.jsx
import { useState, useEffect } from "react";
import {
  TrendingUp,
  Send,
  Users,
  DollarSign,
  Briefcase,
  UserPlus,
  Trophy,
  Settings,
} from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import useAuth from "../../../hooks/useAuth";
import { theme } from "../../../styles/theme";
import Overview from "./Overview";
import Referrals from "./Referrals";
import Partners from "./Partners";
import Commissions from "./Commissions";
import JobMatchmaking from "./JobMatchmaking";
import StatCard from "./components/StatCard";
import NetworkStrengthScore from "./components/NetworkStrengthScore";
import InviteModal from "./components/InviteModal";
import Leaderboard from "./components/Leaderboard";
import { calculateNetworkScore, calculateCommissions } from "./utils/networkCalculations";

export default function Network() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [referrals, setReferrals] = useState([]);
  const [partners, setPartners] = useState([]);
  const [referredJobs, setReferredJobs] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  
  // UI State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    fetchNetworkData();
  }, [user]);

  const fetchNetworkData = async () => {
    if (!user) return;

    // Fetch referrals
    const { data: referralsData } = await supabase
      .from("referrals")
      .select("*")
      .eq("referrer_id", user.id)
      .order("created_at", { ascending: false });

    // Fetch partners (referrals that joined)
    const { data: partnersData } = await supabase
      .from("referrals")
      .select(`
        *,
        partner:referred_user_id (
          id,
          full_name,
          business_name,
          email,
          phone,
          avatar_url,
          trade,
          rating,
          jobs_completed,
          verified,
          location
        )
      `)
      .eq("referrer_id", user.id)
      .eq("status", "joined");

    // Fetch referred jobs
    const { data: jobsData } = await supabase
      .from("referred_jobs")
      .select("*")
      .eq("referrer_id", user.id)
      .order("created_at", { ascending: false });

    // Fetch activity feed
    const { data: activityData } = await supabase
      .from("network_activity")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (referralsData) setReferrals(referralsData);
    if (partnersData) setPartners(partnersData);
    if (jobsData) setReferredJobs(jobsData);
    if (activityData) setActivityFeed(activityData);
    
    setLoading(false);
  };

  // Calculate stats
  const networkScore = calculateNetworkScore(partners, referrals);
  const commissions = calculateCommissions(referredJobs);
  
  const stats = {
    totalEarnings: commissions.paid,
    pendingEarnings: commissions.pending,
    totalReferrals: referrals.length,
    activePartners: partners.filter(p => p.status === "active").length,
    thisMonth: referredJobs
      .filter(j => {
        const jobDate = new Date(j.created_at);
        const now = new Date();
        return jobDate.getMonth() === now.getMonth() && jobDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, j) => sum + (j.commission || 0), 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={theme.text.body}>Loading network...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className={theme.text.h1}>Network & Referrals</h1>
          <p className={`${theme.text.body} mt-1`}>
            Build partnerships, refer jobs, and earn commissions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowLeaderboard(true)}
            className={`hidden md:flex ${theme.button.secondary} items-center gap-2`}
          >
            <Trophy size={18} />
            Leaderboard
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className={`${theme.button.provider} flex items-center gap-2`}
          >
            <UserPlus size={18} />
            Invite Partner
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          icon={<DollarSign size={20} />}
          label="Total Earned"
          value={`$${stats.totalEarnings.toFixed(2)}`}
          color="emerald"
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="This Month"
          value={`$${stats.thisMonth.toFixed(2)}`}
          color="blue"
        />
        <StatCard
          icon={<DollarSign size={20} />}
          label="Pending"
          value={`$${stats.pendingEarnings.toFixed(2)}`}
          color="amber"
        />
        <StatCard
          icon={<Send size={20} />}
          label="Referrals"
          value={stats.totalReferrals}
          color="purple"
        />
        <StatCard
          icon={<Users size={20} />}
          label="Partners"
          value={stats.activePartners}
          color="indigo"
        />
      </div>

      {/* Network Strength Score */}
      <NetworkStrengthScore
        score={networkScore}
        partners={partners}
        referrals={referrals}
      />

      {/* How It Works Banner */}
      <div className={`${theme.gradient.providerLight} rounded-2xl p-8 text-white relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <Users size={28} />
            <h2 className="text-2xl font-bold">How Your Network Works</h2>
          </div>
          <p className="text-blue-100 mb-6 max-w-2xl">
            Build a trusted network of service pros. Refer jobs you can't take, earn commissions on completed work, and grow together.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-3xl font-bold mb-1">1</div>
              <p className="text-sm font-medium">Invite trusted pros</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-3xl font-bold mb-1">2</div>
              <p className="text-sm font-medium">Refer jobs to partners</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-3xl font-bold mb-1">3</div>
              <p className="text-sm font-medium">Partner completes work</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-3xl font-bold mb-1">4</div>
              <p className="text-sm font-medium">Earn 5-10% commission</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        <TabButton
          active={activeTab === "overview"}
          onClick={() => setActiveTab("overview")}
          icon={<TrendingUp size={18} />}
          label="Overview"
        />
        <TabButton
          active={activeTab === "matchmaking"}
          onClick={() => setActiveTab("matchmaking")}
          icon={<Briefcase size={18} />}
          label="Refer Jobs"
        />
        <TabButton
          active={activeTab === "partners"}
          onClick={() => setActiveTab("partners")}
          icon={<Users size={18} />}
          label={`Partners (${stats.activePartners})`}
        />
        <TabButton
          active={activeTab === "referrals"}
          onClick={() => setActiveTab("referrals")}
          icon={<Send size={18} />}
          label={`Invites (${stats.totalReferrals})`}
        />
        <TabButton
          active={activeTab === "commissions"}
          onClick={() => setActiveTab("commissions")}
          icon={<DollarSign size={18} />}
          label="Commissions"
        />
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <Overview
          stats={stats}
          partners={partners}
          referredJobs={referredJobs}
          activityFeed={activityFeed}
          onRefresh={fetchNetworkData}
        />
      )}
      {activeTab === "matchmaking" && (
        <JobMatchmaking
          partners={partners}
          userId={user.id}
          onRefresh={fetchNetworkData}
        />
      )}
      {activeTab === "partners" && (
        <Partners
          partners={partners}
          userId={user.id}
          onRefresh={fetchNetworkData}
        />
      )}
      {activeTab === "referrals" && (
        <Referrals
          referrals={referrals}
          onRefresh={fetchNetworkData}
        />
      )}
      {activeTab === "commissions" && (
        <Commissions
          referredJobs={referredJobs}
          stats={stats}
          userId={user.id}
        />
      )}

      {/* Modals */}
      {showInviteModal && (
        <InviteModal
          userId={user.id}
          onClose={() => setShowInviteModal(false)}
          onSuccess={fetchNetworkData}
        />
      )}

      {showLeaderboard && (
        <Leaderboard
          currentUserId={user.id}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </div>
  );
}

// Tab Button Component
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 font-semibold transition relative whitespace-nowrap ${
        active ? "text-blue-700" : "text-slate-600 hover:text-slate-900"
      }`}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>}
    </button>
  );
}