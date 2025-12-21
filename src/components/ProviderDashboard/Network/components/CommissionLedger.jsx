//levlpro-mvp\src\components\ProviderDashboard\Network\components\CommissionLedger.jsx
import { useState, useEffect } from "react";
import { DollarSign, CheckCircle2, Clock, Calendar, User, Briefcase, Download } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { supabase } from "../../../../lib/supabaseClient";

export default function CommissionLedger({ userId }) {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, completed, paid

  useEffect(() => {
    if (userId) {
      fetchReferrals();
    }
  }, [userId, filter]);

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("job_referrals")
        .select(`
          *,
          original_job:jobs!job_referrals_original_job_id_fkey(
            id,
            service_name,
            category,
            price,
            completed_at,
            paid,
            paid_at
          ),
          referred_provider:providers!job_referrals_referred_provider_id_fkey(
            id,
            business_name
          ),
          customer:customers(
            id,
            full_name
          )
        `)
        .eq("referring_provider_id", userId)
        .order("created_at", { ascending: false });

      // Apply filter
      if (filter === "pending") {
        query = query.in("status", ["pending", "accepted"]);
      } else if (filter === "completed") {
        query = query.eq("status", "completed");
      } else if (filter === "paid") {
        query = query.eq("status", "paid");
      }

      const { data, error } = await query;

      if (error) throw error;

      // Calculate commission amounts for completed jobs
      const processedData = data.map(referral => ({
        ...referral,
        calculated_commission: referral.commission_amount || 
          (referral.original_job?. price? 
            Math.round(referral.original_job.price * referral.commission_rate) : 
            0)
      }));

      setReferrals(processedData);
    } catch (error) {
      console.error("Error fetching referrals:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (cents) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const exportToCSV = () => {
    const headers = ["Date", "Customer", "Service", "Partner", "Job Total", "Rate", "Commission", "Status"];
    const rows = referrals.map(ref => [
      new Date(ref.created_at).toLocaleDateString(),
      ref.customer?.full_name || "Unknown",
      ref.original_job?.service_category || "N/A",
      ref.referred_provider?.business_name || "N/A",
      formatCurrency(ref.original_job?.price || 0),
      `${(ref.commission_rate * 100).toFixed(0)}%`,
      formatCurrency(ref.calculated_commission),
      ref.status.charAt(0).toUpperCase() + ref.status.slice(1)
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `commissions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // Calculate stats
  const stats = {
    total: referrals.length,
    totalEarned: referrals
      .filter(r => r.status === "completed" || r.status === "paid")
      .reduce((sum, r) => sum + r.calculated_commission, 0),
    totalPending: referrals
      .filter(r => r.status === "pending" || r.status === "accepted")
      .reduce((sum, r) => sum + r.calculated_commission, 0),
    totalPaid: referrals
      .filter(r => r.status === "paid")
      .reduce((sum, r) => sum + r.calculated_commission, 0),
  };

  if (loading) {
    return (
      <div className={`${theme.card.base} ${theme.card.padding} text-center py-12`}>
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-slate-600 mt-3">Loading commissions...</p>
      </div>
    );
  }

  if (referrals.length === 0) {
    return (
      <div className={`${theme.card.base} ${theme.card.padding} text-center py-12`}>
        <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="text-slate-400" size={32} />
        </div>
        <p className={`${theme.text.h4} mb-2`}>No Commission Records</p>
        <p className={theme.text.body}>
          Your commission history will appear here when you refer jobs to connections
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="text-blue-600" size={20} />
            <p className="text-sm font-medium text-blue-900">Total Referrals</p>
          </div>
          <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="text-emerald-600" size={20} />
            <p className="text-sm font-medium text-emerald-900">Total Earned</p>
          </div>
          <p className="text-3xl font-bold text-emerald-900">{formatCurrency(stats.totalEarned)}</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-amber-600" size={20} />
            <p className="text-sm font-medium text-amber-900">Pending</p>
          </div>
          <p className="text-3xl font-bold text-amber-900">{formatCurrency(stats.totalPending)}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-purple-600" size={20} />
            <p className="text-sm font-medium text-purple-900">Paid Out</p>
          </div>
          <p className="text-3xl font-bold text-purple-900">{formatCurrency(stats.totalPaid)}</p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={theme.text.h3}>Commission History</h3>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition text-sm font-semibold"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="All"
          />
          <FilterButton
            active={filter === "pending"}
            onClick={() => setFilter("pending")}
            label="Pending"
          />
          <FilterButton
            active={filter === "completed"}
            onClick={() => setFilter("completed")}
            label="Completed"
          />
          <FilterButton
            active={filter === "paid"}
            onClick={() => setFilter("paid")}
            label="Paid"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Service</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Partner</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Job Total</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Rate</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Commission</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((referral) => (
                <tr key={referral.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="py-4 px-4 text-sm text-slate-600">
                    {new Date(referral.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-slate-400" />
                      <span className="text-sm font-medium text-slate-900">
                        {referral.customer?.full_name || "Unknown"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Briefcase size={14} className="text-slate-400" />
                      <span className="text-sm text-slate-700">
                        {referral.original_job?.service_category || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-700">
                    {referral.referred_provider?.business_name || "N/A"}
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-slate-900 text-right">
                    {formatCurrency(referral.original_job?.price|| 0)}
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600 text-right">
                    {(referral.commission_rate * 100).toFixed(0)}%
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-bold text-emerald-700">
                      {formatCurrency(referral.calculated_commission)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <StatusBadge status={referral.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
        active
          ? "bg-blue-600 text-white"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {label}
    </button>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-100 text-amber-700",
    accepted: "bg-blue-100 text-blue-700",
    completed: "bg-emerald-100 text-emerald-700",
    paid: "bg-purple-100 text-purple-700",
    declined: "bg-red-100 text-red-700",
  };

  const icons = {
    pending: <Clock size={12} />,
    accepted: <CheckCircle2 size={12} />,
    completed: <CheckCircle2 size={12} />,
    paid: <DollarSign size={12} />,
    declined: <X size={12} />,
  };

  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${styles[status] || styles.pending}`}>
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}