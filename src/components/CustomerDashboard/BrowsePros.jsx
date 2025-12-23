//levlpro-mvp\src\components\CustomerDashboard\BrowsePros.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  MapPin,
  Star,
  DollarSign,
  CheckCircle2,
  Shield,
  ExternalLink,
  Briefcase,
  Award,
  TrendingUp,
  Users,
  ChevronDown,
  X,
  AlertTriangle,
  Home,
} from "lucide-react";
import { theme } from "../../styles/theme";
import { supabase } from "../../lib/supabaseClient";
import ProviderProfileModal from "./ProviderProfileModal";
import PostJobModal from "./MyJobs/components/PostJobModal/PostJobModal";
import useAuth from "../../hooks/useAuth";
import { SERVICE_CATEGORIES } from "../../constants/serviceCategories";

export default function BrowsePros() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLicense, setSelectedLicense] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [bookingProviderId, setBookingProviderId] = useState(null);
  const [bookingProviderName, setBookingProviderName] = useState(null);

  // Fetch providers
  useEffect(() => {
    async function fetchProviders() {
      const { data, error } = await supabase
        .from("providers")
        .select("*")
        .order("verification_status", { ascending: false }) // Verified first
        .order("created_at", { ascending: false });

      if (data) {
        setProviders(data);
        setFilteredProviders(data);
      }
      setLoading(false);
    }
    fetchProviders();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = providers;

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((provider) =>
        provider.service_categories?.includes(selectedCategory) ||
        provider.services_offered?.includes(selectedCategory)
      );
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((provider) =>
        provider.business_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        provider.service_area
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    // Verified only filter
    if (verifiedOnly) {
      filtered = filtered.filter(
        (provider) => provider.verification_status === "verified"
      );
    }

    // License filter
    if (selectedLicense !== "all") {
      filtered = filtered.filter(
        (provider) => provider.license_type === selectedLicense
      );
    }

    setFilteredProviders(filtered);
  }, [searchQuery, selectedCategory, selectedLicense, verifiedOnly, providers]);

  // Build categories with counts from SERVICE_CATEGORIES
  const categories = [
    { 
      id: "all", 
      name: "All Services", 
      icon: Home, 
      count: providers.length 
    },
    ...SERVICE_CATEGORIES.map(category => ({
      ...category,
      count: providers.filter(p => 
        p.service_categories?.includes(category.id) ||
        p.services_offered?.includes(category.id)
      ).length
    }))
  ];

  const verifiedCount = providers.filter(p => p.verification_status === "verified").length;
  const totalCount = providers.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-secondary-700">Loading providers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Browse Pros</h1>
        <p className="text-secondary-600 mt-1">
          Find trusted service professionals for your home projects
        </p>
      </div>

      {/* Stats Banner - Matching Home.jsx gradient style */}
      <div className="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatBadge icon={<Users size={20} />} value={totalCount} label="Total Pros" />
          <StatBadge
            icon={<CheckCircle2 size={20} />}
            value={verifiedCount}
            label="Verified Pros"
          />
          <StatBadge
            icon={<Star size={20} />}
            value="4.9★"
            label="Avg Rating"
          />
          <StatBadge
            icon={<TrendingUp size={20} />}
            value="10k+"
            label="Jobs Done"
          />
        </div>
      </div>

      {/* Search and Filters - Matching Home.jsx card style */}
      <div className="bg-white rounded-2xl border-2 border-secondary-200 shadow-card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by business name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${theme.input.base} ${theme.input.focus} pl-10`}
            />
          </div>

          {/* Filter Button (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`md:hidden ${theme.button.secondary} gap-2 justify-center`}
          >
            <Filter size={18} />
            Filters
            {(verifiedOnly || selectedLicense !== "all") && (
              <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                {(verifiedOnly ? 1 : 0) + (selectedLicense !== "all" ? 1 : 0)}
              </span>
            )}
          </button>

          {/* Desktop Filters */}
          <div className="hidden md:flex items-center gap-3">
            <label className="flex items-center gap-2 px-3 py-2 border-2 border-secondary-300 rounded-xl cursor-pointer hover:bg-secondary-50 transition-all duration-300">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
              />
              <CheckCircle2 size={16} className="text-success-600" />
              <span className="text-sm font-medium text-secondary-700">Verified Only</span>
            </label>
            
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-secondary-600" />
              <select
                value={selectedLicense}
                onChange={(e) => setSelectedLicense(e.target.value)}
                className={`${theme.input.base} ${theme.input.focus}`}
              >
                <option value="all">All Licenses</option>
                <option value="none">Unlicensed</option>
                <option value="c_class">C-Class</option>
                <option value="general">General (B)</option>
                <option value="specialty">Specialty</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Filters Dropdown */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-secondary-200 space-y-3 md:hidden">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-secondary-700">Show Verified Only</span>
            </label>
            
            <div>
              <label className="block text-sm font-semibold text-secondary-700 mb-2">
                License Type
              </label>
              <select
                value={selectedLicense}
                onChange={(e) => setSelectedLicense(e.target.value)}
                className={`${theme.input.base} ${theme.input.focus}`}
              >
                <option value="all">All Licenses</option>
                <option value="none">Unlicensed</option>
                <option value="c_class">C-Class</option>
                <option value="general">General (B)</option>
                <option value="specialty">Specialty</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-lg font-semibold text-secondary-900 mb-3">
          Browse by Category
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                  selectedCategory === category.id
                    ? "border-primary-600 bg-primary-50 shadow-lg"
                    : "border-secondary-200 bg-white hover:border-secondary-300 hover:shadow-card"
                }`}
              >
                <div className="mb-2">
                  <IconComponent 
                    size={24} 
                    className={selectedCategory === category.id ? "text-primary-600" : "text-secondary-600"} 
                  />
                </div>
                <div className="text-base font-semibold text-secondary-900 mb-1">
                  {category.name}
                </div>
                <div className="text-xs text-secondary-600">{category.count} pros</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-secondary-600">
          <span className="font-semibold text-secondary-900">
            {filteredProviders.length}
          </span>{" "}
          professionals found
          {verifiedOnly && (
            <span className="ml-2 text-xs bg-success-100 text-success-700 px-2 py-1 rounded-full font-semibold">
              Verified Only
            </span>
          )}
          {selectedCategory !== "all" && (
            <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-semibold">
              {categories.find(c => c.id === selectedCategory)?.name}
            </span>
          )}
        </p>
        {(searchQuery || selectedLicense !== "all" || verifiedOnly || selectedCategory !== "all") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedLicense("all");
              setVerifiedOnly(false);
            }}
            className="text-sm text-primary-700 hover:text-primary-800 font-semibold flex items-center gap-1 hover:underline transition"
          >
            <X size={14} />
            Clear Filters
          </button>
        )}
      </div>

      {/* Providers Grid */}
      {filteredProviders.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-secondary-200 shadow-card p-6 text-center py-12">
          <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-secondary-400" size={32} />
          </div>
          <p className="text-xl font-semibold text-secondary-900 mb-2">No pros found</p>
          <p className="text-secondary-600">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <ProviderCard 
              key={provider.id} 
              provider={provider}
              onViewClick={() => setSelectedProviderId(provider.id)}
              onBookClick={() => {
                setBookingProviderId(provider.id);
                setBookingProviderName(provider.business_name);
              }}
            />
          ))}
        </div>
      )}

      {/* Provider Profile Modal */}
      {selectedProviderId && (
        <ProviderProfileModal
          providerId={selectedProviderId}
          onClose={() => setSelectedProviderId(null)}
        />
      )}

      {/* Booking Modal */}
      {bookingProviderId && (
        <PostJobModal
          onClose={() => {
            setBookingProviderId(null);
            setBookingProviderName(null);
          }}
          onSuccess={() => {
            setBookingProviderId(null);
            setBookingProviderName(null);
            navigate('/customer/jobs');
          }}
          userId={user?.id}
          directProviderId={bookingProviderId}
          providerName={bookingProviderName}
        />
      )}
    </div>
  );
}

// Stat Badge Component - Matching Home.jsx style
function StatBadge({ icon, value, label }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
      <div className="flex items-center gap-2 mb-2 text-primary-100">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

// Provider Card Component - Matching Home.jsx card style
function ProviderCard({ provider, onViewClick, onBookClick }) {
  const getLicenseBadge = (licenseType) => {
    switch (licenseType) {
      case "c_class":
        return { text: "C-Class", color: "bg-primary-100 text-primary-700 border-primary-300" };
      case "general":
        return { text: "General (B)", color: "bg-purple-100 text-purple-700 border-purple-300" };
      case "specialty":
        return { text: "Specialty", color: "bg-warning-100 text-warning-700 border-warning-300" };
      default:
        return { text: "Unlicensed", color: "bg-secondary-100 text-secondary-700 border-secondary-300" };
    }
  };

  const license = getLicenseBadge(provider.license_type);
  const isVerified = provider.verification_status === "verified";

  // Mock data for demo (replace with real data from database)
  const mockRating = 4.8;
  const mockJobsCompleted = Math.floor(Math.random() * 100) + 20;
  const mockResponseTime = "< 2 hours";

  // Get initials for fallback avatar
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`bg-white rounded-2xl border-2 shadow-card p-6 hover:shadow-card-hover hover:border-secondary-300 transition-all duration-300 ${
      isVerified ? "border-success-200" : "border-secondary-200"
    }`}>
      {/* Header with Profile Picture */}
      <div className="flex items-start gap-3 mb-4">
        {/* Profile Picture */}
        <div className="relative flex-shrink-0">
          {provider.profile_photo ? (
            <img
              src={provider.profile_photo}
              alt={provider.business_name}
              className="w-14 h-14 rounded-full object-cover border-2 border-secondary-200"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg border-2 border-secondary-200">
              {getInitials(provider.business_name)}
            </div>
          )}
          {/* Verification Badge Overlay */}
          {isVerified && (
            <div className="absolute -bottom-1 -right-1 bg-success-500 rounded-full p-1 shadow-lg">
              <CheckCircle2 size={14} className="text-white" />
            </div>
          )}
        </div>

        {/* Name and Badges */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-secondary-900 mb-1 group-hover:text-primary-600 transition truncate">
            {provider.business_name}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-1 rounded-full font-semibold border ${license.color}`}>
              {license.text}
            </span>
            {provider.insurance_status !== "none" && (
              <span className="text-xs px-2 py-1 rounded-full font-semibold bg-success-100 text-success-700 border border-success-300 flex items-center gap-1">
                <Shield size={10} />
                Insured
              </span>
            )}
            {!isVerified && (
              <span className="text-xs px-2 py-1 rounded-full font-semibold bg-warning-100 text-warning-700 border border-warning-300 flex items-center gap-1">
                <AlertTriangle size={10} />
                Unverified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Service Area */}
      {provider.service_area && (
        <div className="flex items-center gap-2 text-sm text-secondary-600 mb-3">
          <MapPin size={14} />
          <span>{provider.service_area}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b-2 border-secondary-200">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
            <Star size={14} className="fill-yellow-500" />
            <span className="text-sm font-bold text-secondary-900">{mockRating}</span>
          </div>
          <div className="text-xs text-secondary-600">Rating</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-secondary-900 mb-1">
            {mockJobsCompleted}
          </div>
          <div className="text-xs text-secondary-600">Jobs</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-secondary-900 mb-1">
            {mockResponseTime}
          </div>
          <div className="text-xs text-secondary-600">Response</div>
        </div>
      </div>

      {/* Rate */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-secondary-600 mb-1">
          <DollarSign size={16} />
          <span>Base Rate</span>
        </div>
        <div className="text-2xl font-bold text-secondary-900">
          ${provider.base_rate ? (provider.base_rate / 100).toFixed(0) : "N/A"}
          {provider.base_rate && <span className="text-sm text-secondary-600 font-normal">/hr</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onBookClick}
          className="flex-1 bg-gradient-to-r from-success-600 to-emerald-600 text-white py-2.5 rounded-xl font-semibold hover:from-success-700 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-success-500/20 flex items-center justify-center gap-2 hover:scale-105"
        >
          <ExternalLink size={16} />
          Book Now
        </button>
        <button 
          onClick={onViewClick}
          className="px-4 py-2.5 border-2 border-secondary-300 text-secondary-700 rounded-xl font-semibold hover:bg-secondary-50 transition-all duration-300"
        >
          View
        </button>
      </div>

      {/* Verification Status */}
      <div className="mt-4 pt-4 border-t-2 border-secondary-200">
        {isVerified ? (
          <div className="flex items-center gap-2 text-sm text-success-600">
            <CheckCircle2 size={14} />
            <span className="font-semibold">Verified Professional</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-warning-600">
            <AlertTriangle size={14} />
            <span className="font-semibold">Verification Pending</span>
          </div>
        )}
      </div>
    </div>
  );
}