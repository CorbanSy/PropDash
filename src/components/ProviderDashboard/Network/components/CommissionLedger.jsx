// src/components/ProviderDashboard/Network/components/CommissionLedger.jsx
import { DollarSign, CheckCircle2, Clock, Calendar, User, Briefcase } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { formatCurrency } from "../utils/networkCalculations.js";

export default function CommissionLedger({ jobs }) {
  if (jobs.length === 0) {
    return (
      <div className={`${theme.card.base} ${theme.card.padding} text-center py-12`}>
        <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="text-slate-400" size={32} />
        </div>
        <p className={`${theme.text.h4} mb-2`}>No Commission Records</p>
        <p className={theme.text.body}>
          Your commission history will appear here
        </p>
      </div>
    );
  }

  return (
    <div className={`${theme.card.base} ${theme.card.padding}`}>
      <h3 className={`${theme.text.h3} mb-4`}>Commission Ledger</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-slate-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Date</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Client</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Service</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Partner</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Job Total</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Rate</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Commission</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                <td className="py-4 px-4 text-sm text-slate-600">
                  {new Date(job.completedAt || job.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-900">
                      {job.clientName || "Unknown"}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-slate-400" />
                    <span className="text-sm text-slate-700">{job.serviceName}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-slate-700">
                  {job.partnerName || "N/A"}
                </td>
                <td className="py-4 px-4 text-sm font-semibold text-slate-900 text-right">
                  {formatCurrency((job.jobTotal || 0) / 100)}
                </td>
                <td className="py-4 px-4 text-sm text-slate-600 text-right">
                  {((job.commissionRate || 0.05) * 100).toFixed(0)}%
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-sm font-bold text-emerald-700">
                    {formatCurrency((job.commission || 0) / 100)}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  {job.commissionPaid ? (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${theme.badge.success}`}>
                      <CheckCircle2 size={12} className="inline mr-1" />
                      Paid
                    </span>
                  ) : (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${theme.badge.warning}`}>
                      <Clock size={12} className="inline mr-1" />
                      Pending
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="mt-6 pt-6 border-t-2 border-slate-200">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-slate-600 mb-1">Total Jobs</p>
            <p className="text-2xl font-bold text-slate-900">{jobs.length}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-1">Total Commissions</p>
            <p className="text-2xl font-bold text-emerald-700">
              {formatCurrency(jobs.reduce((sum, j) => sum + (j.commission || 0), 0) / 100)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-1">Average Commission</p>
            <p className="text-2xl font-bold text-blue-700">
              {formatCurrency(
                jobs.length > 0
                  ? jobs.reduce((sum, j) => sum + (j.commission || 0), 0) / jobs.length / 100
                  : 0
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}