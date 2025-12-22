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