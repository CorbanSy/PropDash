// src/components/CustomerDashboard/MyJobs/components/PostJobModal/sections/RequirementsSection.jsx

export default function RequirementsSection({
  formData,
  updateFormData,
  isDirectBooking,
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b border-slate-200">
        Preferences & Special Requirements
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {!isDirectBooking && (
          <label className="flex items-center gap-3 p-4 border-2 border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition">
            <input
              type="checkbox"
              checked={formData.allowMultiplePros}
              onChange={(e) =>
                updateFormData({ allowMultiplePros: e.target.checked })
              }
              className="w-5 h-5 text-teal-600 rounded"
            />
            <span className="text-sm font-medium text-slate-900">
              Let multiple pros send quotes
            </span>
          </label>
        )}

        <label className="flex items-center gap-3 p-4 border-2 border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition">
          <input
            type="checkbox"
            checked={formData.needMaterials}
            onChange={(e) =>
              updateFormData({ needMaterials: e.target.checked })
            }
            className="w-5 h-5 text-teal-600 rounded"
          />
          <span className="text-sm font-medium text-slate-900">
            Need materials included
          </span>
        </label>

        <label className="flex items-center gap-3 p-4 border-2 border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition">
          <input
            type="checkbox"
            checked={formData.mustBeLicensed}
            onChange={(e) =>
              updateFormData({ mustBeLicensed: e.target.checked })
            }
            className="w-5 h-5 text-teal-600 rounded"
          />
          <span className="text-sm font-medium text-slate-900">
            Must be licensed pro
          </span>
        </label>

        <label className="flex items-center gap-3 p-4 border-2 border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition">
          <input
            type="checkbox"
            checked={formData.weekendAvailability}
            onChange={(e) =>
              updateFormData({ weekendAvailability: e.target.checked })
            }
            className="w-5 h-5 text-teal-600 rounded"
          />
          <span className="text-sm font-medium text-slate-900">
            Weekend availability
          </span>
        </label>

        <label className="flex items-center gap-3 p-4 border-2 border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition">
          <input
            type="checkbox"
            checked={formData.sameDayAvailability}
            onChange={(e) =>
              updateFormData({ sameDayAvailability: e.target.checked })
            }
            className="w-5 h-5 text-teal-600 rounded"
          />
          <span className="text-sm font-medium text-slate-900">
            Same-day service preferred
          </span>
        </label>

        <label className="flex items-center gap-3 p-4 border-2 border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition">
          <input
            type="checkbox"
            checked={formData.petsInHome}
            onChange={(e) => updateFormData({ petsInHome: e.target.checked })}
            className="w-5 h-5 text-teal-600 rounded"
          />
          <span className="text-sm font-medium text-slate-900">
            Pets in home
          </span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Parking Info (Optional)
        </label>
        <input
          type="text"
          value={formData.parkingInfo}
          onChange={(e) => updateFormData({ parkingInfo: e.target.value })}
          placeholder="e.g., Street parking available, visitor spots in front"
          className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
        />
      </div>
    </div>
  );
}