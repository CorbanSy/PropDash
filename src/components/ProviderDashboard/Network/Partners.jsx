// src/components/ProviderDashboard/Network/Partners.jsx
import { useState } from "react";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Briefcase,
  Clock,
  ShieldCheck,
  Users,
  TrendingUp,
  ExternalLink,
  MessageSquare,
  Phone,
  Mail,
  SlidersHorizontal,
} from "lucide-react";
import { theme } from "../../../styles/theme";
import PartnerCard from "./components/PartnerCard";
import PartnerProfile from "./components/PartnerProfile";
import { filterPartners, sortPartners } from "./utils/matchmakingAlgorithm";

export default function Partners({ partners, userId, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter State
  const [filters, setFilters] = useState({
    trade: "all",
    minRating: 0,
    verifiedOnly: false,
    availableNow: false,
    maxDistance: null,
  });

  // Sort State
  const [sortBy, setSortBy] = useState("rating");

  // Apply filters and sorting
  let filteredPartners = partners.filter((partner) => {
    const matchesSearch =
      partner.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.trade?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  filteredPartners = filterPartners(filteredPartners, filters);
  filteredPartners = sortPartners(filteredPartners, sortBy);

  // Get unique trades for filter
  const trades = ["all", ...new Set(partners.map((p) => p.trade).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Search & Filters Bar */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <div className="space-y-4">
          {/* Search Row */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search partners by name or trade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${theme.input.base} ${theme.input.provider} pl-10`}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`${theme.button.secondary} flex items-center gap-2`}
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
              {/* Trade Filter */}
              <div>
                <label className={theme.text.label}>Trade</label>
                <select
                  value={filters.trade}
                  onChange={(e) => setFilters({ ...filters, trade: e.target.value })}
                  className={`${theme.input.base} ${theme.input.provider} mt-1`}
                >
                  {trades.map((trade) => (
                    <option key={trade} value={trade}>
                      {trade === "all" ? "All Trades" : trade}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className={theme.text.label}>Minimum Rating</label>
                <select
                  value={filters.minRating}
                  onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
                  className={`${theme.input.base} ${theme.input.provider} mt-1`}
                >
                  <option value={0}>Any Rating</option>
                  <option value={3}>3+ Stars</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className={theme.text.label}>Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`${theme.input.base} ${theme.input.provider} mt-1`}
                >
                  <option value="rating">Highest Rating</option>
                  <option value="responseTime">Fastest Response</option>
                  <option value="jobsCompleted">Most Jobs</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>

              {/* Toggles */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.verifiedOnly}
                    onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm font-medium text-slate-700">Verified Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.availableNow}
                    onChange={(e) => setFilters({ ...filters, availableNow: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm font-medium text-slate-700">Available Now</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="text-blue-600" size={20} />
            <p className="text-sm text-blue-700 font-medium">Total Partners</p>
          </div>
          <p className="text-2xl font-bold text-blue-900">{partners.length}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="text-emerald-600" size={20} />
            <p className="text-sm text-emerald-700 font-medium">Verified</p>
          </div>
          <p className="text-2xl font-bold text-emerald-900">
            {partners.filter((p) => p.verified).length}
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="text-amber-600" size={20} />
            <p className="text-sm text-amber-700 font-medium">Avg Rating</p>
          </div>
          <p className="text-2xl font-bold text-amber-900">
            {partners.length > 0
              ? (partners.reduce((sum, p) => sum + (p.rating || 0), 0) / partners.length).toFixed(1)
              : "0.0"}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="text-purple-600" size={20} />
            <p className="text-sm text-purple-700 font-medium">Trades</p>
          </div>
          <p className="text-2xl font-bold text-purple-900">
            {new Set(partners.map((p) => p.trade)).size}
          </p>
        </div>
      </div>

      {/* Partners Grid */}
      {filteredPartners.length === 0 ? (
        <div className={`${theme.card.base} ${theme.card.padding} text-center py-12`}>
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-slate-400" size={32} />
          </div>
          <p className={`${theme.text.h4} mb-2`}>
            {searchQuery || showFilters ? "No Partners Match Filters" : "No Partners Yet"}
          </p>
          <p className={theme.text.body}>
            {searchQuery || showFilters
              ? "Try adjusting your search or filters"
              : "Invite pros to build your trusted network"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPartners.map((partner) => (
            <PartnerCard
              key={partner.id}
              partner={partner}
              onClick={() => setSelectedPartner(partner)}
            />
          ))}
        </div>
      )}

      {/* Partner Profile Modal */}
      {selectedPartner && (
        <PartnerProfile
          partner={selectedPartner}
          userId={userId}
          onClose={() => setSelectedPartner(null)}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
}