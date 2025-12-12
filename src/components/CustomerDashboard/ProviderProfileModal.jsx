//propdash-mvp\src\components\CustomerDashboard\ProviderProfileModal.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Star,
  MapPin,
  DollarSign,
  CheckCircle2,
  Shield,
  Clock,
  Calendar,
  Briefcase,
  Award,
  Phone,
  Mail,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import PostJobModal from "./MyJobs/components/PostJobModal/PostJobModal";
import useAuth from "../../hooks/useAuth";

export default function ProviderProfileModal({ providerId, onClose }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchProviderDetails();
  }, [providerId]);

  const fetchProviderDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("providers")
        .select("*")
        .eq("id", providerId)
        .single();

      if (error) throw error;
      setProvider(data);
    } catch (error) {
      console.error("Error fetching provider:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // ✅ FIXED: Handle messaging - use correct column names (customer_id, provider_id)
  const handleMessage = async () => {
    try {
      // Check if conversation already exists between customer and provider
      const { data: existingConversation, error: fetchError } = await supabase
        .from("conversations")
        .select("id")
        .eq("customer_id", user.id)
        .eq("provider_id", providerId)
        .maybeSingle(); // Use maybeSingle instead of single to avoid error if not found

      if (existingConversation) {
        // Navigate to existing conversation
        navigate(`/customer/messages?conversation=${existingConversation.id}`);
        onClose();
        return;
      }

      // Create new conversation
      const { data: newConversation, error: createError } = await supabase
        .from("conversations")
        .insert({
          customer_id: user.id,
          provider_id: providerId,
          last_message_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) throw createError;

      // Navigate to new conversation
      navigate(`/customer/messages?conversation=${newConversation.id}`);
      onClose();
    } catch (error) {
      console.error("Error handling message:", error);
      // Fallback: just navigate to messages page
      navigate("/customer/messages");
      onClose();
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md">
          <p className="text-slate-900 font-semibold mb-2">Provider not found</p>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const isVerified = provider.verification_status === "verified";
  const mockRating = 4.8;
  const mockJobsCompleted = Math.floor(Math.random() * 100) + 20;
  const mockResponseTime = "< 2 hours";

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col my-8 relative">
          {/* ✅ IMPROVED: X button now clearly visible and positioned better */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 bg-white hover:bg-slate-100 text-slate-700 p-2.5 rounded-full transition shadow-lg border border-slate-200"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10 pr-12">
              <div className="flex items-start gap-6">
                {/* Profile Photo */}
                <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 overflow-hidden flex-shrink-0">
                  {provider.profile_photo ? (
                    <img
                      src={provider.profile_photo}
                      alt={provider.business_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Briefcase size={40} className="text-white/60" />
                    </div>
                  )}
                </div>

                {/* Header Info */}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{provider.business_name}</h2>
                  
                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    {isVerified && (
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 border border-white/30">
                        <CheckCircle2 size={14} />
                        Verified
                      </span>
                    )}
                    {provider.insurance_status !== "none" && (
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 border border-white/30">
                        <Shield size={14} />
                        Insured
                      </span>
                    )}
                    {provider.license_type !== "none" && (
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium border border-white/30">
                        Licensed
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center gap-1 text-yellow-300 mb-1">
                        <Star size={16} className="fill-yellow-300" />
                        <span className="font-bold">{mockRating}</span>
                      </div>
                      <p className="text-xs text-blue-100">Rating</p>
                    </div>
                    <div>
                      <p className="font-bold text-lg mb-1">{mockJobsCompleted}</p>
                      <p className="text-xs text-blue-100">Jobs Completed</p>
                    </div>
                    <div>
                      <p className="font-bold text-lg mb-1">{mockResponseTime}</p>
                      <p className="text-xs text-blue-100">Response Time</p>
                    </div>
                  </div>
                </div>

                {/* Base Rate */}
                <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-xl border border-white/30 text-center">
                  <DollarSign size={20} className="mx-auto mb-1" />
                  <p className="text-2xl font-bold">${(provider.base_rate / 100).toFixed(0)}</p>
                  <p className="text-xs text-blue-100">per hour</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-slate-200 px-6 bg-white overflow-x-auto">
            <TabButton
              active={activeSection === "overview"}
              onClick={() => setActiveSection("overview")}
              label="Overview"
            />
            <TabButton
              active={activeSection === "services"}
              onClick={() => setActiveSection("services")}
              label="Services"
            />
            <TabButton
              active={activeSection === "availability"}
              onClick={() => setActiveSection("availability")}
              label="Availability"
            />
            <TabButton
              active={activeSection === "credentials"}
              onClick={() => setActiveSection("credentials")}
              label="Credentials"
            />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeSection === "overview" && (
              <OverviewSection provider={provider} mockRating={mockRating} mockJobsCompleted={mockJobsCompleted} />
            )}
            {activeSection === "services" && (
              <ServicesSection provider={provider} />
            )}
            {activeSection === "availability" && (
              <AvailabilitySection provider={provider} />
            )}
            {activeSection === "credentials" && (
              <CredentialsSection provider={provider} />
            )}
          </div>

          {/* Action Buttons */}
          <div className="border-t border-slate-200 p-6 bg-slate-50">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowBookingModal(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
              >
                <Calendar size={18} />
                Book Now
              </button>
              <button
                onClick={handleMessage}
                className="border-2 border-slate-300 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-2"
              >
                <MessageSquare size={18} />
                Message
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <PostJobModal
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false);
            onClose();
            navigate('/my-jobs');
          }}
          userId={user?.id}
          directProviderId={providerId}
          providerName={provider.business_name}
        />
      )}
    </>
  );
}

// Tab Button Component
function TabButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 font-semibold transition relative whitespace-nowrap ${
        active ? "text-blue-600" : "text-slate-600 hover:text-slate-900"
      }`}
    >
      {label}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
      )}
    </button>
  );
}

// Overview Section
function OverviewSection({ provider, mockRating, mockJobsCompleted }) {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<Star className="text-yellow-500" size={20} />}
          label="Average Rating"
          value={`${mockRating} / 5.0`}
          color="yellow"
        />
        <StatCard
          icon={<TrendingUp className="text-green-500" size={20} />}
          label="Jobs Completed"
          value={mockJobsCompleted}
          color="green"
        />
        <StatCard
          icon={<Clock className="text-blue-500" size={20} />}
          label="Member Since"
          value={new Date(provider.created_at).getFullYear()}
          color="blue"
        />
      </div>

      {/* About Section */}
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">About</h3>
        <p className="text-slate-600 leading-relaxed">
          Professional service provider with expertise in multiple home service categories. 
          Committed to quality work and customer satisfaction.
        </p>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h3>
        <div className="space-y-3">
          {provider.email && (
            <div className="flex items-center gap-3 text-slate-600">
              <Mail size={18} className="text-blue-600" />
              <span>{provider.email}</span>
            </div>
          )}
          {provider.phone && (
            <div className="flex items-center gap-3 text-slate-600">
              <Phone size={18} className="text-green-600" />
              <span>{provider.phone}</span>
              {provider.phone_verified && (
                <CheckCircle2 size={14} className="text-green-600" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Services Section
function ServicesSection({ provider }) {
  const services = provider.service_categories || [];
  
  const serviceIcons = {
    handyman: "🔧",
    plumbing: "🚰",
    electrical: "⚡",
    hvac: "❄️",
    carpentry: "🪚",
    painting: "🎨",
    landscaping: "🌳",
    cleaning: "🧹",
    assembly: "📦",
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Services Offered</h3>
        
        {services.length === 0 ? (
          <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-200">
            <Briefcase className="text-slate-400 mx-auto mb-3" size={32} />
            <p className="text-slate-600">No services listed yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white border-2 border-slate-200 rounded-xl p-4 hover:border-blue-300 transition"
              >
                <div className="text-3xl mb-2">{serviceIcons[service] || "🔨"}</div>
                <p className="font-semibold text-slate-900 capitalize">{service}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Service Areas */}
      {provider.service_areas && provider.service_areas.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Service Areas</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <MapPin className="text-blue-600 flex-shrink-0 mt-1" size={20} />
              <div className="flex-1">
                <p className="text-sm text-blue-900 font-medium mb-2">Serving</p>
                <div className="flex flex-wrap gap-2">
                  {provider.service_areas.map((area, index) => (
                    <span
                      key={index}
                      className="bg-white px-3 py-1 rounded-full text-sm text-blue-700 font-medium"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {provider.service_radius_km && (
            <p className="text-sm text-slate-600 mt-2 flex items-center gap-2">
              <MapPin size={14} />
              Service radius: {provider.service_radius_km} km
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Availability Section
function AvailabilitySection({ provider }) {
  const availability = provider.availability;
  
  const daysOfWeek = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Weekly Schedule</h3>
        
        {!availability ? (
          <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-200">
            <Clock className="text-slate-400 mx-auto mb-3" size={32} />
            <p className="text-slate-600">Schedule not set</p>
          </div>
        ) : (
          <div className="space-y-2">
            {daysOfWeek.map((day) => {
              const daySchedule = availability[day.key];
              const isAvailable = daySchedule?.available;
              
              return (
                <div
                  key={day.key}
                  className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between"
                >
                  <span className="font-medium text-slate-900">{day.label}</span>
                  {isAvailable ? (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-600">
                        {daySchedule.start} - {daySchedule.end}
                      </span>
                      <CheckCircle2 size={18} className="text-green-600" />
                    </div>
                  ) : (
                    <span className="text-sm text-slate-500">Unavailable</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Current Status */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-3 h-3 rounded-full ${provider.is_online ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
          <h3 className="text-lg font-semibold text-slate-900">
            {provider.is_online ? "Currently Online" : "Currently Offline"}
          </h3>
        </div>
        <p className="text-sm text-slate-600">
          {provider.is_online 
            ? "This provider is available to receive job requests"
            : "This provider is not currently accepting new jobs"}
        </p>
      </div>
    </div>
  );
}

// Credentials Section
function CredentialsSection({ provider }) {
  const isVerified = provider.verification_status === "verified";
  
  return (
    <div className="space-y-6">
      {/* Verification Status */}
      <div className={`rounded-xl p-6 border-2 ${
        isVerified 
          ? "bg-green-50 border-green-200" 
          : "bg-amber-50 border-amber-200"
      }`}>
        <div className="flex items-center gap-3 mb-2">
          {isVerified ? (
            <CheckCircle2 className="text-green-600" size={24} />
          ) : (
            <AlertTriangle className="text-amber-600" size={24} />
          )}
          <h3 className="text-lg font-semibold text-slate-900">
            {isVerified ? "Verified Professional" : "Verification Pending"}
          </h3>
        </div>
        <p className={`text-sm ${isVerified ? "text-green-700" : "text-amber-700"}`}>
          {isVerified 
            ? "This provider has been verified by PropDash and has submitted required documentation."
            : "This provider's credentials are currently being reviewed."}
        </p>
      </div>

      {/* License */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Award className="text-blue-600" size={20} />
          <h3 className="text-lg font-semibold text-slate-900">License</h3>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Type:</span>
            <span className="font-medium text-slate-900 capitalize">
              {provider.license_type === "none" ? "Unlicensed" : provider.license_type.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>

      {/* Insurance */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="text-purple-600" size={20} />
          <h3 className="text-lg font-semibold text-slate-900">Insurance</h3>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Status:</span>
            <span className="font-medium text-slate-900 capitalize">
              {provider.insurance_status === "none" ? "Not Insured" : provider.insurance_status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, color }) {
  const colors = {
    yellow: "bg-yellow-50 border-yellow-200",
    green: "bg-green-50 border-green-200",
    blue: "bg-blue-50 border-blue-200",
  };

  return (
    <div className={`${colors[color]} border rounded-xl p-4`}>
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="text-sm font-medium text-slate-600">{label}</span>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}