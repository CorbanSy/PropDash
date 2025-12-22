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
  MapPin,
  Briefcase,
  Settings as SettingsIcon,
  FileCheck,
} from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import useAuth from "../../../hooks/useAuth";
import { theme } from "../../../styles/theme";
import ProfilePhotoUpload from "./components/ProfilePhotoUpload";
import PhoneVerification from "./components/PhoneVerification";
import ServiceAreas from "./components/ServiceAreas";
import ServicesOffered from "./components/ServicesOffered";
import DocumentCenter from "./components/DocumentCenter";
import StripeConnect from "./components/StripeConnect";
import AIQuotePreferences from "./components/AIQuotePreferences";
import AuditLog from "./components/AuditLog";
import Security from "./components/Security";

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

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

  // Notification preferences
  const [notifications, setNotifications] = useState({
    email_bookings: true,
    email_quotes: true,
    sms_bookings: false,
    sms_reminders: false,
  });

  // ✅✅✅ UPDATED: Fetch provider data with RLS fix
  useEffect(() => {
    async function fetchProvider() {
      if (!user) return;

      setLoading(true);
      
      try {
        // ✅ Use maybeSingle() instead of single()
        const { data, error: fetchError } = await supabase
          .from("providers")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (fetchError) {
          console.error("Error fetching provider:", fetchError);
        }

        // ✅ If no provider record exists, create one with upsert
        if (!data && user) {
          console.log("No provider record found, creating one...");
          
          const { data: newProvider, error: insertError } = await supabase
            .from("providers")
            .upsert(
              {
                id: user.id,
                business_name: user.user_metadata?.business_name || user.email?.split('@')[0] || 'Provider',
                phone: user.user_metadata?.phone || "",
                base_rate: 8500, // Default $85.00
                verification_status: 'pending',
                insurance_status: 'none',
                license_type: 'none',
                services_offered: [],
                service_categories: [],
                is_online: false,
                is_available: false,
              },
              { 
                onConflict: 'id',
                ignoreDuplicates: false 
              }
            )
            .select()
            .single();

          if (insertError) {
            console.error("Error upserting provider:", insertError);
            setError("Failed to load provider data");
          } else {
            setProviderData(newProvider);
          }
        } else if (data) {
          setProviderData(data);
        }
      } catch (err) {
        console.error("Exception fetching provider:", err);
        setError("Failed to load provider data");
      } finally {
        setLoading(false);
      }
    }
    
    if (user) fetchProvider();
  }, [user]);

  // Update provider data
  const handleSaveProfile = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
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
        console.error("Update error:", updateError);
      } else {
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error("Exception updating profile:", err);
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
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

    try {
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
    } catch (err) {
      console.error("Exception changing password:", err);
      setError("Failed to change password");
    }
  };

  // ✅ FIXED: Logout with correct route
  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      await supabase.auth.signOut();
      navigate("/login/professional");
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
    if (user) {
      console.log("🔄 Refreshing provider data...");
      supabase
        .from("providers")
        .select("*")
        .eq("id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            console.log("✅ Provider data refreshed:", data);
            console.log("📸 Profile photo URL:", data.profile_photo);
            setProviderData(data);
          }
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

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Please log in to view settings.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className={theme.text.h1}>Settings</h1>
          <p className={`${theme.text.body} mt-1`}>
            Manage your account and preferences
          </p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className={`${theme.alert.success} flex items-center gap-3`}>
          <CheckCircle2 size={20} />
          <span className="font-medium">{success}</span>
        </div>
      )}
      {error && (
        <div className={`${theme.alert.error} flex items-center gap-3`}>
          <AlertTriangle size={20} />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Account Overview Card */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl">
        {/* Gradient Background - Professional Theme */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-700 via-primary-800 to-primary-900" />

        {/* Subtle Glow */}
        <div className="absolute top-12 right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10 p-8 text-white flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Profile Photo */}
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 overflow-hidden">
              {providerData.profile_photo && providerData.profile_photo.startsWith('http') ? (
                <img
                  key={providerData.profile_photo}
                  src={`${providerData.profile_photo}?t=${Date.now()}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("❌ Failed to load profile photo:", providerData.profile_photo);
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={32} />
                </div>
              )}
            </div>

            <div>
              <p className="text-primary-100 text-sm font-medium mb-2">Account</p>
              <h2 className="text-2xl font-bold mb-1">
                {providerData.business_name || user.email?.split('@')[0] || "Provider"}
              </h2>
              <p className="text-primary-100 text-sm mb-2">{user.email}</p>

              {/* Verification Badges */}
              <div className="flex items-center gap-2">
                {providerData.phone_verified && (
                  <span className="text-xs bg-success-100 text-success-800 px-2 py-1 rounded font-medium">
                    ✓ Phone Verified
                  </span>
                )}
                {providerData.verification_status === "verified" && (
                  <span className="text-xs bg-success-100 text-success-800 px-2 py-1 rounded font-medium">
                    ✓ License Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
              <p className="text-xs font-medium mb-1">Base Rate</p>
              <p className="text-lg font-bold">${(providerData.base_rate / 100).toFixed(0)}/hr</p>
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
        <TabButton
          active={activeTab === "audit"}
          onClick={() => setActiveTab("audit")}
          icon={<Shield size={18} />}
          label="Activity Log"
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
          <Security
            user={user}
            providerData={providerData}
            onUpdate={refreshProviderData}
          />
        )}
        {activeTab === "billing" && (
          <BillingTab providerData={providerData} onUpdate={refreshProviderData} />
        )}
        {activeTab === "audit" && (
          <AuditLog providerData={providerData} />
        )}
      </div>
    </div>
  );
}

// Tab Button Component
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 font-semibold transition relative whitespace-nowrap ${
        active ? "text-primary-700" : "text-secondary-600 hover:text-secondary-900"
      }`}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-700"></div>
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

      {/* Business Information */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary-100 p-2.5 rounded-lg">
            <Building2 className="text-primary-600" size={20} />
          </div>
          <h3 className={theme.text.h4}>
            Business Information
          </h3>
        </div>

        <div className="space-y-5">
          <div>
            <label className={`${theme.text.label} block mb-2`}>
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
              className={`${theme.input.base} ${theme.input.focus}`}
              placeholder="John's Handyman Services"
            />
          </div>

          <div>
            <label className={`${theme.text.label} block mb-2`}>
              Base Hourly Rate (in cents)
            </label>
            <div className="relative">
              <DollarSign
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400"
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
                className={`${theme.input.base} ${theme.input.focus} pl-11`}
                placeholder="8500 (= $85.00/hr)"
              />
            </div>
            <p className={`${theme.text.caption} mt-1`}>
              Enter rate in cents (e.g., 8500 = $85.00/hr)
            </p>
          </div>
        </div>
      </div>

      {/* Booking Link */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-success-100 p-2.5 rounded-lg">
            <ExternalLink className="text-success-600" size={20} />
          </div>
          <h3 className={theme.text.h4}>
            Your Booking Link
          </h3>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={`${window.location.origin}/book/${user.id}`}
            readOnly
            className={`${theme.input.base} ${theme.input.disabled} flex-1`}
          />
          <button
            onClick={copyBookingLink}
            className={theme.button.primary}
          >
            <Copy size={18} />
            Copy
          </button>
        </div>
      </div>
      
      {/* Save Button */}
      <button
        onClick={handleSaveProfile}
        disabled={saving}
        className={`${theme.button.primary} w-full py-4 disabled:opacity-50 justify-center`}
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

// Security Tab
function SecurityTab({
  passwordData,
  setPasswordData,
  showPassword,
  setShowPassword,
  handleChangePassword,
  handleLogout,
}) {
  return (
    <div className="space-y-6">
      {/* Change Password */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-error-100 p-2.5 rounded-lg">
            <Lock className="text-error-600" size={20} />
          </div>
          <h3 className={theme.text.h4}>
            Change Password
          </h3>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-5">
          <div>
            <label className={`${theme.text.label} block mb-2`}>
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className={`${theme.input.base} ${theme.input.focus} pr-12`}
                placeholder="••••••••"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className={`${theme.text.label} block mb-2`}>
              Confirm New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
              className={`${theme.input.base} ${theme.input.focus}`}
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className={`${theme.button.primary} w-full justify-center`}
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Logout */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-error-100 p-2.5 rounded-lg">
            <LogOut className="text-error-600" size={20} />
          </div>
          <div>
            <h3 className={theme.text.h4}>Log Out</h3>
            <p className={theme.text.muted}>
              Sign out of your account on this device
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className={`${theme.button.dangerOutline} w-full justify-center`}
        >
          <LogOut size={20} />
          Log Out
        </button>
      </div>
    </div>
  );
}

// Enhanced Billing Tab
function BillingTab({ providerData, onUpdate }) {
  return (
    <div className="space-y-6">
      <StripeConnect
        providerData={providerData}
        onUpdate={onUpdate}
      />
    </div>
  );
}
