import { useState } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import { theme } from "../../../../../styles/theme";

export default function ConnectionsSearch({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy,
  totalConnections,
  filteredCount,
}) {
  const [showDropdown, setShowDropdown] = useState(false);

  const sortOptions = [
    { value: "recent", label: "Most Recent" },
    { value: "name", label: "Name (A-Z)" },
    { value: "rating", label: "Highest Rated" },
    { value: "jobs", label: "Most Referrals" },
  ];

  const getSortLabel = () => {
    const option = sortOptions.find((opt) => opt.value === sortBy);
    return option ? option.label.split(" ")[0] : "Recent";
  };

  return (
    <div className={`${theme.card.base} ${theme.card.padding}`}>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search connections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${theme.input.base} ${theme.input.focus} pl-10`}
          />
        </div>

        {/* Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`${theme.input.base} ${theme.input.focus}`}
        >
          <option value="all">All Connections</option>
          <option value="active">Active Only</option>
          <option value="verified">Verified Only</option>
          <option value="online">Online Now</option>
        </select>

        {/* Sort */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`${theme.button.secondary} gap-2`}
          >
            <Filter size={18} />
            <span className="text-sm font-medium">Sort: {getSortLabel()}</span>
            <ChevronDown size={16} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 bg-white border-2 border-slate-200 rounded-lg shadow-lg z-10 min-w-[160px]">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className={`mt-3 ${theme.text.caption}`}>
        Showing {filteredCount} of {totalConnections} connections
      </div>
    </div>
  );
}