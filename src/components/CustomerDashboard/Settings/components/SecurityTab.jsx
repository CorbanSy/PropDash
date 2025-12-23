//levlpro-mvp\src\components\CustomerDashboard\Settings\components\SecurityTab.jsx
import { Lock, LogOut, Eye, EyeOff, Shield } from "lucide-react";

export default function SecurityTab({
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
      <div className="bg-white rounded-2xl shadow-card border-2 border-secondary-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-error-100 p-3 rounded-xl">
            <Lock className="text-error-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900">
            Change Password
          </h3>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-secondary-900 mb-2">
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
                className="w-full border-2 border-secondary-300 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-300"
                placeholder="••••••••"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-all duration-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-secondary-500 mt-2 flex items-center gap-1">
              <Shield size={12} />
              Must be at least 6 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-secondary-900 mb-2">
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
              className="w-full border-2 border-secondary-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-300"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-secondary-900 text-white py-3 rounded-xl font-semibold hover:bg-secondary-800 transition-all duration-300 shadow-lg shadow-secondary-500/20"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Logout */}
      <div className="bg-white rounded-2xl shadow-card border-2 border-secondary-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-error-100 p-3 rounded-xl">
            <LogOut className="text-error-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">Log Out</h3>
            <p className="text-sm text-secondary-600">
              Sign out of your account on this device
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full border-2 border-error-300 text-error-600 py-3 rounded-xl font-semibold hover:bg-error-50 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          Log Out
        </button>
      </div>
    </div>
  );
}

