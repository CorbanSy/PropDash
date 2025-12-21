//levlpro-mvp\src\components\ProviderDashboard\QuoteBuilder\components\AIPhotoAnalysis.jsx
import { useState } from "react";
import { X, Sparkles, CheckCircle2, AlertCircle, Loader } from "lucide-react";
import { theme } from "../../../../styles/theme";

export default function AIPhotoAnalysis({ attachments, onAnalysisComplete, onClose }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const handleAnalyze = async () => {
    setAnalyzing(true);

    // Simulate AI analysis - in production, call Claude API
    setTimeout(() => {
      const mockResults = {
        summary: "Detected 1 large drywall hole requiring patch and paint",
        detectedItems: [
          {
            name: "Drywall Damage",
            confidence: 95,
            details: "Large hole approximately 6x8 inches",
            location: "Living room wall",
          },
          {
            name: "Paint Needed",
            confidence: 88,
            details: "Paint touch-up required after repair",
            location: "Same wall area",
          },
        ],
        suggestedItems: [
          {
            name: "Drywall Patch",
            description: "Repair 6x8 inch hole with backing and compound",
            type: "fixed",
            price: 150,
            estimatedTime: "2-3 hours",
          },
          {
            name: "Paint Touch-up",
            description: "Prime and paint repaired area (2 coats)",
            type: "fixed",
            price: 75,
            estimatedTime: "1-2 hours",
          },
          {
            name: "Materials",
            description: "Drywall sheet, compound, paint",
            type: "material",
            quantity: 1,
            unitPrice: 45,
          },
        ],
        upsells: [
          {
            name: "Full Wall Repaint",
            reason: "Existing paint shows wear - repainting full wall would provide better color match",
            price: 250,
            confidence: 72,
          },
          {
            name: "Baseboard Repair",
            reason: "Baseboards show scuff marks and minor damage",
            price: 100,
            confidence: 65,
          },
        ],
        warnings: [
          {
            type: "safety",
            message: "Check for electrical wiring before cutting drywall",
            severity: "high",
          },
        ],
        measurements: {
          holeSize: "6 x 8 inches",
          wallArea: "Approximately 100 sq ft",
          paintCoverage: "1 quart should suffice",
        },
      };

      setResults(mockResults);
      setAnalyzing(false);
    }, 3000);
  };

  const handleAccept = () => {
    if (results) {
      onAnalysisComplete({
        suggestedItems: results.suggestedItems,
        upsells: results.upsells,
      });
    }
  };

  const imageCount = attachments.filter((a) => a.type.startsWith("image/")).length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-slate-200 p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-purple-600" size={24} />
              <h2 className={theme.text.h2}>AI Photo Analysis</h2>
            </div>
            <p className={theme.text.caption}>
              Analyze photos to detect work needed and generate line items
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!results ? (
            <div className="space-y-6">
              {/* Photo Preview */}
              <div>
                <h3 className={`${theme.text.h4} mb-3`}>Photos to Analyze ({imageCount})</h3>
                {imageCount === 0 ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                    <AlertCircle className="mx-auto text-amber-600 mb-2" size={32} />
                    <p className="text-sm text-amber-800">
                      No photos uploaded yet. Upload photos to use AI analysis.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {attachments
                      .filter((a) => a.type.startsWith("image/"))
                      .map((photo) => (
                        <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden border-2 border-slate-200">
                          <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* AI Info */}
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
                <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <Sparkles size={20} />
                  AI Will Detect:
                </h4>
                <ul className="space-y-2 text-sm text-purple-800">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Types of damage and work needed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Approximate measurements and dimensions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Materials and labor time estimates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Additional upsell opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Safety warnings and compliance needs</span>
                  </li>
                </ul>
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={analyzing || imageCount === 0}
                className={`w-full ${theme.button.provider} justify-center py-4 text-lg ${
                  (analyzing || imageCount === 0) ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {analyzing ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Analyzing Photos...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Analyze with AI
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Analysis Summary</h3>
                <p className="text-blue-800">{results.summary}</p>
              </div>

              {/* Detected Items */}
              <div>
                <h3 className={`${theme.text.h4} mb-3`}>Detected in Photos</h3>
                <div className="space-y-2">
                  {results.detectedItems.map((item, i) => (
                    <div key={i} className="border-2 border-slate-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-slate-900">{item.name}</h4>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded font-medium">
                          {item.confidence}% confident
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-1">{item.details}</p>
                      <p className="text-xs text-slate-500">📍 {item.location}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Line Items */}
              <div>
                <h3 className={`${theme.text.h4} mb-3`}>Suggested Line Items</h3>
                <div className="space-y-2">
                  {results.suggestedItems.map((item, i) => (
                    <div key={i} className="border-2 border-blue-200 bg-blue-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 mb-1">{item.name}</h4>
                          <p className="text-sm text-slate-600 mb-2">{item.description}</p>
                          <p className="text-xs text-slate-500">⏱️ {item.estimatedTime}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-lg font-bold text-slate-900">
                            ${item.price || (item.quantity * item.unitPrice)}
                          </p>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">
                            {item.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upsell Opportunities */}
              {results.upsells.length > 0 && (
                <div>
                  <h3 className={`${theme.text.h4} mb-3`}>💡 Upsell Opportunities</h3>
                  <div className="space-y-2">
                    {results.upsells.map((upsell, i) => (
                      <div key={i} className="border-2 border-amber-200 bg-amber-50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900 mb-1">{upsell.name}</h4>
                            <p className="text-sm text-slate-600">{upsell.reason}</p>
                          </div>
                          <p className="text-lg font-bold text-slate-900 ml-4">${upsell.price}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded font-medium">
                          {upsell.confidence}% recommended
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {results.warnings.length > 0 && (
                <div className={theme.alert.error}>
                  <AlertCircle className="flex-shrink-0" size={20} />
                  <div>
                    <p className="font-semibold text-sm mb-2">Safety Warnings</p>
                    {results.warnings.map((warning, i) => (
                      <p key={i} className="text-xs">
                        • {warning.message}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Measurements */}
              <div className="bg-slate-100 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-3">📏 Measurements</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {Object.entries(results.measurements).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-slate-600 capitalize">
                        {key.replace(/([A-Z])/g, " $1")}:
                      </span>
                      <span className="font-semibold text-slate-900 ml-2">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 flex gap-3">
          <button onClick={onClose} className={`flex-1 ${theme.button.secondary} justify-center`}>
            {results ? "Discard" : "Cancel"}
          </button>
          {results && (
            <button onClick={handleAccept} className={`flex-1 ${theme.button.provider} justify-center`}>
              <CheckCircle2 size={18} />
              Add to Quote
            </button>
          )}
        </div>
      </div>
    </div>
  );
}