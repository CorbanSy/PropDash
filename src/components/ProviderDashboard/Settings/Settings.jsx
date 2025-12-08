// src/components/ProviderDashboard/Settings/Settings.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Building2,
  DollarSign,
  Shield,
  FileText,
  Lock,
  LogOut,
  Save,
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  Bell,
  CreditCard,
  Upload,
  Smartphone,
  Mail,
  Eye,
  EyeOff,
  Clock,
  MapPin,
  Briefcase,
  Settings as SettingsIcon,
  FileCheck,
} from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import useAuth from "../../../hooks/useAuth";
import ProfilePhotoUpload from "./components/ProfilePhotoUpload";
import PhoneVerification from "./components/PhoneVerification";
import AvailabilitySettings from "./components/AvailabilitySettings";
import ServiceAreas from "./components/ServiceAreas";
import ServicesOffered from "./components/ServicesOffered";
import DocumentCenter from "./components/DocumentCenter";
import StripeConnect from "./components/StripeConnect";
import AIQuotePreferences from "./components/AIQuotePreferences";
import AuditLog from "./components/AuditLog";

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Provider data
  const [providerData, setProviderData] = useState({
    business_name: "",
    profile_photo: null,
    phone: "",
    phone_verified: false,
    base_rate: 85,
    license_type: "none",
    verification_status: "pending",
    insurance_status: "none",
    services_offered: [],
    service_areas: [],
    availability: null,
    ai_preferences: null,
    stripe_connected: false,
  });

  // Password change
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    email_bookings: true,
    email_quotes: true,
    sms_bookings: false,
    sms_reminders: false,
  });

  // Fetch provider data
  useEffect(() => {
    async function fetchProvider() {
      setLoading(true);
      const { data } = await supabase
        .from("providers")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProviderData(data);
      }
      setLoading(false);
    }
    if (user) fetchProvider();
  }, [user]);

  // Update provider data
  const handleSaveProfile = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    const { error: updateError } = await supabase
      .from("providers")
      .update({
        business_name: providerData.business_name,
        phone: providerData.phone,
        base_rate: providerData.base_rate,
        license_type: providerData.license_type,
        insurance_status: providerData.insurance_status,
      })
      .eq("id", user.id);

    if (updateError) {
      setError("Failed to update profile");
    } else {
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    }
    setSaving(false);
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: passwordData.newPassword,
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess("Password changed successfully!");
      setPasswordData({ newPassword: "", confirmPassword: "" });
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  // Logout
  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      await supabase.auth.signOut();
      navigate("/login");
    }
  };

  // Copy booking link
  const copyBookingLink = () => {
    const link = `${window.location.origin}/book/${user.id}`;
    navigator.clipboard.writeText(link);
    setSuccess("Booking link copied!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const refreshProviderData = () => {
    // Refetch provider data
    if (user) {
      supabase
        .from("providers")
        .select("*")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data) setProviderData(data);
        });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-1">
            Manage your account and preferences
          </p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl flex items-center gap-3">
          <CheckCircle2 size={20} />
          <span className="font-medium">{success}</span>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center gap-3">
          <AlertTriangle size={20} />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Account Overview Card */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Profile Photo */}
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 overflow-hidden">
              {providerData.profile_photo ? (
                <img
                  src={providerData.profile_photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={32} />
                </div>
              )}
            </div>

            <div>
              <p className="text-blue-100 text-sm font-medium mb-2">Account</p>
              <h2 className="text-2xl font-bold mb-1">
                {providerData.business_name}
              </h2>
              <p className="text-blue-100 text-sm mb-2">{user.email}</p>
              
              {/* Verification Badges */}
              <div className="flex items-center gap-2">
                {providerData.phone_verified && (
                  <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded border border-white/30">
                    ✓ Phone Verified
                  </span>
                )}
                {providerData.verification_status === "verified" && (
                  <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded border border-white/30">
                    ✓ License Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
              <p className="text-xs font-medium mb-1">Base Rate</p>
              <p className="text-lg font-bold">${providerData.base_rate}/hr</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        <TabButton
          active={activeTab === "profile"}
          onClick={() => setActiveTab("profile")}
          icon={<Building2 size={18} />}
          label="Profile"
        />
        <TabButton
          active={activeTab === "availability"}
          onClick={() => setActiveTab("availability")}
          icon={<Clock size={18} />}
          label="Availability"
        />
        <TabButton
          active={activeTab === "services"}
          onClick={() => setActiveTab("services")}
          icon={<Briefcase size={18} />}
          label="Services"
        />
        <TabButton
          active={activeTab === "areas"}
          onClick={() => setActiveTab("areas")}
          icon={<MapPin size={18} />}
          label="Service Areas"
        />
        <TabButton
          active={activeTab === "documents"}
          onClick={() => setActiveTab("documents")}
          icon={<FileCheck size={18} />}
          label="Documents"
        />
        <TabButton
          active={activeTab === "ai"}
          onClick={() => setActiveTab("ai")}
          icon={<SettingsIcon size={18} />}
          label="AI Preferences"
        />
        <TabButton
          active={activeTab === "security"}
          onClick={() => setActiveTab("security")}
          icon={<Lock size={18} />}
          label="Security"
        />
        <TabButton
          active={activeTab === "billing"}
          onClick={() => setActiveTab("billing")}
          icon={<CreditCard size={18} />}
          label="Billing"
        />
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl">
        {activeTab === "profile" && (
          <ProfileTab
            providerData={providerData}
            setProviderData={setProviderData}
            user={user}
            copyBookingLink={copyBookingLink}
            handleSaveProfile={handleSaveProfile}
            saving={saving}
            refreshProviderData={refreshProviderData}
          />
        )}
        {activeTab === "availability" && (
          <AvailabilitySettings
            providerData={providerData}
            onUpdate={refreshProviderData}
          />
        )}
        {activeTab === "services" && (
          <ServicesOffered
            providerData={providerData}
            onUpdate={refreshProviderData}
          />
        )}
        {activeTab === "areas" && (
          <ServiceAreas
            providerData={providerData}
            onUpdate={refreshProviderData}
          />
        )}
        {activeTab === "documents" && (
          <DocumentCenter
            providerData={providerData}
            onUpdate={refreshProviderData}
          />
        )}
        {activeTab === "ai" && (
          <AIQuotePreferences
            providerData={providerData}
            onUpdate={refreshProviderData}
          />
        )}
        {activeTab === "security" && (
          <SecurityTab
            passwordData={passwordData}
            setPasswordData={setPasswordData}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            handleChangePassword={handleChangePassword}
            handleLogout={handleLogout}
          />
        )}
        {activeTab === "billing" && (
          <BillingTab providerData={providerData} onUpdate={refreshProviderData} />
        )}
      </div>
    </div>
  );
}

// Tab Button Component (same as before)
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 font-medium transition relative whitespace-nowrap ${
        active ? "text-blue-600" : "text-slate-600 hover:text-slate-900"
      }`}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
      )}
    </button>
  );
}

// Enhanced Profile Tab
function ProfileTab({
  providerData,
  setProviderData,
  user,
  copyBookingLink,
  handleSaveProfile,
  saving,
  refreshProviderData,
}) {
  return (
    <div className="space-y-6">
      {/* Profile Photo Upload */}
      <ProfilePhotoUpload
        currentPhoto={providerData.profile_photo}
        userId={user.id}
        onUploadSuccess={refreshProviderData}
      />

      {/* Phone Verification */}
      <PhoneVerification
        currentPhone={providerData.phone}
        phoneVerified={providerData.phone_verified}
        userId={user.id}
        onVerificationSuccess={refreshProviderData}
      />

      {/* Business Information (same as before) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-2.5 rounded-lg">
            <Building2 className="text-blue-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Business Information
          </h3>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Business Name
            </label>
            <input
              type="text"
              value={providerData.business_name}
              onChange={(e) =>
                setProviderData({
                  ...providerData,
                  business_name: e.target.value,
                })
              }
              className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="John's Handyman Services"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Base Hourly Rate
            </label>
            <div className="relative">
              <DollarSign
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="number"
                min="0"
                value={providerData.base_rate}
                onChange={(e) =>
                  setProviderData({
                    ...providerData,
                    base_rate: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full border-2 border-slate-300 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rest of Profile Tab content... (compliance, insurance, booking link) */}
      
      {/* Save Button */}
      <button
        onClick={handleSaveProfile}
        disabled={saving}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
      >
        {saving ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Saving Changes...
          </>
        ) : (
          <>
            <Save size={20} />
            Save All Changes
          </>
        )}
      </button>
    </div>
  );
}

// Security Tab (same as before)
function SecurityTab({
  passwordData,
  setPasswordData,
  showPassword,
  setShowPassword,
  handleChangePassword,
  handleLogout,
}) {
  // ... (keep existing SecurityTab code)
}

// Enhanced Billing Tab
function BillingTab({ providerData, onUpdate }) {
  return (
    <div className="space-y-6">
      <StripeConnect
        providerData={providerData}
        onUpdate={onUpdate}
      />

      {/* Subscription info (keep existing) */}
    </div>
  );
}