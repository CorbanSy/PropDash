// src/components/CustomerDashboard/CustomerSettings.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  MapPin,
  Bell,
  Lock,
  CreditCard,
  LogOut,
  Save,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  Home,
  Eye,
  EyeOff,
  Shield,
  Smartphone,
  Heart,
  Settings as SettingsIcon,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import useAuth from "../../hooks/useAuth";

export default function CustomerSettings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Customer data
  const [customerData, setCustomerData] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
  });

  // Password change
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    email_quotes: true,
    email_bookings: true,
    email_updates: true,
    sms_reminders: false,
    sms_updates: false,
  });

  // Fetch customer data
  useEffect(() => {
    async function fetchCustomer() {
      setLoading(true);
      const { data } = await supabase
        .from("customers")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setCustomerData(data);
      }
      setLoading(false);
    }
    if (user) fetchCustomer();
  }, [user]);

  // Update customer data
  const handleSaveProfile = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    const { error: updateError } = await supabase
      .from("customers")
      .update({
        full_name: customerData.full_name,
        phone: customerData.phone,
        address: customerData.address,
        city: customerData.city,
        state: customerData.state,
        zip_code: customerData.zip_code,
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
      <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium mb-2">Account</p>
            <h2 className="text-2xl font-bold mb-1">
              {customerData.full_name || "Customer"}
            </h2>
            <p className="text-green-100 text-sm">{user.email}</p>
            <div className="flex items-center gap-4 mt-4">
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/30">
                <p className="text-xs font-medium">Member Since</p>
                <p className="text-lg font-bold">
                  {new Date(user.created_at).getFullYear()}
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/30">
                <p className="text-xs font-medium">Account Type</p>
                <p className="text-lg font-bold">Customer</p>
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
          icon={<User size={18} />}
          label="Profile"
        />
        <TabButton
          active={activeTab === "location"}
          onClick={() => setActiveTab("location")}
          icon={<MapPin size={18} />}
          label="Location"
        />
        <TabButton
          active={activeTab === "notifications"}
          onClick={() => setActiveTab("notifications")}
          icon={<Bell size={18} />}
          label="Notifications"
        />
        <TabButton
          active={activeTab === "security"}
          onClick={() => setActiveTab("security")}
          icon={<Lock size={18} />}
          label="Security"
        />
        <TabButton
          active={activeTab === "payment"}
          onClick={() => setActiveTab("payment")}
          icon={<CreditCard size={18} />}
          label="Payment"
        />
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl">
        {activeTab === "profile" && (
          <ProfileTab
            customerData={customerData}
            setCustomerData={setCustomerData}
            user={user}
            handleSaveProfile={handleSaveProfile}
            saving={saving}
          />
        )}
        {activeTab === "location" && (
          <LocationTab
            customerData={customerData}
            setCustomerData={setCustomerData}
            handleSaveProfile={handleSaveProfile}
            saving={saving}
          />
        )}
        {activeTab === "notifications" && (
          <NotificationsTab
            notifications={notifications}
            setNotifications={setNotifications}
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
        {activeTab === "payment" && <PaymentTab />}
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
        active ? "text-green-600" : "text-slate-600 hover:text-slate-900"
      }`}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
      )}
    </button>
  );
}

// Profile Tab
function ProfileTab({ customerData, setCustomerData, user, handleSaveProfile, saving }) {
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-100 p-2.5 rounded-lg">
            <User className="text-green-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Personal Information
          </h3>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={customerData.full_name}
              onChange={(e) =>
                setCustomerData({ ...customerData, full_name: e.target.value })
              }
              className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
              placeholder="John Smith"
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
              Phone Number
            </label>
            <div className="relative">
              <Phone
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="tel"
                value={customerData.phone}
                onChange={(e) =>
                  setCustomerData({ ...customerData, phone: e.target.value })
                }
                className="w-full border-2 border-slate-300 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                placeholder="(555) 123-4567"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Used for service provider communication
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSaveProfile}
        disabled={saving}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
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

// Location Tab
function LocationTab({ customerData, setCustomerData, handleSaveProfile, saving }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-2.5 rounded-lg">
            <MapPin className="text-blue-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Service Address
          </h3>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Street Address
            </label>
            <div className="relative">
              <Home
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                value={customerData.address}
                onChange={(e) =>
                  setCustomerData({ ...customerData, address: e.target.value })
                }
                className="w-full border-2 border-slate-300 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                placeholder="123 Main Street"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={customerData.city}
                onChange={(e) =>
                  setCustomerData({ ...customerData, city: e.target.value })
                }
                className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                placeholder="San Francisco"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                State
              </label>
              <input
                type="text"
                value={customerData.state}
                onChange={(e) =>
                  setCustomerData({ ...customerData, state: e.target.value })
                }
                className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                placeholder="CA"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                value={customerData.zip_code}
                onChange={(e) =>
                  setCustomerData({ ...customerData, zip_code: e.target.value })
                }
                className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                placeholder="94102"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> This address will be used as the default
              service location for new job requests. You can always specify a
              different address when posting a job.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSaveProfile}
        disabled={saving}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
      >
        {saving ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Saving Changes...
          </>
        ) : (
          <>
            <Save size={20} />
            Save Location
          </>
        )}
      </button>
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
            <Mail className="text-blue-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Email Notifications
          </h3>
        </div>

        <div className="space-y-4">
          <NotificationToggle
            label="Quote Responses"
            description="Get notified when pros respond to your job requests"
            checked={notifications.email_quotes}
            onChange={() => toggleNotification("email_quotes")}
            icon={<Mail size={18} />}
          />
          <NotificationToggle
            label="Booking Confirmations"
            description="Receive updates when bookings are confirmed"
            checked={notifications.email_bookings}
            onChange={() => toggleNotification("email_bookings")}
            icon={<CheckCircle2 size={18} />}
          />
          <NotificationToggle
            label="Service Updates"
            description="Stay informed about your active jobs"
            checked={notifications.email_updates}
            onChange={() => toggleNotification("email_updates")}
            icon={<Bell size={18} />}
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
            label="Appointment Reminders"
            description="Get SMS reminders 1 hour before appointments"
            checked={notifications.sms_reminders}
            onChange={() => toggleNotification("sms_reminders")}
            icon={<Bell size={18} />}
          />
          <NotificationToggle
            label="Job Updates"
            description="Instant SMS for important job updates"
            checked={notifications.sms_updates}
            onChange={() => toggleNotification("sms_updates")}
            icon={<Smartphone size={18} />}
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
          checked ? "bg-green-600" : "bg-slate-300"
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
                className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
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
              className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
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
            <h3 className="text-lg font-semibold text-slate-900">Log Out</h3>
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

// Payment Tab
function PaymentTab() {
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
            Add credit cards to pay for services quickly and securely
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-100 p-2.5 rounded-lg">
            <Heart className="text-green-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Saved Professionals
          </h3>
        </div>

        <div className="text-center py-8">
          <p className="text-slate-600 text-sm">
            Save your favorite pros for quick booking
          </p>
          <button className="mt-4 text-green-600 font-semibold text-sm hover:text-green-700">
            Browse Pros →
          </button>
        </div>
      </div>
    </div>
  );
}