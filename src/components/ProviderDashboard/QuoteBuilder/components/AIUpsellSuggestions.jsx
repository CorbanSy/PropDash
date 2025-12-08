// src/components/ProviderDashboard/QuoteBuilder/components/AIUpsellSuggestions.jsx
import { Sparkles, Plus, X } from "lucide-react";
import { theme } from "../../../../styles/theme";

export default function AIUpsellSuggestions({ suggestions, onAdd, onDismiss }) {
  if (suggestions.length === 0) return null;

  return (
    <div className={`${theme.card.base} ${theme.card.padding}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-600" size={20} />
          <h3 className={theme.text.h3}>AI Upsell Suggestions</h3>
        </div>
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-600 transition"
          title="Dismiss suggestions"
        >
          <X size={20} />
        </button>
      </div>

      <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-purple-800">
          💡 Based on the photos, here are additional services you could offer to increase revenue
        </p>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion, i) => (
          <div key={i} className="border-2 border-slate-200 rounded-lg p-4 hover:border-purple-300 transition">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-slate-900">{suggestion.name}</h4>
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded font-medium">
                    {suggestion.confidence}% match
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-3">{suggestion.reason}</p>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-slate-900">${suggestion.price}</span>
                  <button
                    onClick={() => onAdd({
                      name: suggestion.name,
                      description: suggestion.reason,
                      type: "fixed",
                      price: suggestion.price,
                    })}
                    className={`${theme.button.provider} text-sm flex items-center gap-1`}
                  >
                    <Plus size={16} />
                    Add to Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}