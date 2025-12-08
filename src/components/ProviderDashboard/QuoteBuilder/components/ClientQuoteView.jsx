// src/components/ProviderDashboard/QuoteBuilder/components/ClientQuoteView.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Download,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../../../../lib/supabaseClient";
import { theme } from "../../../../styles/theme";
import { formatCurrency } from "../utils/quoteCalculations";

export default function ClientQuoteView() {
  const { id } = useParams();
  const [quote, setQuote] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchQuote();
  }, [id]);

  const fetchQuote = async () => {
    // Fetch quote
    const { data: quoteData } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", id)
      .single();

    if (quoteData) {
      setQuote(quoteData);

      // Mark as viewed
      if (quoteData.status === "sent") {
        await supabase
          .from("quotes")
          .update({ status: "viewed", viewed_at: new Date().toISOString() })
          .eq("id", id);
      }

      // Fetch provider info
      const { data: providerData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", quoteData.provider_id)
        .single();

      if (providerData) setProvider(providerData);
    }

    setLoading(false);
  };

  const handleResponse = async (response) => {
    setResponding(true);

    const updates = {
      status: response,
      [response === "approved" ? "approved_at" : "declined_at"]: new Date().toISOString(),
    };

    if (comment) {
      updates.client_comment = comment;
    }

    await supabase.from("quotes").update(updates).eq("id", id);

    setResponding(false);
    fetchQuote(); // Refresh to show updated status
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={theme.text.body}>Loading quote...</p>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <XCircle className="mx-auto text-red-600 mb-4" size={64} />
          <h1 className={theme.text.h1}>Quote Not Found</h1>
          <p className={`${theme.text.body} mt-2`}>This quote may have been deleted or the link is invalid.</p>
        </div>
      </div>
    );
  }

  const isExpired = quote.expires_at && new Date(quote.expires_at) < new Date();
  const canRespond = quote.status === "sent" || quote.status === "viewed";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <h1 className={theme.text.h1}>{quote.service_name}</h1>
              <p className={`${theme.text.body} mt-1`}>
                Quote #{quote.quote_number || quote.id.slice(0, 8)}
              </p>
            </div>
            {provider && (
              <div className="text-right">
                <p className="font-semibold text-slate-900">{provider.business_name || provider.full_name}</p>
                <div className="flex items-center justify-end gap-2 mt-2 text-sm text-slate-600">
                  {provider.phone && (
                    <a href={`tel:${provider.phone}`} className="flex items-center gap-1 hover:text-blue-600">
                      <Phone size={14} />
                      {provider.phone}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6 my-6">
        {/* Status Banner */}
        {quote.status === "approved" && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle2 className="text-green-600" size={24} />
            <div>
              <p className="font-semibold text-green-900">Quote Approved</p>
              <p className="text-sm text-green-700">
                Thank you! We'll be in touch shortly to schedule your service.
              </p>
            </div>
          </div>
        )}

        {quote.status === "declined" && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-center gap-3">
            <XCircle className="text-red-600" size={24} />
            <div>
              <p className="font-semibold text-red-900">Quote Declined</p>
              <p className="text-sm text-red-700">
                We appreciate you considering us. Feel free to reach out if circumstances change.
              </p>
            </div>
          </div>
        )}

        {isExpired && (
          <div className={theme.alert.warning}>
            <AlertCircle className="flex-shrink-0" size={20} />
            <div>
              <p className="font-semibold text-sm">Quote Expired</p>
              <p className="text-xs mt-1">
                This quote expired on {new Date(quote.expires_at).toLocaleDateString()}. Please contact us for an updated quote.
              </p>
            </div>
          </div>
        )}

        {/* Client Info */}
        <div className={`${theme.card.base} ${theme.card.padding}`}>
          <h2 className={`${theme.text.h3} mb-4`}>Client Information</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Name:</strong> {quote.client_name}</p>
            {quote.client_email && <p><strong>Email:</strong> {quote.client_email}</p>}
            {quote.client_phone && <p><strong>Phone:</strong> {quote.client_phone}</p>}
          </div>
        </div>

        {/* Description */}
        {quote.description && (
          <div className={`${theme.card.base} ${theme.card.padding}`}>
            <h2 className={`${theme.text.h3} mb-4`}>Project Description</h2>
            <p className={theme.text.body}>{quote.description}</p>
          </div>
        )}

        {/* Line Items */}
        <div className={`${theme.card.base} ${theme.card.padding}`}>
          <h2 className={`${theme.text.h3} mb-4`}>Quote Details</h2>
          <div className="space-y-3">
            {quote.line_items?.map((item, index) => (
              <div key={index} className="flex items-start justify-between py-3 border-b border-slate-200 last:border-0">
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  {item.description && (
                    <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">
                    {item.type === "hourly" && `${item.hours} hrs × $${item.rate}/hr`}
                    {item.type === "sqft" && `${item.squareFeet} sqft × $${item.ratePerSqft}/sqft`}
                    {item.type === "material" && `${item.quantity} × $${item.unitPrice}`}
                    {item.type === "fixed" && "Fixed price"}
                  </p>
                </div>
                <p className="font-semibold text-slate-900 ml-4">
                  {formatCurrency(
                    item.type === "hourly" ? item.hours * item.rate :
                    item.type === "sqft" ? item.squareFeet * item.ratePerSqft :
                    item.type === "material" ? item.quantity * item.unitPrice :
                    item.price
                  )}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-6 pt-4 border-t-2 border-slate-300 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Subtotal:</span>
              <span className="font-semibold">{formatCurrency(quote.subtotal / 100)}</span>
            </div>
            {quote.tax > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Tax:</span>
                <span className="font-semibold">{formatCurrency(quote.tax / 100)}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-lg font-bold text-slate-900">Total:</span>
              <span className="text-2xl font-bold text-blue-700">
                {formatCurrency(quote.total / 100)}
              </span>
            </div>
          </div>
        </div>

        {/* Photos */}
        {quote.attachments?.length > 0 && (
          <div className={`${theme.card.base} ${theme.card.padding}`}>
            <h2 className={`${theme.text.h3} mb-4`}>Reference Photos</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {quote.attachments
                .filter((a) => a.type.startsWith("image/"))
                .map((photo, i) => (
                  <img
                    key={i}
                    src={photo.url}
                    alt={`Reference ${i + 1}`}
                    className="rounded-lg border-2 border-slate-200 w-full h-32 object-cover"
                  />
                ))}
            </div>
          </div>
        )}

        {/* Terms & Conditions */}
        {quote.terms && (
          <div className={`${theme.card.base} ${theme.card.padding}`}>
            <h2 className={`${theme.text.h3} mb-4`}>Terms & Conditions</h2>
            <div className="text-sm text-slate-700 whitespace-pre-wrap">{quote.terms}</div>
          </div>
        )}

        {/* Response Section */}
        {canRespond && !isExpired && (
          <div className={`${theme.card.base} ${theme.card.padding}`}>
            <h2 className={`${theme.text.h3} mb-4`}>Your Response</h2>
            
            {showCommentBox && (
              <div className="mb-4">
                <label className={theme.text.label}>Comments or Questions (Optional)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className={`${theme.input.base} ${theme.input.provider} mt-2`}
                  rows={3}
                  placeholder="Any questions or special requests?"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => handleResponse("approved")}
                disabled={responding}
                className={`flex-1 ${theme.button.provider} justify-center py-3 text-lg`}
              >
                <CheckCircle2 size={20} />
                {responding ? "Processing..." : "Accept Quote"}
              </button>
              <button
                onClick={() => handleResponse("declined")}
                disabled={responding}
                className="flex-1 bg-slate-100 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-200 transition flex items-center justify-center gap-2"
              >
                <XCircle size={20} />
                {responding ? "Processing..." : "Decline"}
              </button>
            </div>

            {!showCommentBox && (
              <button
                onClick={() => setShowCommentBox(true)}
                className="w-full mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Add a comment or question
              </button>
            )}
          </div>
        )}

        {/* Contact Provider */}
        <div className={`${theme.card.base} ${theme.card.padding} text-center`}>
          <h3 className={`${theme.text.h4} mb-3`}>Questions?</h3>
          <p className={`${theme.text.body} mb-4`}>
            Feel free to reach out to discuss this quote
          </p>
          {provider && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {provider.phone && (
                <a
                    href={`tel:${provider.phone}`}
                    className={`${theme.button.provider} justify-center`}
                >
                    <Phone size={18} />
                    Call Us
                </a>
                )}
              {provider.email && (
                <a
                  href={`mailto:${provider.email}`}
                  className={`${theme.button.secondary} justify-center`}
                >
                  <Mail size={18} />
                  Email Us
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-slate-200 py-6 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center text-sm text-slate-600">
          <p>Powered by PropDash</p>
        </div>
      </div>
    </div>
  );
}