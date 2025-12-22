//levlpro-mvp\src\components\ProviderDashboard\Clients\components\ClientMetrics.jsx
import { DollarSign, Briefcase, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { theme } from "../../../../styles/theme";
import {
  calculateCLV,
  calculateFrequency,
  getDaysSinceLastJob,
  getClientStatus,
  formatCurrency,
} from "../utils/clientCalculations";
import RevenueChart from "./RevenueChart";

export default function ClientMetrics({ client, jobs }) {
  const totalSpent = jobs
    .filter(j => j.status === "completed")
    .reduce((sum, j) => sum + (j.total || 0), 0);

  const clv = calculateCLV(client, jobs);
  const frequency = calculateFrequency(jobs);
  const daysSince = getDaysSinceLastJob(jobs);
  const status = getClientStatus(jobs);

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-emerald-600" size={18} />
            <p className="text-xs text-emerald-700 font-medium">Total Spent</p>
          </div>
          <p className="text-2xl font-bold text-emerald-900">{formatCurrency(totalSpent)}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="text-blue-600" size={18} />
            <p className="text-xs text-blue-700 font-medium">Jobs Count</p>
          </div>
          <p className="text-2xl font-bold text-blue-900">{jobs.length}</p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-purple-600" size={18} />
            <p className="text-xs text-purple-700 font-medium">Lifetime Value</p>
          </div>
          <p className="text-2xl font-bold text-purple-900">{formatCurrency(clv)}/yr</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-amber-600" size={18} />
            <p className="text-xs text-amber-700 font-medium">Last Job</p>
          </div>
          <p className="text-2xl font-bold text-amber-900">
            {daysSince !== null ? `${daysSince}d` : "Never"}
          </p>
        </div>
      </div>

      {/* Status & Frequency */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className={`${theme.card.base} ${theme.card.padding}`}>
          <h4 className={`${theme.text.h4} mb-3`}>Client Status</h4>
          <div className={`p-4 rounded-lg border-2 ${
            status.color === "green" ? "bg-green-50 border-green-200" :
            status.color === "amber" ? "bg-amber-50 border-amber-200" :
            status.color === "red" ? "bg-red-50 border-red-200" :
            "bg-blue-50 border-blue-200"
          }`}>
            <p className="text-2xl font-bold mb-1" style={{
              color: status.color === "green" ? "#047857" :
                     status.color === "amber" ? "#d97706" :
                     status.color === "red" ? "#dc2626" : "#2563eb"
            }}>
              {status.status}
            </p>
            <p className="text-sm" style={{
              color: status.color === "green" ? "#065f46" :
                     status.color === "amber" ? "#92400e" :
                     status.color === "red" ? "#991b1b" : "#1e40af"
            }}>
              {status.description}
            </p>
          </div>
        </div>

        <div className={`${theme.card.base} ${theme.card.padding}`}>
          <h4 className={`${theme.text.h4} mb-3`}>Job Frequency</h4>
          <div className="p-4 bg-slate-50 rounded-lg border-2 border-slate-200">
            <p className="text-2xl font-bold text-slate-900 mb-1">
              {frequency.toFixed(1)} jobs/year
            </p>
            <p className="text-sm text-slate-600">
              {frequency > 4 ? "Frequent customer" :
               frequency > 2 ? "Regular customer" :
               frequency > 0 ? "Occasional customer" :
               "New customer"}
            </p>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <RevenueChart jobs={jobs} />
    </div>
  );
}