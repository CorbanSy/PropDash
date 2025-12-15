// src/components/ProviderDashboard/Network/components/Shared/NetworkStats.jsx
import {
  Users,
  UserCheck,
  Clock,
  Award,
  DollarSign,
  ArrowRight,
} from "lucide-react";

export default function NetworkStats({
  totalProfessionals,
  totalConnections,
  pendingInvites,
  verifiedPros,
  totalEarnings = 0,
  onEarningsClick,
}) {
  const formatCurrency = (cents) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <StatCard
        icon={<Users size={20} />}
        label="All Professionals"
        value={totalProfessionals}
      />
      <StatCard
        icon={<UserCheck size={20} />}
        label="My Connections"
        value={totalConnections}
      />
      <StatCard
        icon={<Clock size={20} />}
        label="Pending Invites"
        value={pendingInvites}
        notification={pendingInvites > 0}
      />
      <StatCard
        icon={<Award size={20} />}
        label="Verified Pros"
        value={verifiedPros}
      />
      <EarningsStatCard
        value={totalEarnings}
        formatted={formatCurrency(totalEarnings)}
        onClick={onEarningsClick}
      />
    </div>
  );
}

/* ---------- Shared Stat Card ---------- */

function StatCard({ icon, label, value, notification }) {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      {notification && (
        <div className="absolute -top-2 -right-2 min-w-[24px] h-6 px-1 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
          {value}
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
          {icon}
        </div>
        <p className="text-sm font-medium text-slate-600">{label}</p>
      </div>

      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

/* ---------- Earnings (Primary CTA) ---------- */

function EarningsStatCard({ value, formatted, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        relative rounded-2xl border border-primary-200
        bg-gradient-to-br from-primary-50 to-white
        p-5 text-left shadow-sm
        hover:shadow-md hover:from-primary-100
        transition-all group
      "
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700">
          <DollarSign size={20} />
        </div>

        {value > 0 && (
          <ArrowRight
            size={18}
            className="text-primary-600 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
          />
        )}
      </div>

      <p className="text-sm font-medium text-slate-600 mb-1">
        Total Earned
      </p>
      <p className="text-3xl font-bold text-slate-900 mb-1">
        {formatted}
      </p>
      <p className="text-xs text-slate-500">
        View referral earnings
      </p>
    </button>
  );
}
