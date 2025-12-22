import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Save, Zap, DollarSign, TrendingUp, CheckCircle2 } from "lucide-react";
import { supabase } from "../../../../lib/supabaseClient";
import { theme } from "../../../../styles/theme";

export default function AIQuotePreferences({ providerData, onUpdate }) {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [preferences, setPreferences] = useState({
    material_markup: 15,
    travel_fee: 0,
    minimum_labor_hours: 1,
    preferred_materials_brand: "",
    include_permits: true,
    include_cleanup: true,
    warranty_period: 12,
    emergency_rate_multiplier: 1.5,
    weekend_rate_multiplier: 1.2,
  });

  useEffect(() => {
    if (providerData.ai_preferences) {
      setPreferences({ ...preferences, ...providerData.ai_preferences });
    }
  }, [providerData]);

  const handleSave = async () => {
    setSaving(true);
    setSuccess("");

    const { error } = await supabase
      .from("providers")
      .update({ ai_preferences: preferences })
      .eq("id", providerData.id);

    if (error) {
      alert("Failed to save preferences");
    } else {
      setSuccess("AI preferences saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
      onUpdate();
    }

    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className={`${theme.alert.success} flex items-center gap-3`}>
          <CheckCircle2 size={20} />
          <span className="font-medium">{success}</span>
        </div>
      )}

      {/* Header */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-100 p-2.5 rounded-lg">
            <Zap className="text-purple-600" size={20} />
          </div>
          <div>
            <h3 className={theme.text.h4}>
              AI Quote Preferences
            </h3>
            <p className={`${theme.text.muted} text-sm`}>
              Customize how AI generates quotes for your business
            </p>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-900">
            <strong>🤖 Smart Quoting:</strong> These settings help the AI create accurate, personalized quotes that match your business style and pricing.
          </p>
        </div>
      </div>

      {/* Pricing Preferences */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-success-100 p-2.5 rounded-lg">
            <DollarSign className="text-success-600" size={20} />
          </div>
          <h3 className={theme.text.h4}>
            Pricing Settings
          </h3>
        </div>

        <div className="space-y-5">
          {/* Material Markup */}
          <div>
            <label className={`${theme.text.label} block mb-2`}>
              Material Markup: {preferences.material_markup}%
            </label>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={preferences.material_markup}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  material_markup: parseInt(e.target.value),
                })
              }
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-success-600"
            />
            <div className="flex justify-between text-xs text-secondary-600 mt-1">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
            </div>
            <p className={`${theme.text.caption} mt-2`}>
              Percentage added to material costs
            </p>
          </div>

          {/* Travel Fee */}
          <div>
            <label className={`${theme.text.label} block mb-2`}>
              Standard Travel Fee ($)
            </label>
            <div className="relative">
              <DollarSign
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400"
                size={18}
              />
              <input
                type="number"
                min="0"
                step="5"
                value={preferences.travel_fee}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    travel_fee: parseFloat(e.target.value) || 0,
                  })
                }
                className={`${theme.input.base} ${theme.input.focus} pl-11`}
              />
            </div>
            <p className={`${theme.text.caption} mt-2`}>
              Flat fee added for jobs outside your primary area
            </p>
          </div>

          {/* Minimum Labor */}
          <div>
            <label className={`${theme.text.label} block mb-2`}>
              Minimum Labor Time (hours)
            </label>
            <input
              type="number"
              min="0.5"
              max="4"
              step="0.5"
              value={preferences.minimum_labor_hours}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  minimum_labor_hours: parseFloat(e.target.value) || 1,
                })
              }
              className={`${theme.input.base} ${theme.input.focus}`}
            />
            <p className={`${theme.text.caption} mt-2`}>
              Minimum billable hours for any job
            </p>
          </div>
        </div>
      </div>

      {/* Rate Multipliers */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-warning-100 p-2.5 rounded-lg">
            <TrendingUp className="text-warning-600" size={20} />
          </div>
          <h3 className={theme.text.h4}>
            Rate Multipliers
          </h3>
        </div>

        <div className="space-y-5">
          {/* Emergency Rate */}
          <div>
            <label className={`${theme.text.label} block mb-2`}>
              Emergency Service Rate: {preferences.emergency_rate_multiplier}x
            </label>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={preferences.emergency_rate_multiplier}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  emergency_rate_multiplier: parseFloat(e.target.value),
                })
              }
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-warning-600"
            />
            <div className="flex justify-between text-xs text-secondary-600 mt-1">
              <span>1.0x (normal)</span>
              <span>2.0x</span>
              <span>3.0x</span>
            </div>
            <p className={`${theme.text.caption} mt-2`}>
              Multiplier for urgent/same-day requests
            </p>
          </div>

          {/* Weekend Rate */}
          <div>
            <label className={`${theme.text.label} block mb-2`}>
              Weekend/Holiday Rate: {preferences.weekend_rate_multiplier}x
            </label>
            <input
              type="range"
              min="1"
              max="2"
              step="0.1"
              value={preferences.weekend_rate_multiplier}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  weekend_rate_multiplier: parseFloat(e.target.value),
                })
              }
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-warning-600"
            />
            <div className="flex justify-between text-xs text-secondary-600 mt-1">
              <span>1.0x (normal)</span>
              <span>1.5x</span>
              <span>2.0x</span>
            </div>
            <p className={`${theme.text.caption} mt-2`}>
              Multiplier for weekend and holiday work
            </p>
          </div>
        </div>
      </div>

      {/* Additional Options */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <h3 className={`${theme.text.h4} mb-6`}>
          Quote Options
        </h3>

        <div className="space-y-4">
          {/* Preferred Materials Brand */}
          <div>
            <label className={`${theme.text.label} block mb-2`}>
              Preferred Materials Brand
            </label>
            <input
              type="text"
              value={preferences.preferred_materials_brand}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  preferred_materials_brand: e.target.value,
                })
              }
              className={`${theme.input.base} ${theme.input.focus}`}
              placeholder="e.g., Behr, Sherwin-Williams, etc."
            />
            <p className={`${theme.text.caption} mt-2`}>
              AI will default to this brand when suggesting materials
            </p>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.include_permits}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    include_permits: e.target.checked,
                  })
                }
                className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
              />
              <div>
                <span className="font-medium text-secondary-900">
                  Include Permits in Quotes
                </span>
                <p className={`${theme.text.caption}`}>
                  Automatically add permit costs when required
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.include_cleanup}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    include_cleanup: e.target.checked,
                  })
                }
                className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
              />
              <div>
                <span className="font-medium text-secondary-900">
                  Include Cleanup Time
                </span>
                <p className={`${theme.text.caption}`}>
                  Add time for site cleanup and debris removal
                </p>
              </div>
            </label>
          </div>

          {/* Warranty Period */}
          <div>
            <label className={`${theme.text.label} block mb-2`}>
              Standard Warranty Period (months)
            </label>
            <select
              value={preferences.warranty_period}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  warranty_period: parseInt(e.target.value),
                })
              }
              className={`${theme.input.base} ${theme.input.focus}`}
            >
              <option value="0">No Warranty</option>
              <option value="3">3 Months</option>
              <option value="6">6 Months</option>
              <option value="12">12 Months (1 Year)</option>
              <option value="24">24 Months (2 Years)</option>
              <option value="36">36 Months (3 Years)</option>
            </select>
            <p className={`${theme.text.caption} mt-2`}>
              Default warranty period shown in quotes
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`${theme.button.primary} w-full py-4 disabled:opacity-50 justify-center`}
      >
        {saving ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Saving...
          </>
        ) : (
          <>
            <Save size={20} />
            Save AI Preferences
          </>
        )}
      </button>
    </div>
  );
}