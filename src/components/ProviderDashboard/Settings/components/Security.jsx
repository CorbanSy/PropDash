// src/components/ProviderDashboard/Settings/components/Security.jsx
import { useState } from "react";
import {
  Lock,
  Mail,
  Shield,
  LogOut,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  UserX,
  Trash2,
} from "lucide-react";
import { supabase } from "../../../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Security({ user, providerData, onUpdate }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Password change state
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Email change state
  const [emailData, setEmailData] = useState({
    newEmail: "",
    confirmNewEmail: "",
  });

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Deactivation state
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  // Change Password
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

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (updateError) throw updateError;

      setSuccess("Password changed successfully!");
      setPasswordData({ newPassword: "", confirmPassword: "" });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Password change error:", err);
      setError(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  // Change Email
  const handleChangeEmail = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (emailData.newEmail !== emailData.confirmNewEmail) {
      setError("Email addresses do not match");
      return;
    }

    if (!emailData.newEmail.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (emailData.newEmail === user.email) {
      setError("New email is the same as current email");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        email: emailData.newEmail,
      });

      if (updateError) throw updateError;

      setSuccess(
        "Verification email sent! Please check your new email inbox to confirm the change."
      );
      setEmailData({ newEmail: "", confirmNewEmail: "" });
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      console.error("Email change error:", err);
      setError(err.message || "Failed to change email");
    } finally {
      setLoading(false);
    }
  };

  // Toggle 2FA
  const handleToggle2FA = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Update provider settings
      const { error: updateError } = await supabase
        .from("providers")
        .update({ two_factor_enabled: !twoFactorEnabled })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setTwoFactorEnabled(!twoFactorEnabled);
      setSuccess(
        !twoFactorEnabled
          ? "Two-factor authentication enabled!"
          : "Two-factor authentication disabled"
      );
      setTimeout(() => setSuccess(""), 3000);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("2FA toggle error:", err);
      setError("Failed to update two-factor authentication");
    } finally {
      setLoading(false);
    }
  };

  // Deactivate Account
  const handleDeactivateAccount = async () => {
    if (confirmText !== "DEACTIVATE") {
      setError('Please type "DEACTIVATE" to confirm');
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Set provider as inactive
      const { error: updateError } = await supabase
        .from("providers")
        .update({
          is_active: false,
          is_available: false,
          deactivated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // Log out user
      await supabase.auth.signOut();
      navigate("/login/professional");
    } catch (err) {
      console.error("Deactivation error:", err);
      setError("Failed to deactivate account");
    } finally {
      setLoading(false);
    }
  };

  // Request Account Deletion
  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") {
      setError('Please type "DELETE" to confirm');
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create deletion request
      const { error: requestError } = await supabase
        .from("account_deletion_requests")
        .insert({
          provider_id: user.id,
          email: user.email,
          reason: "User requested deletion",
          status: "pending",
        });

      if (requestError) throw requestError;

      // Deactivate account immediately
      const { error: updateError } = await supabase
        .from("providers")
        .update({
          is_active: false,
          is_available: false,
          deletion_requested_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // Log out user
      await supabase.auth.signOut();
      navigate("/login/professional");
    } catch (err) {
      console.error("Deletion request error:", err);
      setError("Failed to request account deletion");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      await supabase.auth.signOut();
      navigate("/login/professional");
    }
  };

  return (
    <div className="space-y-6">
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

      {/* Change Password */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-2.5 rounded-lg">
            <Lock className="text-blue-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Change Password
            </h3>
            <p className="text-sm text-slate-600">
              Update your password to keep your account secure
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
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
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
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
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* Change Email */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-2.5 rounded-lg">
            <Mail className="text-purple-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Change Email Address
            </h3>
            <p className="text-sm text-slate-600">
              Current email: <span className="font-medium">{user.email}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleChangeEmail} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              New Email Address
            </label>
            <input
              type="email"
              value={emailData.newEmail}
              onChange={(e) =>
                setEmailData({ ...emailData, newEmail: e.target.value })
              }
              className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="newemail@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Confirm New Email Address
            </label>
            <input
              type="email"
              value={emailData.confirmNewEmail}
              onChange={(e) =>
                setEmailData({ ...emailData, confirmNewEmail: e.target.value })
              }
              className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="newemail@example.com"
              required
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-800">
              <strong>Note:</strong> You'll receive a verification email at your
              new address. You must confirm it before the change takes effect.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Change Email"}
          </button>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2.5 rounded-lg">
              <Shield className="text-green-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-slate-600">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={handleToggle2FA}
            disabled={loading}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              twoFactorEnabled ? "bg-green-600" : "bg-slate-300"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                twoFactorEnabled ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-900">
            {twoFactorEnabled
              ? "✅ 2FA is enabled. You'll receive a verification code via email when logging in."
              : "🔓 2FA is disabled. Enable it to require a verification code when logging in."}
          </p>
        </div>
      </div>

      {/* Account Deactivation */}
      <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-orange-100 p-2.5 rounded-lg">
            <UserX className="text-orange-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Deactivate Account
            </h3>
            <p className="text-sm text-slate-600">
              Temporarily disable your account (can be reactivated)
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowDeactivateModal(true)}
          className="w-full border-2 border-orange-300 text-orange-600 py-3 rounded-xl font-semibold hover:bg-orange-50 transition"
        >
          Deactivate Account
        </button>
      </div>

      {/* Account Deletion */}
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 p-2.5 rounded-lg">
            <Trash2 className="text-red-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Delete Account
            </h3>
            <p className="text-sm text-slate-600">
              Permanently delete your account and all data (cannot be undone)
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full border-2 border-red-300 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 transition"
        >
          Request Account Deletion
        </button>
      </div>

      {/* Logout */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-slate-100 p-2.5 rounded-lg">
            <LogOut className="text-slate-600" size={20} />
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
          className="w-full border-2 border-slate-300 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          Log Out
        </button>
      </div>

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <UserX className="text-orange-600" size={24} />
              Deactivate Account?
            </h3>
            <p className="text-slate-600 mb-4">
              Your account will be temporarily disabled. You can reactivate it by
              contacting support. Type <strong>DEACTIVATE</strong> to confirm.
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 mb-4 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="Type DEACTIVATE"
            />
            {error && (
              <p className="text-sm text-red-600 mb-4">{error}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeactivateModal(false);
                  setConfirmText("");
                  setError("");
                }}
                className="flex-1 border-2 border-slate-300 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivateAccount}
                disabled={loading}
                className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 transition disabled:opacity-50"
              >
                {loading ? "Processing..." : "Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Trash2 className="text-red-600" size={24} />
              Delete Account Permanently?
            </h3>
            <p className="text-slate-600 mb-4">
              This action <strong>cannot be undone</strong>. All your data,
              documents, and history will be permanently deleted. Type{" "}
              <strong>DELETE</strong> to confirm.
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 mb-4 focus:ring-2 focus:ring-red-500 focus:outline-none"
              placeholder="Type DELETE"
            />
            {error && (
              <p className="text-sm text-red-600 mb-4">{error}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmText("");
                  setError("");
                }}
                className="flex-1 border-2 border-slate-300 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50"
              >
                {loading ? "Processing..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}