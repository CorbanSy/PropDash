// src/components/ProviderDashboard/Settings.jsx
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
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import useAuth from "../../hooks/useAuth";

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile"); // 'profile', 'security', 'notifications', 'billing'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Provider data
  const [providerData, setProviderData] = useState({
    business_name: "",
    base_rate: 85,
    license_type: "none",
    verification_status: "pending",
    insurance_status: "none",
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
          <div>
            <p className="text-blue-100 text-sm font-medium mb-2">Account</p>
            <h2 className="text-2xl font-bold mb-1">
              {providerData.business_name}
            </h2>
            <p className="text-blue-100 text-sm">{user.email}</p>
            <div className="flex items-center gap-4 mt-4">
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/30">
                <p className="text-xs font-medium">Base Rate</p>
                <p className="text-lg font-bold">${providerData.base_rate}/hr</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/30">
                <p className="text-xs font-medium">Status</p>
                <p className="text-lg font-bold capitalize">
                  {providerData.verification_status}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/30">
            <User size={32} />
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
          active={activeTab === "security"}
          onClick={() => setActiveTab("security")}
          icon={<Lock size={18} />}
          label="Security"
        />
        <TabButton
          active={activeTab === "notifications"}
          onClick={() => setActiveTab("notifications")}
          icon={<Bell size={18} />}
          label="Notifications"
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
        {activeTab === "notifications" && (
          <NotificationsTab
            notifications={notifications}
            setNotifications={setNotifications}
          />
        )}
        {activeTab === "billing" && <BillingTab />}
      </div>
    </div>
  );
}

// Tab Button Component
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

