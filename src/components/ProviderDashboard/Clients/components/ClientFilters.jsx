// src/components/ProviderDashboard/Clients/components/ClientFilters.jsx
import { theme } from "../../../../styles/theme";

export default function ClientFilters({ filters, setFilters, clients, jobs }) {
  // Get all unique tags
  const allTags = [...new Set(
    clients.flatMap(c => c.tags || [])
  )];

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
          <option value="all">All Clients</option>
          <option value="active">Active (90 days)</option>
          <option value="dormant">Dormant (90-180 days)</option>
          <option value="lost">Lost (180+ days)</option>
        </select>
      </div>

      {/* Tags Filter */}
      <div>
        <label className={theme.text.label}>Tags</label>
        <select
          multiple
          value={filters.tags}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions, option => option.value);
            setFilters({ ...filters, tags: selected });
          }}
          className={`${theme.input.base} ${theme.input.provider} mt-1`}
        >
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
        <p className="text-xs text-slate-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
      </div>

      {/* Min Spent Filter */}
      <div>
        <label className={theme.text.label}>Min Spent ($)</label>
        <input
          type="number"
          min="0"
          step="100"
          value={filters.minSpent}
          onChange={(e) => setFilters({ ...filters, minSpent: parseFloat(e.target.value) || 0 })}
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
          <option value="recent">Most Recent</option>
          <option value="spent">Highest Spending</option>
          <option value="jobs">Most Jobs</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>
    </div>
  );
}