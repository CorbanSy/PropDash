// src/components/ProviderDashboard/Network/components/Discover/SearchFilters.jsx
import { Search } from "lucide-react";
import { theme } from "../../../../../styles/theme";

export default function SearchFilters({
  searchQuery,
  setSearchQuery,
  selectedService,
  setSelectedService,
  serviceCategories,
}) {
  return (
    <div className={`${theme.card.base} ${theme.card.padding}`}>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Service Filter */}
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="border-2 border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="all">All Services</option>
          {serviceCategories
            .filter((cat) => cat !== "all")
            .map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}