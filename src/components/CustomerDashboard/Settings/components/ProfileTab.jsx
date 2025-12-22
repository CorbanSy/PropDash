//levlpro-mvp\src\components\CustomerDashboard\Settings\components\ProfileTab.jsx
import { User, Mail, Phone, Save } from "lucide-react";

export default function ProfileTab({ customerData, setCustomerData, user, handleSaveProfile, saving }) {
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