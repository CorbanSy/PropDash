// src/components/ProviderDashboard/Network/components/SmartInviteGenerator.jsx
import { useState } from "react";
import { QrCode, Copy, Mail, MessageSquare, Download, CheckCircle2, Sparkles } from "lucide-react";
import { theme } from "../../../../styles/theme";
import QRCode from "qrcode";

export default function SmartInviteGenerator({ userId, referralLink, onClose }) {
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [inviteData, setInviteData] = useState({
    trade: "",
    personalMessage: "",
    tone: "professional", // professional, casual, friendly
  });

  // Generate QR Code
  const generateQR = async () => {
    try {
      const url = await QRCode.toDataURL(referralLink, {
        width: 300,
        margin: 2,
        color: {
          dark: "#1e40af",
          light: "#ffffff",
        },
      });
      setQrCodeUrl(url);
    } catch (err) {
      console.error("Error generating QR code:", err);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement("a");
    link.download = "propdash-referral-qr.png";
    link.href = qrCodeUrl;
    link.click();
  };

  // Generate personalized invite message
  const generateMessage = () => {
    const messages = {
      professional: `Hi there!

I'm building a trusted network of service professionals and I'd love for you to join.

PropDash helps us manage jobs, get paid faster, and grow our businesses together. Plus, we can refer jobs to each other and both earn extra income.

Join my network here: ${referralLink}

Looking forward to working together!`,
      casual: `Hey!

I've been using PropDash to run my business and it's been a game changer. 

Thought you might want to check it out - we can connect our networks and refer jobs to each other. Easy extra money!

Here's my invite link: ${referralLink}

Let me know if you have questions!`,
      friendly: `Hi friend!

I wanted to invite you to join my network on PropDash! 🎉

It's this awesome platform where we can manage our businesses and refer jobs to each other. When you complete a job I refer, I earn a commission, and vice versa. Win-win!

Join here: ${referralLink}

Can't wait to work with you!`,
    };

    let baseMessage = messages[inviteData.tone];

    if (inviteData.trade) {
      baseMessage = `Specialty: ${inviteData.trade}\n\n` + baseMessage;
    }

    if (inviteData.personalMessage) {
      baseMessage = inviteData.personalMessage + "\n\n" + baseMessage;
    }

    return baseMessage;
  };

  const message = generateMessage();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-purple-600" size={24} />
        <h3 className={theme.text.h3}>Create Smart Invite</h3>
      </div>

      {/* Customization Options */}
      <div className="space-y-4">
        <div>
          <label className={theme.text.label}>Target Trade (Optional)</label>
          <select
            value={inviteData.trade}
            onChange={(e) => setInviteData({ ...inviteData, trade: e.target.value })}
            className={`${theme.input.base} ${theme.input.provider} mt-2`}
          >
            <option value="">Any Trade</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="HVAC">HVAC</option>
            <option value="Landscaping">Landscaping</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Painting">Painting</option>
            <option value="Carpentry">Carpentry</option>
            <option value="Roofing">Roofing</option>
          </select>
        </div>

        <div>
          <label className={theme.text.label}>Message Tone</label>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setInviteData({ ...inviteData, tone: "professional" })}
              className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium transition ${
                inviteData.tone === "professional"
                  ? "border-blue-400 bg-blue-50 text-blue-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              Professional
            </button>
            <button
              onClick={() => setInviteData({ ...inviteData, tone: "casual" })}
              className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium transition ${
                inviteData.tone === "casual"
                  ? "border-blue-400 bg-blue-50 text-blue-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              Casual
            </button>
            <button
              onClick={() => setInviteData({ ...inviteData, tone: "friendly" })}
              className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium transition ${
                inviteData.tone === "friendly"
                  ? "border-blue-400 bg-blue-50 text-blue-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              Friendly
            </button>
          </div>
        </div>

        <div>
          <label className={theme.text.label}>Personal Message (Optional)</label>
          <textarea
            value={inviteData.personalMessage}
            onChange={(e) => setInviteData({ ...inviteData, personalMessage: e.target.value })}
            className={`${theme.input.base} ${theme.input.provider} mt-2`}
            rows={3}
            placeholder="Add a personal touch to your invite..."
          />
        </div>
      </div>

      {/* Generated Message */}
      <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <label className={`${theme.text.label} mb-0`}>Generated Invite Message</label>
          <button
            onClick={() => handleCopy(message)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <div className="bg-white border border-slate-200 rounded p-4 text-sm text-slate-700 whitespace-pre-wrap">
          {message}
        </div>
      </div>

      {/* QR Code Section */}
      <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <QrCode className="text-purple-600" size={20} />
          <h4 className="font-semibold text-purple-900">QR Code Invite</h4>
        </div>
        <p className="text-sm text-purple-800 mb-4">
          Generate a QR code that partners can scan to instantly join your network
        </p>

        {qrCodeUrl ? (
          <div className="text-center">
            <img src={qrCodeUrl} alt="QR Code" className="mx-auto mb-4 rounded-lg border-4 border-white shadow-lg" />
            <div className="flex gap-2 justify-center">
              <button
                onClick={downloadQR}
                className={`${theme.button.secondary} flex items-center gap-2`}
              >
                <Download size={16} />
                Download QR
              </button>
              <button
                onClick={() => handleCopy(referralLink)}
                className={`${theme.button.secondary} flex items-center gap-2`}
              >
                <Copy size={16} />
                Copy Link
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={generateQR}
            className={`w-full ${theme.button.provider} justify-center`}
          >
            <QrCode size={18} />
            Generate QR Code
          </button>
        )}
      </div>

      {/* Quick Share Options */}
      <div>
        <h4 className="font-semibold text-slate-900 mb-3">Quick Share</h4>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              window.location.href = `mailto:?subject=Join my network on PropDash&body=${encodeURIComponent(message)}`;
            }}
            className="flex items-center justify-center gap-2 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition text-blue-700 font-medium"
          >
            <Mail size={20} />
            Email
          </button>
          <button
            onClick={() => {
              window.location.href = `sms:?body=${encodeURIComponent(message)}`;
            }}
            className="flex items-center justify-center gap-2 p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition text-green-700 font-medium"
          >
            <MessageSquare size={20} />
            Text
          </button>
        </div>
      </div>
    </div>
  );
}