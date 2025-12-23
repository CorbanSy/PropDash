//levlpro-mvp\src\components\CustomerDashboard\Settings\components\AddressForm.jsx
import { MapPin } from "lucide-react";

export default function AddressForm({ data, setData }) {
  return (
    <div className="bg-white p-6 rounded-2xl border-2 border-secondary-200 shadow-card space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary-100 p-2 rounded-xl">
          <MapPin className="text-primary-600" size={18} />
        </div>
        <h3 className="font-semibold text-secondary-900">Address</h3>
      </div>

      <input
        placeholder="Street Address"
        value={data.address}
        onChange={(e) => setData({ ...data, address: e.target.value })}
        className="w-full border-2 border-secondary-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-300"
      />

      <div className="grid grid-cols-3 gap-3">
        <input
          placeholder="City"
          value={data.city}
          onChange={(e) => setData({ ...data, city: e.target.value })}
          className="border-2 border-secondary-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-300"
        />
        <input
          placeholder="State"
          value={data.state}
          onChange={(e) => setData({ ...data, state: e.target.value })}
          className="border-2 border-secondary-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-300"
        />
        <input
          placeholder="ZIP"
          value={data.zip_code}
          onChange={(e) => setData({ ...data, zip_code: e.target.value })}
          className="border-2 border-secondary-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-300"
        />
      </div>
    </div>
  );
}
