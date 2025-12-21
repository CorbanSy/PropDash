//levlpro-mvp\src\components\ProviderDashboard\Network\components\MyConnections\ConnectionsStats.jsx
import { Users, UserCheck, Award, Send, DollarSign } from "lucide-react";

export default function ConnectionsStats({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <StatCard
        icon={<Users size={18} />}
        label="Total"
        value={stats.total}
        color="blue"
      />
      <StatCard
        icon={<UserCheck size={18} />}
        label="Active"
        value={stats.active}
        color="green"
      />
      <StatCard
        icon={<Award size={18} />}
        label="Verified"
        value={stats.verified}
        color="purple"
      />
      <StatCard
        icon={<Send size={18} />}
        label="Referrals"
        value={stats.totalReferrals}
        color="amber"
      />
      <StatCard
        icon={<DollarSign size={18} />}
        label="Earned"
        value={`$${stats.totalEarnings}`}
        color="emerald"
      />
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
  };

  return (
    <div className={`${colors[color]} border rounded-xl p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-white p-1.5 rounded-lg shadow-sm">{icon}</div>
        <p className="text-xs font-medium opacity-80">{label}</p>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}