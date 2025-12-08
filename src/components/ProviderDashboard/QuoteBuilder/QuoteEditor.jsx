// src/components/ProviderDashboard/QuoteBuilder/QuoteEditor.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Save,
  Send,
  Eye,
  Plus,
  Sparkles,
  Upload,
  FileText,
  Settings as SettingsIcon,
  ArrowLeft,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import useAuth from "../../../hooks/useAuth";
import { theme } from "../../../styles/theme";
import ServiceCatalog from "./components/ServiceCatalog";
import TemplateSelector from "./components/TemplateSelector";
import LineItemEditor from "./components/LineItemEditor";
import PricingSettings from "./components/PricingSettings";
import AttachmentUploader from "./components/AttachmentUploader";
import AIPhotoAnalysis from "./components/AIPhotoAnalysis";
import AIUpsellSuggestions from "./components/AIUpsellSuggestions";
import {
  calculateQuoteTotal,
  calculateProfitMargin,
  validateQuote,
  formatCurrency,
} from "./utils/quoteCalculations";

export default function QuoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isNewQuote = id === "new";

  // Quote State
  const [quote, setQuote] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    service_name: "",
    description: "",
    lineItems: [],
    attachments: [],
    terms: "",
    notes: "",
    status: "draft",
  });

  // Settings State
  const [settings, setSettings] = useState({
    materialMarkup: 20,
    travelFee: 0,
    minimumCharge: 0,
    taxRate: 0,
    laborRounding: "0.5",
  });

  // UI State
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showServiceCatalog, setShowServiceCatalog] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showPricingSettings, setShowPricingSettings] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);

  useEffect(() => {
    if (!isNewQuote) {
      fetchQuote();
    }
    fetchSettings();
  }, [id]);

  const fetchQuote = async () => {
    setLoading(true);
    const { data } = await supabase.from("quotes").select("*").eq("id", id).single();

    if (data) {
      setQuote({
        ...data,
        lineItems: data.line_items || [],
        attachments: data.attachments || [],
      });
    }
    setLoading(false);
  };

  const fetchSettings = async () => {
    // TODO: Fetch from database
    // For now using default values
  };

  const handleSave = async (isDraft = true) => {
    setSaving(true);

    const totals = calculateQuoteTotal(quote.lineItems, settings);
    const quoteData = {
      provider_id: user.id,
      client_name: quote.client_name,
      client_email: quote.client_email,
      client_phone: quote.client_phone,
      service_name: quote.service_name,
      description: quote.description,
      line_items: quote.lineItems,
      attachments: quote.attachments,
      terms: quote.terms,
      notes: quote.notes,
      subtotal: Math.round(totals.subtotal * 100),
      tax: Math.round(totals.tax * 100),
      total: Math.round(totals.total * 100),
      status: isDraft ? "draft" : "sent",
      settings: settings,
    };

    if (isNewQuote) {
      const { data, error } = await supabase.from("quotes").insert([quoteData]).select().single();
      if (data) {
        navigate(`/provider/quotes/${data.id}`);
      }
    } else {
      await supabase.from("quotes").update(quoteData).eq("id", id);
    }

    setSaving(false);
  };

  const handleSend = async () => {
    const validation = validateQuote(quote, settings);
    if (!validation.isValid) {
      alert(`Cannot send quote:\n${validation.errors.join("\n")}`);
      return;
    }

    if (validation.warnings.length > 0) {
      const proceed = confirm(
        `Warnings:\n${validation.warnings.join("\n")}\n\nSend anyway?`
      );
      if (!proceed) return;
    }

    await handleSave(false);
    // TODO: Send email to client
    alert("Quote sent to client!");
  };

  const addLineItem = (item) => {
    setQuote({
      ...quote,
      lineItems: [...quote.lineItems, { id: Date.now(), ...item }],
    });
    setShowServiceCatalog(false);
  };

  const updateLineItem = (id, updatedItem) => {
    setQuote({
      ...quote,
      lineItems: quote.lineItems.map((item) => (item.id === id ? updatedItem : item)),
    });
  };

  const removeLineItem = (id) => {
    setQuote({
      ...quote,
      lineItems: quote.lineItems.filter((item) => item.id !== id),
    });
  };

  const applyTemplate = (template) => {
    if (!template) {
      setShowTemplateSelector(false);
      return;
    }

    setQuote({
      ...quote,
      lineItems: template.defaultLineItems.map((item, i) => ({ ...item, id: Date.now() + i })),
      terms: template.terms,
    });
    setShowTemplateSelector(false);
  };

  const handleAIAnalysis = (analysis) => {
    // Add suggested line items from AI
    const newItems = analysis.suggestedItems.map((item, i) => ({
      id: Date.now() + i,
      ...item,
    }));
    setQuote({
      ...quote,
      lineItems: [...quote.lineItems, ...newItems],
    });
    setAiSuggestions(analysis.upsells || []);
    setShowAIAnalysis(false);
  };

  const totals = calculateQuoteTotal(quote.lineItems, settings);
  const profitAnalysis = calculateProfitMargin(quote.lineItems, settings);
  const validation = validateQuote(quote, settings);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={theme.text.body}>Loading quote...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/provider/quotes")}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className={theme.text.h1}>
              {isNewQuote ? "New Quote" : `Edit Quote #${id.slice(0, 8)}`}
            </h1>
            <p className={`${theme.text.body} mt-1`}>
              {isNewQuote ? "Create a new quote for a client" : "Edit and update quote details"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className={`${theme.button.secondary} hidden sm:flex items-center gap-2`}
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={handleSend}
            disabled={saving || !validation.isValid}
            className={`${theme.button.provider} flex items-center gap-2`}
          >
            <Send size={18} />
            Send Quote
          </button>
        </div>
      </div>

      {/* Validation Warnings */}
      {validation.warnings.length > 0 && (
        <div className={theme.alert.warning}>
          <AlertCircle className="flex-shrink-0" size={20} />
          <div className="space-y-1">
            <p className="font-semibold text-sm">Warnings</p>
            {validation.warnings.map((warning, i) => (
              <p key={i} className="text-xs">
                • {warning}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Validation Errors */}
      {validation.errors.length > 0 && (
        <div className={theme.alert.error}>
          <AlertCircle className="flex-shrink-0" size={20} />
          <div className="space-y-1">
            <p className="font-semibold text-sm">Errors - Fix before sending</p>
            {validation.errors.map((error, i) => (
              <p key={i} className="text-xs">
                • {error}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Editor - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Information */}
          <div className={`${theme.card.base} ${theme.card.padding}`}>
            <h3 className={`${theme.text.h3} mb-4`}>Client Information</h3>
            <div className="space-y-4">
              <div>
                <label className={theme.text.label}>Client Name *</label>
                <input
                  type="text"
                  required
                  value={quote.client_name}
                  onChange={(e) => setQuote({ ...quote, client_name: e.target.value })}
                  className={`${theme.input.base} ${theme.input.provider} mt-2`}
                  placeholder="John Smith"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={theme.text.label}>Email</label>
                  <input
                    type="email"
                    value={quote.client_email}
                    onChange={(e) => setQuote({ ...quote, client_email: e.target.value })}
                    className={`${theme.input.base} ${theme.input.provider} mt-2`}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className={theme.text.label}>Phone</label>
                  <input
                    type="tel"
                    value={quote.client_phone}
                    onChange={(e) => setQuote({ ...quote, client_phone: e.target.value })}
                    className={`${theme.input.base} ${theme.input.provider} mt-2`}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className={`${theme.card.base} ${theme.card.padding}`}>
            <h3 className={`${theme.text.h3} mb-4`}>Service Details</h3>
            <div className="space-y-4">
              <div>
                <label className={theme.text.label}>Service Name *</label>
                <input
                  type="text"
                  required
                  value={quote.service_name}
                  onChange={(e) => setQuote({ ...quote, service_name: e.target.value })}
                  className={`${theme.input.base} ${theme.input.provider} mt-2`}
                  placeholder="TV Mounting & Wire Concealment"
                />
              </div>
              <div>
                <label className={theme.text.label}>Description</label>
                <textarea
                  value={quote.description}
                  onChange={(e) => setQuote({ ...quote, description: e.target.value })}
                  className={`${theme.input.base} ${theme.input.provider} mt-2`}
                  rows={3}
                  placeholder="Detailed description of the work to be performed..."
                />
              </div>
            </div>
          </div>

          {/* AI Photo Analysis */}
          <div className={`${theme.card.base} ${theme.card.padding}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`${theme.text.h3}`}>Photos & AI Analysis</h3>
              <button
                onClick={() => setShowAIAnalysis(true)}
                className={`${theme.button.provider} text-sm flex items-center gap-2`}
              >
                <Sparkles size={16} />
                Analyze Photos
              </button>
            </div>
            <AttachmentUploader
              attachments={quote.attachments}
              onChange={(attachments) => setQuote({ ...quote, attachments })}
            />
          </div>

          {/* Line Items */}
          <div className={`${theme.card.base} ${theme.card.padding}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`${theme.text.h3}`}>Line Items</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowTemplateSelector(true)}
                  className={`${theme.button.secondary} text-sm flex items-center gap-2`}
                >
                  <FileText size={16} />
                  Template
                </button>
                <button
                  onClick={() => setShowServiceCatalog(true)}
                  className={`${theme.button.provider} text-sm flex items-center gap-2`}
                >
                  <Plus size={16} />
                  Add Item
                </button>
              </div>
            </div>

            {quote.lineItems.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-slate-400" size={32} />
                </div>
                <p className={`${theme.text.h4} mb-2`}>No Line Items Yet</p>
                <p className={`${theme.text.body} mb-4`}>
                  Add items from your catalog or start from a template
                </p>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setShowTemplateSelector(true)}
                    className={`${theme.button.secondary} text-sm`}
                  >
                    Use Template
                  </button>
                  <button
                    onClick={() => setShowServiceCatalog(true)}
                    className={`${theme.button.provider} text-sm`}
                  >
                    Add Item
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {quote.lineItems.map((item, index) => (
                  <LineItemEditor
                    key={item.id}
                    item={item}
                    index={index}
                    settings={settings}
                    onUpdate={(updatedItem) => updateLineItem(item.id, updatedItem)}
                    onRemove={() => removeLineItem(item.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* AI Upsell Suggestions */}
          {aiSuggestions.length > 0 && (
            <AIUpsellSuggestions
              suggestions={aiSuggestions}
              onAdd={(item) => addLineItem(item)}
              onDismiss={() => setAiSuggestions([])}
            />
          )}

          {/* Terms & Conditions */}
          <div className={`${theme.card.base} ${theme.card.padding}`}>
            <h3 className={`${theme.text.h3} mb-4`}>Terms & Conditions</h3>
            <textarea
              value={quote.terms}
              onChange={(e) => setQuote({ ...quote, terms: e.target.value })}
              className={`${theme.input.base} ${theme.input.provider}`}
              rows={8}
              placeholder="Payment terms, warranty information, disclaimers..."
            />
          </div>

          {/* Internal Notes */}
          <div className={`${theme.card.base} ${theme.card.padding}`}>
            <h3 className={`${theme.text.h3} mb-4`}>Internal Notes</h3>
            <p className={`${theme.text.caption} mb-3`}>
              These notes are only visible to you, not the client
            </p>
            <textarea
              value={quote.notes}
              onChange={(e) => setQuote({ ...quote, notes: e.target.value })}
              className={`${theme.input.base} ${theme.input.provider}`}
              rows={4}
              placeholder="Private notes about this job..."
            />
          </div>
        </div>

        {/* Sidebar - Right Side */}
        <div className="space-y-6">
          {/* Quote Summary */}
          <div className={`${theme.card.base} ${theme.card.padding} sticky top-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`${theme.text.h3}`}>Quote Summary</h3>
              <button
                onClick={() => setShowPricingSettings(true)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
                title="Pricing Settings"
              >
                <SettingsIcon size={18} className="text-slate-600" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Line Items Count */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Line Items:</span>
                <span className="font-semibold text-slate-900">{quote.lineItems.length}</span>
              </div>

              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(totals.subtotal)}
                </span>
              </div>

              {/* Travel Fee */}
              {settings.travelFee > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Travel Fee:</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(settings.travelFee)}
                  </span>
                </div>
              )}

              {/* Tax */}
              {settings.taxRate > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Tax ({settings.taxRate}%):</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(totals.tax)}
                  </span>
                </div>
              )}

              <div className="border-t-2 border-slate-200 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900">Total:</span>
                  <span className="text-2xl font-bold text-blue-700">
                    {formatCurrency(totals.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profit Analysis */}
          {quote.lineItems.length > 0 && (
            <div className={`${theme.card.base} ${theme.card.padding}`}>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-emerald-600" size={20} />
                <h3 className={`${theme.text.h4}`}>Profit Analysis</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Labor Cost:</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(profitAnalysis.laborCost)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Material Cost:</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(profitAnalysis.materialCost)}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Profit:</span>
                    <span className="font-bold text-emerald-700">
                      {formatCurrency(profitAnalysis.profit)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-slate-600">Margin:</span>
                    <span
                      className={`font-bold ${
                        profitAnalysis.profitMargin < 15
                          ? "text-red-600"
                          : profitAnalysis.profitMargin > 50
                          ? "text-amber-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {profitAnalysis.profitMargin.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Margin Warning */}
                {profitAnalysis.profitMargin < 15 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-800">
                    ⚠️ Low profit margin - consider increasing prices
                  </div>
                )}
                {profitAnalysis.profitMargin > 50 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                    💡 High margin - may lose to competitors
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className={`${theme.card.base} ${theme.card.padding}`}>
            <h3 className={`${theme.text.h4} mb-4`}>Quick Actions</h3>
            <div className="space-y-2">
              <button className={`w-full ${theme.button.secondary} justify-start text-sm`}>
                <Eye size={16} />
                Preview Quote
              </button>
              <button className={`w-full ${theme.button.secondary} justify-start text-sm`}>
                <Upload size={16} />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showServiceCatalog && (
        <ServiceCatalog onSelect={addLineItem} onClose={() => setShowServiceCatalog(false)} />
      )}
      {showTemplateSelector && (
        <TemplateSelector onSelect={applyTemplate} onClose={() => setShowTemplateSelector(false)} />
      )}
      {showPricingSettings && (
        <PricingSettings
          settings={settings}
          onChange={setSettings}
          onClose={() => setShowPricingSettings(false)}
        />
      )}
      {showAIAnalysis && (
        <AIPhotoAnalysis
          attachments={quote.attachments}
          onAnalysisComplete={handleAIAnalysis}
          onClose={() => setShowAIAnalysis(false)}
        />
      )}
    </div>
  );
}