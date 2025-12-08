// src/components/ProviderDashboard/Jobs/components/JobStats.jsx
import { DollarSign, Briefcase, CheckCircle2, AlertCircle, TrendingUp, Calendar } from "lucide-react";
import { theme } from "../../../../styles/theme";
import {
  calculateTotalRevenue,
  calculatePendingRevenue,
  calculateOutstandingPayments,
  calculateAverageJobValue,
  calculateCompletionRate,
  getUpcomingJobs,
  formatCurrency,
} from "../utils/jobCalculations";

export default function JobStats({ jobs }) {
  const totalRevenue = calculateTotalRevenue(jobs);
  const pendingRevenue = calculatePendingRevenue(jobs);
  const outstandingPayments = calculateOutstandingPayments(jobs);
  const avgJobValue = calculateAverageJobValue(jobs);
  const completionRate = calculateCompletionRate(jobs);
  const upcomingJobs = getUpcomingJobs(jobs);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {/* Total Revenue */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="text-emerald-600" size={18} />
          <p className="text-xs text-emerald-700 font-medium">Total Revenue</p>
        </div>
        <p className="text-2xl font-bold text-emerald-900">{formatCurrency(totalRevenue)}</p>
      </div>

      {/* Pending Revenue */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="text-blue-600" size={18} />
          <p className="text-xs text-blue-700 font-medium">Pending</p>
        </div>
        <p className="text-2xl font-bold text-blue-900">{formatCurrency(pendingRevenue)}</p>
      </div>

      {/* Outstanding Payments */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="text-amber-600" size={18} />
          <p className="text-xs text-amber-700 font-medium">Unpaid</p>
        </div>
        <p className="text-2xl font-bold text-amber-900">{formatCurrency(outstandingPayments)}</p>
      </div>

      {/* Total Jobs */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="text-purple-600" size={18} />
          <p className="text-xs text-purple-700 font-medium">Total Jobs</p>
        </div>
        <p className="text-2xl font-bold text-purple-900">{jobs.length}</p>
      </div>

      {/* Average Value */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="text-indigo-600" size={18} />
          <p className="text-xs text-indigo-700 font-medium">Avg Value</p>
        </div>
        <p className="text-2xl font-bold text-indigo-900">{formatCurrency(avgJobValue)}</p>
      </div>

      {/* Completion Rate */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="text-green-600" size={18} />
          <p className="text-xs text-green-700 font-medium">Completion</p>
        </div>
        <p className="text-2xl font-bold text-green-900">{completionRate.toFixed(0)}%</p>
      </div>
    </div>
  );
}