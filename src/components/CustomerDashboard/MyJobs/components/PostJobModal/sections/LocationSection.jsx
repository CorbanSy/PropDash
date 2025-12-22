//levlpro-mvp\src\components\CustomerDashboard\MyJobs\components\PostJobModal\sections\LocationSection.jsx

export default function LocationSection({ formData, updateFormData }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b border-slate-200">
        Location
      </h3>

      <label className="flex items-center gap-3 p-4 border-2 border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition">
        <input
          type="checkbox"
          checked={formData.useDefaultAddress}
          onChange={(e) =>
            updateFormData({ useDefaultAddress: e.target.checked })
          }
          className="w-5 h-5 text-teal-600 rounded"
        />
        <div className="flex-1">
          <p className="font-medium text-slate-900">Use my saved address</p>
          <p className="text-sm text-slate-600">
            Use the address from your profile
          </p>
        </div>
      </label>

      {!formData.useDefaultAddress && (
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Street Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => updateFormData({ address: e.target.value })}
              placeholder="123 Main Street"
              className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              required={!formData.useDefaultAddress}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Unit / Apt (Optional)
            </label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => updateFormData({ unit: e.target.value })}
              placeholder="Apt 4B"
              className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => updateFormData({ city: e.target.value })}
                placeholder="San Francisco"
                className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                required={!formData.useDefaultAddress}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                ZIP Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => updateFormData({ zipCode: e.target.value })}
                placeholder="94102"
                className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                required={!formData.useDefaultAddress}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}