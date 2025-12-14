// src/components/ProviderDashboard/Network/components/Shared/NetworkStats.jsx
import { Users, UserCheck, Clock, Award, DollarSign } from "lucide-react";

export default function NetworkStats({
  totalProfessionals,
  totalConnections,
  pendingInvites,
  verifiedPros,
  totalEarnings = 0,
  onEarningsClick,
}) {
  const formatCurrency = (cents) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <StatCard
        icon={<Users size={20} />}
        label="All Professionals"
        value={totalProfessionals}
        color="blue"
      />
      <StatCard
        icon={<UserCheck size={20} />}
        label="My Connections"
        value={totalConnections}
        color="emerald"
      />
      <StatCard
        icon={<Clock size={20} />}
        label="Pending Invites"
        value={pendingInvites}
        color="amber"
        notification={pendingInvites > 0}
      />
      <StatCard
        icon={<Award size={20} />}
        label="Verified Pros"
        value={verifiedPros}
        color="purple"
      />
      <EarningsStatCard
        value={totalEarnings}
        onClick={onEarningsClick}
        formatted={formatCurrency(totalEarnings)}
      />
    </div>
  );
}

function StatCard({ icon, label, value, color, notification }) {
  const colors = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
  };

  return (
    <div className={`${colors[color]} border rounded-xl p-5 relative`}>
      {notification && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
          {value}
        </div>
      )}
      <div className="flex items-center justify-between mb-3">
        <div className="bg-white p-2 rounded-lg shadow-sm">{icon}</div>
      </div>
      <p className="text-sm font-medium opacity-80 mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function EarningsStatCard({ value, onClick, formatted }) {
  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 text-emerald-700 rounded-xl p-5 relative hover:from-emerald-100 hover:to-green-100 transition-all transform hover:scale-105 text-left group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
          <DollarSign size={20} className="text-emerald-600" />
        </div>
        {value > 0 && (
          <div className="bg-emerald-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
      <p className="text-sm font-medium opacity-80 mb-1">Total Earned</p>
      <p className="text-3xl font-bold mb-1">{formatted}</p>
      <p className="text-xs opacity-75 font-medium">Click for details →</p>
    </button>
  );
}