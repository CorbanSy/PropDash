//levlpro-mvp\src\components\ProviderDashboard\QuoteBuilder\components\LineItemEditor.jsx
import { useState } from "react";
import { GripVertical, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { calculateLineItemTotal, formatCurrency } from "../utils/quoteCalculations";

export default function LineItemEditor({ item, index, settings, onUpdate, onRemove }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (field, value) => {
    onUpdate({ ...item, [field]: value });
  };

  const total = calculateLineItemTotal(item, settings);

  return (
    <div className="border-2 border-slate-200 rounded-lg overflow-hidden">
      {/* Compact View */}
      <div className="flex items-center gap-3 p-4 bg-slate-50">
        <button className="cursor-grab text-slate-400 hover:text-slate-600">
          <GripVertical size={20} />
        </button>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-slate-900">
              {index + 1}. {item.name || "Untitled Item"}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded font-medium ${getTypeBadge(item.type)}`}>
              {item.type}
            </span>
          </div>
          <p className="text-sm text-slate-600 truncate">{item.description || "No description"}</p>
        </div>

        <div className="text-right mr-3">
          <p className="text-lg font-bold text-slate-900">{formatCurrency(total)}</p>
          <p className="text-xs text-slate-500">{getQuantityDisplay(item)}</p>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-slate-200 rounded transition"
        >
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        <button
          onClick={onRemove}
          className="p-2 text-red-600 hover:bg-red-50 rounded transition"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Expanded Edit View */}
      {isExpanded && (
        <div className="p-4 bg-white border-t-2 border-slate-200 space-y-4">
          {/* Name & Description */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={theme.text.label}>Item Name *</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`${theme.input.base} ${theme.input.provider} mt-2`}
                placeholder="e.g., Labor"
              />
            </div>
            <div>
              <label className={theme.text.label}>Type</label>
              <select
                value={item.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className={`${theme.input.base} ${theme.input.provider} mt-2`}
              >
                <option value="fixed">Fixed Price</option>
                <option value="hourly">Hourly Rate</option>
                <option value="sqft">Per Square Foot</option>
                <option value="material">Material/Supply</option>
              </select>
            </div>
          </div>

          <div>
            <label className={theme.text.label}>Description</label>
            <textarea
              value={item.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={`${theme.input.base} ${theme.input.provider} mt-2`}
              rows={2}
              placeholder="Detailed description..."
            />
          </div>

          {/* Pricing Fields - Dynamic based on type */}
          {item.type === "fixed" && (
            <div>
              <label className={theme.text.label}>Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={item.price || ""}
                onChange={(e) => handleChange("price", parseFloat(e.target.value))}
                className={`${theme.input.base} ${theme.input.provider} mt-2`}
                placeholder="0.00"
              />
            </div>
          )}

          {item.type === "hourly" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={theme.text.label}>Hours</label>
                <input
                  type="number"
                  min="0"
                  step="0.25"
                  value={item.hours || ""}
                  onChange={(e) => handleChange("hours", parseFloat(e.target.value))}
                  className={`${theme.input.base} ${theme.input.provider} mt-2`}
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className={theme.text.label}>Rate ($/hr)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.rate || ""}
                  onChange={(e) => handleChange("rate", parseFloat(e.target.value))}
                  className={`${theme.input.base} ${theme.input.provider} mt-2`}
                  placeholder="0.00"
                />
              </div>
            </div>
          )}

          {item.type === "sqft" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={theme.text.label}>Square Feet</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={item.squareFeet || ""}
                  onChange={(e) => handleChange("squareFeet", parseFloat(e.target.value))}
                  className={`${theme.input.base} ${theme.input.provider} mt-2`}
                  placeholder="0"
                />
              </div>
              <div>
                <label className={theme.text.label}>Rate ($/sqft)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.ratePerSqft || ""}
                  onChange={(e) => handleChange("ratePerSqft", parseFloat(e.target.value))}
                  className={`${theme.input.base} ${theme.input.provider} mt-2`}
                  placeholder="0.00"
                />
              </div>
            </div>
          )}

          {item.type === "material" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={theme.text.label}>Quantity</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={item.quantity || ""}
                  onChange={(e) => handleChange("quantity", parseFloat(e.target.value))}
                  className={`${theme.input.base} ${theme.input.provider} mt-2`}
                  placeholder="0"
                />
              </div>
              <div>
                <label className={theme.text.label}>Unit Price ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice || ""}
                  onChange={(e) => handleChange("unitPrice", parseFloat(e.target.value))}
                  className={`${theme.input.base} ${theme.input.provider} mt-2`}
                  placeholder="0.00"
                />
              </div>
            </div>
          )}

          {/* Material Markup Info */}
          {item.type === "material" && settings.materialMarkup > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              <p className="text-blue-900">
                💡 <strong>{settings.materialMarkup}% markup</strong> will be applied automatically
              </p>
              <p className="text-blue-700 text-xs mt-1">
                Cost: {formatCurrency((item.quantity || 0) * (item.unitPrice || 0))} →{" "}
                <strong>Total: {formatCurrency(total)}</strong>
              </p>
            </div>
          )}

          {/* Total Display */}
          <div className="bg-slate-100 rounded-lg p-3 flex items-center justify-between">
            <span className="font-semibold text-slate-700">Line Item Total:</span>
            <span className="text-xl font-bold text-slate-900">{formatCurrency(total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Functions
function getTypeBadge(type) {
  const badges = {
    fixed: "bg-blue-100 text-blue-700",
    hourly: "bg-purple-100 text-purple-700",
    sqft: "bg-emerald-100 text-emerald-700",
    material: "bg-amber-100 text-amber-700",
  };
  return badges[type] || "bg-slate-100 text-slate-700";
}

function getQuantityDisplay(item) {
  if (item.type === "hourly") return `${item.hours || 0} hrs @ $${item.rate || 0}/hr`;
  if (item.type === "sqft") return `${item.squareFeet || 0} sqft @ $${item.ratePerSqft || 0}/sqft`;
  if (item.type === "material") return `${item.quantity || 0} × $${item.unitPrice || 0}`;
  return "Fixed price";
}