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
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${theme.input.base} ${theme.input.focus} pl-10`}
          />
        </div>

        {/* Service Filter */}
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className={`${theme.input.base} ${theme.input.focus}`}
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