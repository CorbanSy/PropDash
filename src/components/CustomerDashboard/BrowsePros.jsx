// src/components/CustomerDashboard/BrowsePros.jsx
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
        <div className="text-slate-600">Loading providers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Browse Pros</h1>
        <p className="text-slate-600 mt-1">
          Find trusted service professionals for your home projects
        </p>
      </div>

      {/* Stats Banner */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
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

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by business name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Filter Button (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
          >
            <Filter size={18} />
            Filters
            {(verifiedOnly || selectedLicense !== "all") && (
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                {(verifiedOnly ? 1 : 0) + (selectedLicense !== "all" ? 1 : 0)}
              </span>
            )}
          </button>

          {/* Desktop Filters */}
          <div className="hidden md:flex items-center gap-3">
            <label className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <CheckCircle2 size={16} className="text-green-600" />
              <span className="text-sm font-medium text-slate-700">Verified Only</span>
            </label>
            
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-slate-600" />
              <select
                value={selectedLicense}
                onChange={(e) => setSelectedLicense(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-3 md:hidden">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700">Show Verified Only</span>
            </label>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                License Type
              </label>
              <select
                value={selectedLicense}
                onChange={(e) => setSelectedLicense(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
        <h3 className="text-sm font-semibold text-slate-700 mb-3">
          Browse by Category
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-xl border-2 transition text-left ${
                  selectedCategory === category.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="mb-2">
                  <IconComponent 
                    size={24} 
                    className={selectedCategory === category.id ? "text-blue-600" : "text-slate-600"} 
                  />
                </div>
                <div className="font-semibold text-sm text-slate-900 mb-1">
                  {category.name}
                </div>
                <div className="text-xs text-slate-600">{category.count} pros</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-900">
            {filteredProviders.length}
          </span>{" "}
          professionals found
          {verifiedOnly && (
            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Verified Only
            </span>
          )}
          {selectedCategory !== "all" && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
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
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            <X size={14} />
            Clear Filters
          </button>
        )}
      </div>

      {/* Providers Grid */}
      {filteredProviders.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-slate-400" size={32} />
          </div>
          <p className="text-slate-900 font-semibold mb-2">No pros found</p>
          <p className="text-slate-600 text-sm">
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
            // Optionally navigate to My Jobs
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

// Stat Badge Component
function StatBadge({ icon, value, label }) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">{icon}</div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-blue-100">{label}</div>
      </div>
    </div>
  );
}

// Provider Card Component
function ProviderCard({ provider, onViewClick, onBookClick }) {
  const navigate = useNavigate();

  const getLicenseBadge = (licenseType) => {
    switch (licenseType) {
      case "c_class":
        return { text: "C-Class", color: "bg-blue-100 text-blue-700" };
      case "general":
        return { text: "General (B)", color: "bg-purple-100 text-purple-700" };
      case "specialty":
        return { text: "Specialty", color: "bg-orange-100 text-orange-700" };
      default:
        return { text: "Unlicensed", color: "bg-slate-100 text-slate-700" };
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
    <div className={`bg-white rounded-xl border-2 p-6 hover:shadow-lg transition group ${
      isVerified ? "border-green-200" : "border-slate-200"
    }`}>
      {/* Header with Profile Picture */}
      <div className="flex items-start gap-3 mb-4">
        {/* Profile Picture */}
        <div className="relative flex-shrink-0">
          {provider.profile_photo ? (
            <img
              src={provider.profile_photo}
              alt={provider.business_name}
              className="w-14 h-14 rounded-full object-cover border-2 border-slate-200"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg border-2 border-slate-200">
              {getInitials(provider.business_name)}
            </div>
          )}
          {/* Verification Badge Overlay */}
          {isVerified && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
              <CheckCircle2 size={14} className="text-white" />
            </div>
          )}
        </div>

        {/* Name and Badges */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-blue-600 transition truncate">
            {provider.business_name}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${license.color}`}>
              {license.text}
            </span>
            {provider.insurance_status !== "none" && (
              <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700 flex items-center gap-1">
                <Shield size={10} />
                Insured
              </span>
            )}
            {!isVerified && (
              <span className="text-xs px-2 py-1 rounded-full font-medium bg-amber-100 text-amber-700 flex items-center gap-1">
                <AlertTriangle size={10} />
                Unverified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Service Area */}
      {provider.service_area && (
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
          <MapPin size={14} />
          <span>{provider.service_area}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-slate-200">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
            <Star size={14} className="fill-yellow-500" />
            <span className="text-sm font-bold text-slate-900">{mockRating}</span>
          </div>
          <div className="text-xs text-slate-600">Rating</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-slate-900 mb-1">
            {mockJobsCompleted}
          </div>
          <div className="text-xs text-slate-600">Jobs</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-slate-900 mb-1">
            {mockResponseTime}
          </div>
          <div className="text-xs text-slate-600">Response</div>
        </div>
      </div>

      {/* Rate */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-slate-600 mb-1">
          <DollarSign size={16} />
          <span className="text-sm">Base Rate</span>
        </div>
        <div className="text-2xl font-bold text-slate-900">
          ${provider.base_rate ? (provider.base_rate / 100).toFixed(0) : "N/A"}
          {provider.base_rate && <span className="text-sm font-normal text-slate-600">/hr</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onBookClick}
          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
        >
          <ExternalLink size={16} />
          Book Now
        </button>
        <button 
          onClick={onViewClick}
          className="px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
        >
          View
        </button>
      </div>

      {/* Verification Status */}
      <div className="mt-4 pt-4 border-t border-slate-200">
        {isVerified ? (
          <div className="flex items-center gap-2 text-xs text-green-600">
            <CheckCircle2 size={14} />
            <span className="font-medium">Verified Professional</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-amber-600">
            <AlertTriangle size={14} />
            <span className="font-medium">Verification Pending</span>
          </div>
        )}
      </div>
    </div>
  );
}