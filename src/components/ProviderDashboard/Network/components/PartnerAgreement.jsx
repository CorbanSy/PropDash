//levlpro-mvp\src\components\ProviderDashboard\Network\components\PartnerAgreement.jsx
import { useState } from "react";
import { X, FileText, CheckCircle2, Download, Shield } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { getPartnerAgreement } from "../utils/commissionRules";

export default function PartnerAgreement({ partner, providerName, onAccept, onDecline, onClose }) {
  const [agreed, setAgreed] = useState(false);
  const agreement = getPartnerAgreement(providerName, partner.business_name);

  const handleAccept = () => {
    if (!agreed) {
      alert("Please check the box to agree to the terms");
      return;
    }
    onAccept(agreement);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="text-blue-600" size={24} />
              <h2 className={theme.text.h2}>Partner Agreement</h2>
            </div>
            <p className={theme.text.caption}>
              Review and accept the referral partnership terms
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Agreement Info */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="text-blue-600" size={20} />
              <h3 className="font-semibold text-blue-900">Partnership Overview</h3>
            </div>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• <strong>Between:</strong> {providerName} & {partner.business_name}</p>
              <p>• <strong>Standard Commission:</strong> 5% of job total</p>
              <p>• <strong>VIP Commission:</strong> 10% of job total (for qualified partners)</p>
              <p>• <strong>Payment Schedule:</strong> Monthly on the 15th</p>
              <p>• <strong>Minimum Payout:</strong> $25.00</p>
            </div>
          </div>

          {/* Agreement Text */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-6 max-h-96 overflow-y-auto">
            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">
              {agreement.terms}
            </pre>
          </div>

          {/* Key Highlights */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Key Points</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Both parties remain independent contractors</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Commission paid only on completed jobs</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Either party can terminate with 30 days notice</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Partner maintains own insurance and licensing</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Referring provider not liable for partner's work</span>
              </div>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded mt-0.5"
              />
              <span className="text-sm text-slate-700">
                I have read and agree to the terms of this Partner Referral Agreement. I understand
                that this creates a professional referral relationship and both parties remain
                independent contractors.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onDecline}
              className={`flex-1 ${theme.button.secondary} justify-center`}
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              disabled={!agreed}
              className={`flex-1 ${theme.button.provider} justify-center ${
                !agreed ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <CheckCircle2 size={18} />
              Accept Agreement
            </button>
          </div>

          {/* Download Option */}
          <button
            className="w-full py-2 text-sm text-slate-600 hover:text-slate-900 font-medium flex items-center justify-center gap-2 border-t border-slate-200 pt-4"
          >
            <Download size={16} />
            Download Agreement Copy
          </button>
        </div>
      </div>
    </div>
  );
}