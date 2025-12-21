//levlpro-mvp\src\components\ProviderDashboard\QuoteBuilder\components\PricingSettings.jsx
import { X, Info } from "lucide-react";
import { theme } from "../../../../styles/theme";

export default function PricingSettings({ settings, onChange, onClose }) {
  const handleChange = (field, value) => {
    onChange({ ...settings, [field]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-slate-200 p-6 flex items-start justify-between">
          <div>
            <h2 className={theme.text.h2}>Pricing Settings</h2>
            <p className={theme.text.caption}>Configure automatic pricing rules and fees</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Material Markup */}
          <div>
            <label className={theme.text.label}>Material Markup (%)</label>
            <p className={`${theme.text.caption} mb-2`}>
              Automatic markup applied to all material costs
            </p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={settings.materialMarkup}
                onChange={(e) => handleChange("materialMarkup", parseInt(e.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={settings.materialMarkup}
                onChange={(e) => handleChange("materialMarkup", parseInt(e.target.value))}
                className={`${theme.input.base} ${theme.input.provider} w-20 text-center`}
              />
              <span className="text-slate-600 font-medium">%</span>
            </div>
            {settings.materialMarkup > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm mt-3">
                <Info className="inline mr-2" size={16} />
                Example: $100 materials → ${100 + (100 * settings.materialMarkup) / 100} charged
              </div>
            )}
          </div>

          {/* Travel Fee */}
          <div>
            <label className={theme.text.label}>Travel Fee ($)</label>
            <p className={`${theme.text.caption} mb-2`}>
              Fixed fee added to all quotes for travel costs
            </p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                $
              </span>
              <input
                type="number"
                min="0"
                step="5"
                value={settings.travelFee}
                onChange={(e) => handleChange("travelFee", parseFloat(e.target.value))}
                className={`${theme.input.base} ${theme.input.provider} pl-8`}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Minimum Charge */}
          <div>
            <label className={theme.text.label}>Minimum Charge ($)</label>
            <p className={`${theme.text.caption} mb-2`}>
              Minimum amount for any job (prevents small unprofitable jobs)
            </p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                $
              </span>
              <input
                type="number"
                min="0"
                step="5"
                value={settings.minimumCharge}
                onChange={(e) => handleChange("minimumCharge", parseFloat(e.target.value))}
                className={`${theme.input.base} ${theme.input.provider} pl-8`}
                placeholder="0.00"
              />
            </div>
            {settings.minimumCharge > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm mt-3">
                <Info className="inline mr-2" size={16} />
                Quotes below ${settings.minimumCharge} will be automatically increased
              </div>
            )}
          </div>

          {/* Tax Rate */}
          <div>
            <label className={theme.text.label}>Sales Tax (%)</label>
            <p className={`${theme.text.caption} mb-2`}>
              Tax rate applied to quote subtotal
            </p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={settings.taxRate}
                onChange={(e) => handleChange("taxRate", parseFloat(e.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                min="0"
                max="20"
                step="0.1"
                value={settings.taxRate}
                onChange={(e) => handleChange("taxRate", parseFloat(e.target.value))}
                className={`${theme.input.base} ${theme.input.provider} w-20 text-center`}
              />
              <span className="text-slate-600 font-medium">%</span>
            </div>
          </div>

          {/* Labor Hour Rounding */}
          <div>
            <label className={theme.text.label}>Labor Hour Rounding</label>
            <p className={`${theme.text.caption} mb-2`}>
              Round labor hours up to nearest interval
            </p>
            <select
              value={settings.laborRounding}
              onChange={(e) => handleChange("laborRounding", e.target.value)}
              className={`${theme.input.base} ${theme.input.provider}`}
            >
              <option value="0.25">0.25 hours (15 min)</option>
              <option value="0.5">0.5 hours (30 min)</option>
              <option value="1">1 hour</option>
              <option value="none">No rounding</option>
            </select>
            {settings.laborRounding !== "none" && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm mt-3">
                <Info className="inline mr-2" size={16} />
                Example: 1.2 hours → {Math.ceil(1.2 / parseFloat(settings.laborRounding)) * parseFloat(settings.laborRounding)} hours
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="bg-slate-100 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-slate-900 mb-3">Current Settings Summary</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-600">Material Markup:</span>
                <span className="font-semibold text-slate-900 ml-2">
                  {settings.materialMarkup}%
                </span>
              </div>
              <div>
                <span className="text-slate-600">Travel Fee:</span>
                <span className="font-semibold text-slate-900 ml-2">
                  ${settings.travelFee}
                </span>
              </div>
              <div>
                <span className="text-slate-600">Minimum:</span>
                <span className="font-semibold text-slate-900 ml-2">
                  ${settings.minimumCharge}
                </span>
              </div>
              <div>
                <span className="text-slate-600">Tax Rate:</span>
                <span className="font-semibold text-slate-900 ml-2">
                  {settings.taxRate}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 flex gap-3">
          <button onClick={onClose} className={`flex-1 ${theme.button.secondary} justify-center`}>
            Cancel
          </button>
          <button onClick={onClose} className={`flex-1 ${theme.button.provider} justify-center`}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}