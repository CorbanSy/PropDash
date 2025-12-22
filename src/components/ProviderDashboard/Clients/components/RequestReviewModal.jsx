//levlpro-mvp\src\components\ProviderDashboard\Clients\components\RequestReviewModal.jsx
import { useState } from "react";
import { X, Star, Send, MessageSquare, Mail } from "lucide-react";
import { theme } from "../../../../styles/theme";

export default function RequestReviewModal({ client, onClose }) {
  const [method, setMethod] = useState("sms"); // sms, email
  const [customMessage, setCustomMessage] = useState("");

  const defaultMessages = {
    sms: `Hi ${client.full_name || "there"}! Thank you for choosing us for your recent service. We'd love to hear your feedback! Could you take a moment to leave us a review? [REVIEW_LINK]`,
    email: `Dear ${client.full_name || "Valued Customer"},

Thank you for choosing our services. We hope you're satisfied with the work we completed.

Your feedback is incredibly valuable to us and helps other customers make informed decisions. Would you mind taking a few minutes to leave us a review?

[REVIEW_LINK]

Thank you for your time and business!

Best regards,
Your Service Team`,
  };

  const message = customMessage || defaultMessages[method];

  const handleSend = () => {
    if (method === "sms" && client.phone) {
      window.location.href = `sms:${client.phone}?body=${encodeURIComponent(message)}`;
    } else if (method === "email" && client.email) {
      window.location.href = `mailto:${client.email}?subject=We'd love your feedback!&body=${encodeURIComponent(message)}`;
    } else {
      alert(`No ${method} available for this client`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 flex items-start justify-between text-white">
          <div className="flex items-center gap-3">
            <Star size={28} className="fill-white" />
            <div>
              <h2 className="text-2xl font-bold">Request Review</h2>
              <p className="text-amber-100">from {client.full_name || "Unknown Client"}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Method Selection */}
          <div>
            <label className={theme.text.label}>Send Via</label>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setMethod("sms")}
                className={`flex-1 p-4 rounded-lg border-2 transition ${
                  method === "sms"
                    ? "border-blue-400 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <MessageSquare className="mx-auto mb-2 text-blue-600" size={24} />
                <p className="font-semibold text-slate-900">Text Message</p>
                <p className="text-xs text-slate-600 mt-1">{client.phone || "No phone"}</p>
              </button>

              <button
                onClick={() => setMethod("email")}
                className={`flex-1 p-4 rounded-lg border-2 transition ${
                  method === "email"
                    ? "border-blue-400 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <Mail className="mx-auto mb-2 text-purple-600" size={24} />
                <p className="font-semibold text-slate-900">Email</p>
                <p className="text-xs text-slate-600 mt-1">{client.email || "No email"}</p>
              </button>
            </div>
          </div>

          {/* Message Preview */}
          <div>
            <label className={theme.text.label}>Message Preview</label>
            <textarea
              value={message}
              onChange={(e) => setCustomMessage(e.target.value)}
              className={`${theme.input.base} ${theme.input.provider} mt-2 font-mono text-sm`}
              rows={method === "email" ? 10 : 5}
            />
            <p className="text-xs text-slate-500 mt-2">
              💡 Tip: [REVIEW_LINK] will be replaced with your actual review link
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Star className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-amber-900">
                <p className="font-semibold mb-1">Pro Tip:</p>
                <p>
                  Request reviews within 24-48 hours of completing a job for the best response rate.
                  Personalized messages get 3x more reviews!
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className={`flex-1 ${theme.button.secondary} justify-center`}
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={
                (method === "sms" && !client.phone) ||
                (method === "email" && !client.email)
              }
              className={`flex-1 ${theme.button.provider} justify-center ${
                ((method === "sms" && !client.phone) ||
                (method === "email" && !client.email))
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <Send size={18} />
              Send Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}