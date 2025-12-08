// src/components/ProviderDashboard/Clients/components/RevenueChart.jsx
import { BarChart3 } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { getRevenueByMonth, formatCurrency } from "../utils/clientCalculations";

export default function RevenueChart({ jobs }) {
  const data = getRevenueByMonth(jobs, 6);
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);

  return (
    <div className={`${theme.card.base} ${theme.card.padding}`}>
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="text-blue-600" size={20} />
        <h4 className={theme.text.h4}>Revenue Trend (Last 6 Months)</h4>
      </div>

      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-slate-700">{item.month}</span>
              <span className="text-sm font-bold text-slate-900">
                {formatCurrency(item.revenue)}
              </span>
            </div>
            <div className="h-8 bg-slate-100 rounded-lg overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {data.every(d => d.revenue === 0) && (
        <div className="text-center py-8 text-slate-500">
          <p>No revenue data for this period</p>
        </div>
      )}
    </div>
  );
}