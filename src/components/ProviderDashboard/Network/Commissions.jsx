// src/components/ProviderDashboard/Network/Commissions.jsx
import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  Filter,
} from "lucide-react";
import { theme } from "../../../styles/theme";
import CommissionLedger from "./components/CommissionLedger";
import { formatCurrency, getNextPayoutDate } from "./utils/networkCalculations";

export default function Commissions({ referredJobs, stats, userId }) {
  const [timeFilter, setTimeFilter] = useState("all"); // all, month, quarter, year
  const [statusFilter, setStatusFilter] = useState("all"); // all, paid, pending

  // Filter jobs
  const filteredJobs = referredJobs.filter((job) => {
    // Status filter
    if (statusFilter === "paid" && !job.commissionPaid) return false;
    if (statusFilter === "pending" && job.commissionPaid) return false;

    // Time filter
    if (timeFilter !== "all") {
      const jobDate = new Date(job.completedAt);
      const now = new Date();
      
      if (timeFilter === "month") {
        if (jobDate.getMonth() !== now.getMonth() || jobDate.getFullYear() !== now.getFullYear()) {
          return false;
        }
      } else if (timeFilter === "quarter") {
        const currentQuarter = Math.floor(now.getMonth() / 3);
        const jobQuarter = Math.floor(jobDate.getMonth() / 3);
        if (jobQuarter !== currentQuarter || jobDate.getFullYear() !== now.getFullYear()) {
          return false;
        }
      } else if (timeFilter === "year") {
        if (jobDate.getFullYear() !== now.getFullYear()) {
          return false;
        }
      }
    }

    return true;
  });

  const nextPayoutDate = getNextPayoutDate();
  const canRequestPayout = stats.pendingEarnings >= 25; // $25 minimum

  return (
    <div className="space-y-6">
      {/* Payout Summary Card */}
      <div className={`${theme.gradient.providerLight} rounded-2xl p-8 text-white`}>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Pending */}
          <div>
            <p className="text-blue-100 text-sm font-medium mb-2">Pending Payout</p>
            <p className="text-4xl font-bold mb-1">{formatCurrency(stats.pendingEarnings)}</p>
            <p className="text-blue-200 text-sm">
              Next payout: {nextPayoutDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </p>
          </div>

          {/* This Month */}
          <div>
            <p className="text-blue-100 text-sm font-medium mb-2">This Month</p>
            <p className="text-4xl font-bold mb-1">{formatCurrency(stats.thisMonth)}</p>
            <p className="text-blue-200 text-sm">
              {referredJobs.filter(j => {
                const d = new Date(j.completedAt);
                const now = new Date();
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              }).length} jobs completed
            </p>
          </div>

          {/* Total Earned */}
          <div>
            <p className="text-blue-100 text-sm font-medium mb-2">Total Earned</p>
            <p className="text-4xl font-bold mb-1">{formatCurrency(stats.totalEarnings)}</p>
            <p className="text-blue-200 text-sm">All time earnings</p>
          </div>
        </div>

        {/* Payout Action */}
        <div className="mt-6 pt-6 border-t border-white/20">
          {canRequestPayout ? (
            <button className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center gap-2">
              <CreditCard size={18} />
              Request Payout Now
            </button>
          ) : (
            <div className="flex items-center gap-3 text-blue-100 text-sm">
              <AlertCircle size={18} />
              <span>
                Minimum payout is $25.00 • You're ${(25 - stats.pendingEarnings).toFixed(2)} away
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Commission Settings */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className={`${theme.text.h3} mb-2`}>Commission Structure</h3>
            <p className={theme.text.body}>
              Earn commissions on every job you refer to your network
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Standard Rate */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
                <DollarSign size={20} />
              </div>
              <h4 className="font-semibold text-slate-900">Standard Rate</h4>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-2">5%</p>
            <p className="text-sm text-slate-600">On all completed referrals</p>
          </div>

          {/* VIP Rate */}
          <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4 relative overflow-hidden">
            <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-bold">
              VIP
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-purple-100 text-purple-700 p-2 rounded-lg">
                <TrendingUp size={20} />
              </div>
              <h4 className="font-semibold text-slate-900">VIP Partner Rate</h4>
            </div>
            <p className="text-3xl font-bold text-purple-900 mb-2">10%</p>
            <p className="text-sm text-slate-600">For high-volume partners</p>
          </div>
        </div>

        {/* Payout Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Calendar size={18} />
            Payout Schedule
          </h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
              <span>Payouts processed on the 15th of each month</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
              <span>Minimum payout threshold: $25.00</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
              <span>Paid via Stripe Connect to your bank account</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
              <span>Commissions earned when jobs are marked complete</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Filters */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className={theme.text.label}>Time Period</label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className={`${theme.input.base} ${theme.input.provider} mt-1`}
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div className="flex-1">
            <label className={theme.text.label}>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`${theme.input.base} ${theme.input.provider} mt-1`}
            >
              <option value="all">All Commissions</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className={`${theme.button.secondary} flex items-center gap-2`}>
              <Download size={18} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Commission Ledger */}
      <CommissionLedger jobs={filteredJobs} />

      {/* Payout History */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <h3 className={`${theme.text.h3} mb-4`}>Payout History</h3>
        
        <div className="space-y-3">
          {/* Example payout records */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-900">November 2024 Payout</p>
                <p className="text-sm text-slate-600">Paid on Nov 15, 2024</p>
              </div>
            </div>
            <p className="text-lg font-bold text-emerald-700">+$145.00</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-900">October 2024 Payout</p>
                <p className="text-sm text-slate-600">Paid on Oct 15, 2024</p>
              </div>
            </div>
            <p className="text-lg font-bold text-emerald-700">+$98.50</p>
          </div>

          {referredJobs.filter(j => j.commissionPaid).length === 0 && (
            <div className="text-center py-8">
              <Clock className="text-slate-400 mx-auto mb-3" size={32} />
              <p className={theme.text.body}>No payout history yet</p>
              <p className="text-sm text-slate-500 mt-1">
                Your first payout will appear here after completion
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}