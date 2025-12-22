//levlpro-mvp\src\components\ProviderDashboard\Clients\components\ClientStats.jsx
import { Users, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { getClientStatus, formatCurrency } from "../utils/clientCalculations";

export default function ClientStats({ clients, jobs }) {
  const totalClients = clients.length;

  const totalRevenue = jobs
    .filter(j => j.status === "completed")
    .reduce((sum, j) => sum + (j.total || 0), 0);

  const avgPerClient = totalClients > 0 ? totalRevenue / totalClients : 0;

  // Count by status
  const statusCounts = clients.reduce((acc, client) => {
    const clientJobs = jobs.filter(j => j.customer_id === client.id);
    const status = getClientStatus(clientJobs).status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const atRisk = (statusCounts.Dormant || 0) + (statusCounts.Lost || 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-2">
          <Users className="text-blue-600" size={20} />
          <p className="text-sm text-blue-700 font-medium">Total Clients</p>
        </div>
        <p className="text-3xl font-bold text-blue-900">{totalClients}</p>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="text-emerald-600" size={20} />
          <p className="text-sm text-emerald-700 font-medium">Total Revenue</p>
        </div>
        <p className="text-3xl font-bold text-emerald-900">{formatCurrency(totalRevenue)}</p>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="text-purple-600" size={20} />
          <p className="text-sm text-purple-700 font-medium">Avg per Client</p>
        </div>
        <p className="text-3xl font-bold text-purple-900">{formatCurrency(avgPerClient)}</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="text-amber-600" size={20} />
          <p className="text-sm text-amber-700 font-medium">At Risk</p>
        </div>
        <p className="text-3xl font-bold text-amber-900">{atRisk}</p>
        <p className="text-xs text-amber-600 mt-1">Need follow-up</p>
      </div>
    </div>
  );
}