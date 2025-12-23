//levlpro-mvp\src\components\CustomerDashboard\Settings\components\PhoneVerification.jsx
import { useState } from "react";
import { Smartphone, CheckCircle2, Send, AlertCircle } from "lucide-react";
import { supabase } from "../../../../lib/supabaseClient";

export default function PhoneVerification({
  currentPhone,
  phoneVerified,
  userId,
  onVerificationSuccess,
}) {
  const [phone, setPhone] = useState(currentPhone || "");
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateCode = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  const handleSendCode = async () => {
    setError("");
    setLoading(true);

    const code = generateCode();
    setSentCode(code);

    try {
      await supabase
        .from("customers")
        .update({ phone, phone_verified: false })
        .eq("id", userId);

      console.log("DEV VERIFICATION CODE:", code);
      alert(`Dev Mode: Your code is ${code}`);

      setCodeSent(true);
    } catch (err) {
      setError("Failed to send verification code");
    }

    setLoading(false);
  };

  const handleVerify = async () => {
    if (verificationCode !== sentCode) {
      setError("Invalid code");
      return;
    }

    setLoading(true);

    await supabase
      .from("customers")
      .update({ phone_verified: true })
      .eq("id", userId);

    onVerificationSuccess?.();
    setCodeSent(false);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-card border-2 border-secondary-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary-100 p-3 rounded-xl">
          <Smartphone className="text-primary-600" size={20} />
        </div>
        <h3 className="text-lg font-semibold text-secondary-900">Phone Number</h3>
        {phoneVerified && (
          <span className="ml-auto text-success-600 flex items-center gap-1 text-sm font-semibold">
            <CheckCircle2 size={16} /> Verified
          </span>
        )}
      </div>

      {error && (
        <div className="bg-error-50 border-2 border-error-200 text-error-800 p-3 rounded-xl flex items-center gap-2 mb-4">
          <AlertCircle size={16} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full border-2 border-secondary-300 rounded-xl px-4 py-3 mb-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-300"
        placeholder="(555) 123-4567"
      />

      {codeSent && (
        <div className="flex gap-2 mb-3">
          <input
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="flex-1 border-2 border-secondary-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-300"
            placeholder="Enter code"
          />
          <button
            onClick={handleVerify}
            disabled={loading}
            className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-primary-500/20"
          >
            Verify
          </button>
        </div>
      )}

      {!codeSent && (
        <button
          onClick={handleSendCode}
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Sending...
            </>
          ) : (
            <>
              <Send size={18} />
              Send Verification Code
            </>
          )}
        </button>
      )}
    </div>
  );
}