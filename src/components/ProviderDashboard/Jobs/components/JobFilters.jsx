//levlpro-mvp\src\components\ProviderDashboard\Jobs\components\JobFilters.jsx
import { theme } from "../../../../styles/theme";

export default function JobFilters({ filters, setFilters, jobs }) {
  // Get unique statuses from jobs
  const statuses = ["all", ...new Set(jobs.map(j => j.status))];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200 mt-4">
      {/* Status Filter */}
      <div>
        <label className={theme.text.label}>Status</label>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className={`${theme.input.base} ${theme.input.provider} mt-1`}
        >
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="paid">Paid</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Date Range */}
      <div>
        <label className={theme.text.label}>Date Range</label>
        <select
          value={filters.dateRange}
          onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
          className={`${theme.input.base} ${theme.input.provider} mt-1`}
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Min Amount */}
      <div>
        <label className={theme.text.label}>Min Amount ($)</label>
        <input
          type="number"
          min="0"
          step="10"
          value={filters.minAmount}
          onChange={(e) => setFilters({ ...filters, minAmount: parseFloat(e.target.value) || 0 })}
          className={`${theme.input.base} ${theme.input.provider} mt-1`}
          placeholder="0"
        />
      </div>

      {/* Sort By */}
      <div>
        <label className={theme.text.label}>Sort By</label>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          className={`${theme.input.base} ${theme.input.provider} mt-1`}
        >
          <option value="date_desc">Date (Newest First)</option>
          <option value="date_asc">Date (Oldest First)</option>
          <option value="amount_desc">Amount (Highest First)</option>
          <option value="amount_asc">Amount (Lowest First)</option>
        </select>
      </div>
    </div>
  );
}