// Profile Tab
function ProfileTab({
  providerData,
  setProviderData,
  user,
  copyBookingLink,
  handleSaveProfile,
  saving,
}) {
  return (
    <div className="space-y-6">
      {/* Business Information */}
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
              Email Address
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 text-slate-500 cursor-not-allowed"
            />
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <Mail size={12} />
              Contact support to change your email
            </p>
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
                placeholder="85"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Used to calculate labor costs in AI-generated quotes
            </p>
          </div>
        </div>
      </div>

      {/* Compliance & License */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-2.5 rounded-lg">
            <Shield className="text-purple-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Compliance & Licensing
          </h3>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              License Type
            </label>
            <select
              value={providerData.license_type}
              onChange={(e) =>
                setProviderData({
                  ...providerData,
                  license_type: e.target.value,
                })
              }
              className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            >
              <option value="none">Unlicensed Handyman</option>
              <option value="c_class">C-Class Contractor</option>
              <option value="general">General Contractor (B)</option>
              <option value="specialty">Specialty License</option>
            </select>
          </div>

          {providerData.license_type === "none" && (
            <div className="bg-amber-50 border-2 border-amber-200 text-amber-800 p-5 rounded-xl flex items-start gap-3">
              <AlertTriangle className="flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm">
                <p className="font-bold mb-2">$1,000 Job Limit Active</p>
                <p className="leading-relaxed">
                  California AB 2622: Unlicensed providers cannot accept jobs
                  over $1,000 (including labor and materials). PropDash
                  automatically enforces this limit in the Quote Builder.
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Verification Status
            </label>
            <div className="flex items-center gap-3">
              <span
                className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 ${
                  providerData.verification_status === "verified"
                    ? "bg-green-100 text-green-800 border-green-200"
                    : providerData.verification_status === "pending"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                    : "bg-slate-100 text-slate-800 border-slate-200"
                }`}
              >
                {providerData.verification_status === "verified"
                  ? "✓ Verified"
                  : providerData.verification_status === "pending"
                  ? "⏳ Pending Review"
                  : "Not Verified"}
              </span>
            </div>
            {providerData.verification_status !== "verified" && (
              <button className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                <Upload size={14} />
                Upload License Documents
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Insurance */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-100 p-2.5 rounded-lg">
            <FileText className="text-green-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Insurance</h3>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Insurance Status
            </label>
            <select
              value={providerData.insurance_status}
              onChange={(e) =>
                setProviderData({
                  ...providerData,
                  insurance_status: e.target.value,
                })
              }
              className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            >
              <option value="none">No Insurance</option>
              <option value="active">Active Policy (Uploaded)</option>
              <option value="pay_as_you_go">Pay-As-You-Go Insurance</option>
            </select>
          </div>

          {providerData.insurance_status === "none" && (
            <div className="bg-blue-50 border-2 border-blue-200 text-blue-800 p-5 rounded-xl">
              <p className="font-bold mb-2">Enable Pay-As-You-Go Insurance</p>
              <p className="text-sm mb-3 leading-relaxed">
                Get covered for each job without an annual policy. Insurance
                costs are automatically added to your quotes.
              </p>
              <button className="text-blue-600 font-semibold hover:text-blue-700 text-sm flex items-center gap-1">
                Learn More
                <ExternalLink size={14} />
              </button>
            </div>
          )}

          {providerData.insurance_status === "active" && (
            <div className="bg-green-50 border-2 border-green-200 text-green-800 p-5 rounded-xl">
              <p className="font-bold flex items-center gap-2 mb-1">
                <CheckCircle2 size={18} />
                Insurance Policy Active
              </p>
              <p className="text-sm">
                Your certificate of insurance has been verified
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Link */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-indigo-100 p-2.5 rounded-lg">
            <ExternalLink className="text-indigo-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Your Booking Link
          </h3>
        </div>

        <p className="text-sm text-slate-600 mb-4">
          Share this link with clients so they can book appointments directly
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={`${window.location.origin}/book/${user.id}`}
            readOnly
            className="flex-1 border-2 border-slate-300 rounded-xl px-4 py-3 bg-slate-50 text-slate-700 text-sm font-mono"
          />
          <button
            onClick={copyBookingLink}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition flex items-center gap-2 font-semibold shadow-lg shadow-blue-500/30"
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
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-red-100 p-2.5 rounded-lg">
            <Lock className="text-red-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Change Password
          </h3>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                placeholder="••••••••"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <Shield size={12} />
              Must be at least 6 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
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
              className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Logout */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 p-2.5 rounded-lg">
            <LogOut className="text-red-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Log Out
            </h3>
            <p className="text-sm text-slate-600">
              Sign out of your account on this device
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full border-2 border-red-300 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 transition flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          Log Out
        </button>
      </div>
    </div>
  );
}

// Notifications Tab
function NotificationsTab({ notifications, setNotifications }) {
  const toggleNotification = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-2.5 rounded-lg">
            <Bell className="text-blue-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Email Notifications
          </h3>
        </div>

        <div className="space-y-4">
          <NotificationToggle
            label="New Bookings"
            description="Get notified when clients book through your link"
            checked={notifications.email_bookings}
            onChange={() => toggleNotification("email_bookings")}
            icon={<Mail size={18} />}
          />
          <NotificationToggle
            label="Quote Responses"
            description="Receive updates when clients respond to quotes"
            checked={notifications.email_quotes}
            onChange={() => toggleNotification("email_quotes")}
            icon={<FileText size={18} />}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-100 p-2.5 rounded-lg">
            <Smartphone className="text-green-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            SMS Notifications
          </h3>
        </div>

        <div className="space-y-4">
          <NotificationToggle
            label="Booking Alerts"
            description="Instant SMS when someone books"
            checked={notifications.sms_bookings}
            onChange={() => toggleNotification("sms_bookings")}
            icon={<Smartphone size={18} />}
          />
          <NotificationToggle
            label="Reminders"
            description="Get reminders 1 hour before appointments"
            checked={notifications.sms_reminders}
            onChange={() => toggleNotification("sms_reminders")}
            icon={<Bell size={18} />}
          />
        </div>
      </div>
    </div>
  );
}

// Notification Toggle Component
function NotificationToggle({ label, description, checked, onChange, icon }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-slate-200 last:border-0">
      <div className="flex items-start gap-3 flex-1">
        <div className="text-slate-600 mt-1">{icon}</div>
        <div>
          <p className="font-medium text-slate-900">{label}</p>
          <p className="text-sm text-slate-600 mt-0.5">{description}</p>
        </div>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

// Billing Tab
function BillingTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-2.5 rounded-lg">
            <CreditCard className="text-purple-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Payment Methods
          </h3>
        </div>

        <div className="text-center py-12">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="text-slate-400" size={32} />
          </div>
          <p className="text-slate-900 font-semibold mb-2">
            Payment settings coming soon
          </p>
          <p className="text-slate-600 text-sm">
            Connect Stripe to receive payments from clients
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-100 p-2.5 rounded-lg">
            <DollarSign className="text-green-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Subscription
          </h3>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold text-slate-900 mb-1">Free Plan</p>
              <p className="text-sm text-slate-600">
                Currently on the free tier
              </p>
            </div>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
              ACTIVE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}