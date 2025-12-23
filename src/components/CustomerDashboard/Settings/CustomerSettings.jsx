//levlpro-mvp\src\components\CustomerDashboard\Settings\CustomerSettings.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  MapPin,
  Bell,
  Lock,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import useAuth from "../../../hooks/useAuth";
import ProfileTab from "./components/ProfileTab";
import LocationTab from "./components/LocationTab";
import NotificationsTab from "./components/NotificationsTab";
import SecurityTab from "./components/SecurityTab";
import PaymentTab from "./components/PaymentTab";

export default function CustomerSettings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Customer data
  const [customerData, setCustomerData] = useState({
    full_name: "",
    phone: "",
    phone_verified: false,
    profile_photo: null,
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
  const [showPassword, setShowPassword] = useState(false);

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
      if (!user) return;

      setLoading(true);
      
      try {
        const { data, error: fetchError } = await supabase
          .from("customers")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (fetchError) {
          console.error("Error fetching customer:", fetchError);
        }

        if (!data && user) {
          console.log("No customer record found, attempting to create one...");
          
          const { data: newCustomer, error: insertError } = await supabase
            .from("customers")
            .upsert(
              {
                id: user.id,
                full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer',
                phone: user.user_metadata?.phone || "",
                address: "",
                city: "",
                state: "",
                zip_code: "",
              },
              { 
                onConflict: 'id',
                ignoreDuplicates: false 
              }
            )
            .select()
            .single();

          if (insertError) {
            console.error("Error upserting customer:", insertError);
            
            const { data: retryData, error: retryError } = await supabase
              .from("customers")
              .select("*")
              .eq("id", user.id)
              .single();
            
            if (retryError) {
              console.error("Retry fetch error:", retryError);
              setError("Failed to load customer data");
            } else {
              setCustomerData(retryData || {
                full_name: "",
                phone: "",
                address: "",
                city: "",
                state: "",
                zip_code: "",
              });
            }
          } else {
            setCustomerData(newCustomer);
          }
        } else if (data) {
          setCustomerData(data);
        } else {
          setCustomerData({
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer',
            phone: user.user_metadata?.phone || "",
            address: "",
            city: "",
            state: "",
            zip_code: "",
          });
        }
      } catch (err) {
        console.error("Exception fetching customer:", err);
        setError("Failed to load customer data");
      } finally {
        setLoading(false);
      }
    }
    
    if (user) fetchCustomer();
  }, [user]);

  // Update customer data
  const handleSaveProfile = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
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

  // Logout
  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      await supabase.auth.signOut();
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-secondary-700">Loading settings...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-secondary-700">Please log in to view settings.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Settings</h1>
          <p className="text-secondary-600 mt-1">
            Manage your account and preferences
          </p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-success-50 border-2 border-success-200 text-success-800 p-4 rounded-xl flex items-center gap-3 shadow-card">
          <CheckCircle2 size={20} />
          <span className="font-semibold">{success}</span>
        </div>
      )}
      {error && (
        <div className="bg-error-50 border-2 border-error-200 text-error-800 p-4 rounded-xl flex items-center gap-3 shadow-card">
          <AlertTriangle size={20} />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Account Overview Card - PRIMARY GRADIENT */}
      <div className="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-primary-100 text-sm font-medium mb-2">Account</p>
            <h2 className="text-2xl font-bold mb-1">
              {customerData.full_name || user.email?.split('@')[0] || "Customer"}
            </h2>
            <p className="text-primary-100 text-sm">{user.email}</p>
            <div className="flex items-center gap-4 mt-4">
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/30">
                <p className="text-xs font-medium">Member Since</p>
                <p className="text-lg font-bold">
                  {new Date(user.created_at).getFullYear()}
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/30">
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

      {/* Tab Navigation - PRIMARY ACTIVE COLOR */}
      <div className="flex gap-2 border-b-2 border-secondary-200 overflow-x-auto">
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

// Tab Button Component - PRIMARY ACTIVE COLOR
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 font-semibold transition-all duration-300 relative whitespace-nowrap ${
        active ? "text-primary-600" : "text-secondary-600 hover:text-secondary-900"
      }`}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
      )}
    </button>
  );
}
