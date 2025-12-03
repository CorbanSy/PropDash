// src/components/ProviderDashboard/Network.jsx
import {
  Users,
  DollarSign,
  ShieldCheck,
  Link as LinkIcon,
  UserPlus,
  Send,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  TrendingUp,
  Star,
  Copy,
  ExternalLink,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import useAuth from "../../hooks/useAuth";

export default function Network() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview"); // 'overview', 'referrals', 'partners'
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    phone: "",
    trade: "",
  });

  // Mock stats (replace with real data)
  const [stats, setStats] = useState({
    totalEarnings: 145.0,
    thisMonth: 45.0,
    totalReferrals: 12,
    activePartners: 5,
  });

  // Fetch referrals and partners
  useEffect(() => {
    async function fetchNetworkData() {
      if (!user) return;

      // Fetch referrals
      const { data: referralsData } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_id", user.id)
        .order("created_at", { ascending: false });

      if (referralsData) setReferrals(referralsData);

      setLoading(false);
    }
    fetchNetworkData();
  }, [user]);

  const handleCopyInvite = () => {
    const inviteLink = `${window.location.origin}/invite/${user.id}`;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = async () => {
    if (!inviteForm.name || !inviteForm.email) {
      alert("Please enter name and email");
      return;
    }

    const { error } = await supabase.from("referrals").insert({
      referrer_id: user.id,
      referred_business_name: inviteForm.name,
      referred_email: inviteForm.email,
      referred_phone: inviteForm.phone,
      trade: inviteForm.trade,
      status: "pending",
    });

    if (error) {
      alert("Error sending invite");
      console.error(error);
    } else {
      alert("Invitation sent!");
      setShowInviteModal(false);
      setInviteForm({ name: "", email: "", phone: "", trade: "" });

      // Refresh referrals
      const { data: referralsData } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_id", user.id)
        .order("created_at", { ascending: false });

      if (referralsData) setReferrals(referralsData);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading network...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Network</h1>
          <p className="text-slate-600 mt-1">
            Build partnerships and grow together
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition shadow-lg shadow-green-500/30"
        >
          <UserPlus size={18} />
          Invite Partner
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<DollarSign className="text-green-600" />}
          label="Total Earnings"
          value={`$${stats.totalEarnings.toFixed(2)}`}
          color="green"
        />
        <StatCard
          icon={<TrendingUp className="text-blue-600" />}
          label="This Month"
          value={`$${stats.thisMonth.toFixed(2)}`}
          color="blue"
        />
        <StatCard
          icon={<Users className="text-purple-600" />}
          label="Total Referrals"
          value={stats.totalReferrals}
          color="purple"
        />
        <StatCard
          icon={<ShieldCheck className="text-orange-600" />}
          label="Active Partners"
          value={stats.activePartners}
          color="orange"
        />
      </div>

      {/* How It Works Banner */}
      <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <Users size={28} />
            <h2 className="text-2xl font-bold">How the Network Works</h2>
          </div>
          <p className="text-green-100 mb-6 max-w-2xl">
            Build a trusted network of service pros. When your clients need
            services you don't offer, refer them to partners in your network and
            earn a commission.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-3xl font-bold mb-1">1</div>
              <p className="text-sm font-medium">Invite trusted pros</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-3xl font-bold mb-1">2</div>
              <p className="text-sm font-medium">Refer your clients</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-3xl font-bold mb-1">3</div>
              <p className="text-sm font-medium">Earn 5% commission</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200">
        <TabButton
          active={activeTab === "overview"}
          onClick={() => setActiveTab("overview")}
          icon={<TrendingUp size={18} />}
          label="Overview"
        />
        <TabButton
          active={activeTab === "referrals"}
          onClick={() => setActiveTab("referrals")}
          icon={<Send size={18} />}
          label={`Referrals (${referrals.length})`}
        />
        <TabButton
          active={activeTab === "partners"}
          onClick={() => setActiveTab("partners")}
          icon={<Users size={18} />}
          label="My Partners"
        />
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <OverviewTab stats={stats} referrals={referrals} />
      )}
      {activeTab === "referrals" && <ReferralsTab referrals={referrals} />}
      {activeTab === "partners" && <PartnersTab partners={partners} />}

      {/* Invite Link Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start gap-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <LinkIcon className="text-green-600" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 mb-1">
              Your Referral Link
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Share this link with other pros to invite them to your network
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={`${window.location.origin}/invite/${user.id}`}
                readOnly
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm bg-slate-50"
              />
              <button
                onClick={handleCopyInvite}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 font-medium"
              >
                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal
          inviteForm={inviteForm}
          setInviteForm={setInviteForm}
          onClose={() => setShowInviteModal(false)}
          onInvite={handleInvite}
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
      className={`px-4 py-2.5 font-medium transition relative ${
        active ? "text-green-600" : "text-slate-600 hover:text-slate-900"
      }`}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
      )}
    </button>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, color }) {
  const colorClasses = {
    green: "bg-green-50 border-green-200",
    blue: "bg-blue-50 border-blue-200",
    purple: "bg-purple-50 border-purple-200",
    orange: "bg-orange-50 border-orange-200",
  };

  return (
    <div className={`${colorClasses[color]} border rounded-xl p-5`}>
      <div className="flex items-center justify-between mb-3">
        <div className="bg-white p-2 rounded-lg shadow-sm">{icon}</div>
      </div>
      <p className="text-sm font-medium text-slate-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

// Overview Tab
function OverviewTab({ stats, referrals }) {
  const recentActivity = [
    {
      id: 1,
      client: "Mrs. Jones",
      service: "Lawn Mowing",
      partner: "Sarah's Lawn Care",
      amount: 5.0,
      date: "2 days ago",
    },
    {
      id: 2,
      client: "Kevin S.",
      service: "Carpet Cleaning",
      partner: "Clean Pro Services",
      amount: 7.0,
      date: "1 week ago",
    },
    {
      id: 3,
      client: "Linda M.",
      service: "Plumbing Repair",
      partner: "Mike's Plumbing",
      amount: 12.0,
      date: "2 weeks ago",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Recent Earnings */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Recent Earnings
        </h2>
        {recentActivity.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="text-slate-400" size={32} />
            </div>
            <p className="text-slate-900 font-semibold mb-2">
              No earnings yet
            </p>
            <p className="text-slate-600 text-sm">
              Start referring clients to earn commissions
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <DollarSign className="text-green-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">
                        {activity.client}
                      </h3>
                      <p className="text-sm text-slate-600 mb-1">
                        Booked {activity.service} with{" "}
                        <span className="font-medium">{activity.partner}</span>
                      </p>
                      <p className="text-xs text-slate-500">{activity.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">
                      +${activity.amount.toFixed(2)}
                    </p>
                    <span className="text-xs text-slate-500">Commission</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">
          Earnings Over Time
        </h3>
        <div className="h-48 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center border border-green-200">
          <div className="text-center">
            <TrendingUp className="text-green-600 mx-auto mb-2" size={32} />
            <p className="text-sm text-slate-600">Chart coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Referrals Tab
function ReferralsTab({ referrals }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "joined":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "declined":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "joined":
        return <CheckCircle2 size={14} />;
      case "pending":
        return <Clock size={14} />;
      default:
        return null;
    }
  };

  if (referrals.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="text-slate-400" size={32} />
        </div>
        <p className="text-slate-900 font-semibold mb-2">No referrals yet</p>
        <p className="text-slate-600 text-sm mb-6">
          Start inviting trusted pros to join your network
        </p>
        <button className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition inline-flex items-center gap-2">
          <UserPlus size={18} />
          Send First Invite
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {referrals.map((referral) => (
        <div
          key={referral.id}
          className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 text-lg mb-1">
                {referral.referred_business_name}
              </h3>
              <div className="space-y-1 text-sm text-slate-600">
                {referral.trade && (
                  <p className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                      {referral.trade}
                    </span>
                  </p>
                )}
                {referral.referred_email && (
                  <p className="flex items-center gap-2">
                    <Mail size={14} />
                    {referral.referred_email}
                  </p>
                )}
                {referral.referred_phone && (
                  <p className="flex items-center gap-2">
                    <Phone size={14} />
                    {referral.referred_phone}
                  </p>
                )}
              </div>
            </div>
            <span
              className={`text-xs px-3 py-1 rounded-full font-semibold border flex items-center gap-1 ${getStatusColor(
                referral.status
              )}`}
            >
              {getStatusIcon(referral.status)}
              {referral.status.toUpperCase()}
            </span>
          </div>
          {referral.status === "pending" && (
            <button className="w-full py-2 text-sm text-blue-600 font-medium hover:text-blue-700 transition flex items-center justify-center gap-2">
              <Send size={14} />
              Resend Invitation
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// Partners Tab
function PartnersTab({ partners }) {
  const mockPartners = [
    {
      id: 1,
      name: "Sarah's Lawn Care",
      trade: "Landscaping",
      rating: 4.9,
      jobs: 23,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      verified: true,
    },
    {
      id: 2,
      name: "Mike's Plumbing",
      trade: "Plumbing",
      rating: 4.8,
      jobs: 34,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      verified: true,
    },
    {
      id: 3,
      name: "Clean Pro Services",
      trade: "Cleaning",
      rating: 5.0,
      jobs: 12,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Clean",
      verified: false,
    },
  ];

  return (
    <div className="space-y-4">
      {mockPartners.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-slate-400" size={32} />
          </div>
          <p className="text-slate-900 font-semibold mb-2">
            No partners yet
          </p>
          <p className="text-slate-600 text-sm">
            Invite pros to build your trusted network
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockPartners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition"
            >
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={partner.avatar}
                  alt={partner.name}
                  className="w-16 h-16 rounded-full bg-slate-100"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">
                    {partner.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-2">
                    {partner.trade}
                  </p>
                  {partner.verified && (
                    <span className="text-xs flex items-center gap-1 text-green-600">
                      <ShieldCheck size={14} />
                      Verified Partner
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-600 mb-4 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{partner.rating}</span>
                </div>
                <div>
                  <span className="font-medium">{partner.jobs}</span> jobs
                  completed
                </div>
              </div>

              <button className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2">
                <ExternalLink size={16} />
                Refer Client
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Invite Modal
function InviteModal({ inviteForm, setInviteForm, onClose, onInvite }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Invite a Partner
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Business Name *
            </label>
            <input
              type="text"
              value={inviteForm.name}
              onChange={(e) =>
                setInviteForm({ ...inviteForm, name: e.target.value })
              }
              className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Mike's Plumbing"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={inviteForm.email}
              onChange={(e) =>
                setInviteForm({ ...inviteForm, email: e.target.value })
              }
              className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="mike@plumbing.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={inviteForm.phone}
              onChange={(e) =>
                setInviteForm({ ...inviteForm, phone: e.target.value })
              }
              className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Trade/Service
            </label>
            <input
              type="text"
              value={inviteForm.trade}
              onChange={(e) =>
                setInviteForm({ ...inviteForm, trade: e.target.value })
              }
              className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Plumbing, Electrical, etc."
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onInvite}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
          >
            <Send size={18} />
            Send Invite
          </button>
        </div>
      </div>
    </div>
  );
}

function X({ size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}