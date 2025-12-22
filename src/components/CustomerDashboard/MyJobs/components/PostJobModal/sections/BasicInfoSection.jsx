//levlpro-mvp\src\components\CustomerDashboard\MyJobs\components\PostJobModal\sections\BasicInfoSection.jsx
import { SERVICE_CATEGORIES } from "../../../../../../constants/serviceCategories";

export default function BasicInfoSection({ formData, updateFormData }) {
  const categories = SERVICE_CATEGORIES;

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b border-slate-200">
        Basic Information
      </h3>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Job Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.jobTitle}
          onChange={(e) => updateFormData({ jobTitle: e.target.value })}
          placeholder="e.g., Fix broken sliding door"
          className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Category <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => updateFormData({ category: cat.id })}
              className={`p-4 rounded-xl border-2 transition ${
                formData.category === cat.id
                  ? "border-teal-600 bg-teal-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <cat.icon
                size={28}
                className={`mx-auto mb-2 ${
                  formData.category === cat.id
                    ? "text-teal-600"
                    : "text-slate-400"
                }`}
              />
              <p className="text-sm font-medium text-slate-900">{cat.name}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          placeholder="Describe what you need done. Be specific about the problem, what you'd like fixed, and any important details..."
          rows={5}
          className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
          required
        />
        <p className="text-xs text-slate-500 mt-2">
          💡 Tip: More details help pros give accurate quotes
        </p>
      </div>
    </div>
  );
}