// src/components/ProviderDashboard/Jobs/components/JobStats.jsx
import { DollarSign, Briefcase, AlertCircle, Calendar } from "lucide-react";
import { theme } from "../../../../styles/theme";
import {
  calculatePendingRevenue,
  calculateOutstandingPayments,
  formatCurrency,
} from "../utils/jobCalculations";

export default function JobStats({ jobs }) {
  const pendingRevenue = calculatePendingRevenue(jobs);
  const outstandingPayments = calculateOutstandingPayments(jobs);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Pending Revenue */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="text-blue-600" size={18} />
          <p className="text-xs text-blue-700 font-medium">Pending Revenue</p>
        </div>
        <p className="text-2xl font-bold text-blue-900">{formatCurrency(pendingRevenue)}</p>
        <p className="text-xs text-blue-600 mt-1">Jobs in progress</p>
      </div>

      {/* Outstanding Payments */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="text-amber-600" size={18} />
          <p className="text-xs text-amber-700 font-medium">Unpaid</p>
        </div>
        <p className="text-2xl font-bold text-amber-900">{formatCurrency(outstandingPayments)}</p>
        <p className="text-xs text-amber-600 mt-1">Awaiting payment</p>
      </div>

      {/* Total Jobs */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="text-purple-600" size={18} />
          <p className="text-xs text-purple-700 font-medium">Total Jobs</p>
        </div>
        <p className="text-2xl font-bold text-purple-900">{jobs.length}</p>
        <p className="text-xs text-purple-600 mt-1">All time</p>
      </div>
    </div>
  );
}