//levlpro-mvp\src\components\CustomerDashboard\Settings\components\LocationTab.jsx
import { MapPin, Home, Save } from "lucide-react";

export default function LocationTab({ customerData, setCustomerData, handleSaveProfile, saving }) {
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
                maxLength={2}
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