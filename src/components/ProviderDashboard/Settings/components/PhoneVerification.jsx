//levlpro-mvp\src\components\ProviderDashboard\Settings\components\PhoneVerification.jsx
import { useState } from "react";
import { Smartphone, CheckCircle2, Send, AlertCircle } from "lucide-react";
import { supabase } from "../../../../lib/supabaseClient";
import { validatePhone, formatPhone, generateVerificationCode } from "../utils/settingsHelpers";

export default function PhoneVerification({ currentPhone, phoneVerified, userId, onVerificationSuccess }) {
  const [phone, setPhone] = useState(currentPhone || "");
  const [editing, setEditing] = useState(!currentPhone);
  const [verificationCode, setVerificationCode] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendCode = async () => {
    setError("");
    setSuccess("");

    if (!validatePhone(phone)) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);

    // Generate code
    const code = generateVerificationCode();
    setSentCode(code);

    try {
      // Save phone to database (unverified)
      const { error: updateError } = await supabase
        .from("providers")
        .update({ 
          phone: phone,
          phone_verified: false,
        })
        .eq("id", userId);

      if (updateError) throw updateError;

      // TODO: Send SMS via Twilio/SNS
      // For now, show code in console (development only)
      console.log("Verification Code:", code);
      alert(`Development Mode: Your verification code is ${code}`);

      setCodeSent(true);
      setSuccess("Verification code sent!");
    } catch (err) {
      setError("Failed to send code. Please try again.");
      console.error(err);
    }

    setLoading(false);
  };

  const handleVerify = async () => {
    setError("");

    if (verificationCode !== sentCode) {
      setError("Invalid verification code");
      return;
    }

    setLoading(true);

    try {
      // Mark as verified
      const { error: updateError } = await supabase
        .from("providers")
        .update({ 
          phone_verified: true,
        })
        .eq("id", userId);

      if (updateError) throw updateError;

      setSuccess("Phone verified successfully! ✓");
      setEditing(false);
      setCodeSent(false);
      onVerificationSuccess();
    } catch (err) {
      setError("Verification failed. Please try again.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-100 p-2.5 rounded-lg">
          <Smartphone className="text-green-600" size={20} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900">Phone Number</h3>
          <p className="text-sm text-slate-600">
            Verify your phone for SMS notifications and booking alerts
          </p>
        </div>
        {phoneVerified && (
          <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-1">
            <CheckCircle2 size={14} />
            Verified
          </span>
        )}
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg flex items-center gap-2 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg flex items-center gap-2 text-sm">
          <CheckCircle2 size={16} />
          {success}
        </div>
      )}

      <div className="space-y-4">
        {/* Phone Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Phone Number
          </label>
          <div className="flex gap-2">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!editing || loading}
              className="flex-1 border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition disabled:bg-slate-50 disabled:text-slate-500"
              placeholder="(555) 123-4567"
            />
            {!editing && phoneVerified && (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition font-semibold"
              >
                Change
              </button>
            )}
          </div>
        </div>

        {/* Verification Code Input */}
        {codeSent && editing && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Verification Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                disabled={loading}
                className="flex-1 border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
              <button
                onClick={handleVerify}
                disabled={loading || verificationCode.length !== 6}
                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50 font-semibold"
              >
                Verify
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Didn't receive code?{" "}
              <button
                onClick={handleSendCode}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Resend
              </button>
            </p>
          </div>
        )}

        {/* Send Code Button */}
        {editing && !codeSent && (
          <button
            onClick={handleSendCode}
            disabled={loading || !validatePhone(phone)}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Send size={18} />
            {loading ? "Sending..." : "Send Verification Code"}
          </button>
        )}

        {/* Benefits */}
        {!phoneVerified && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-900 mb-2">
              Why verify your phone?
            </p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>✓ Instant SMS alerts for new bookings</li>
              <li>✓ Appointment reminders</li>
              <li>✓ Increased trust from clients</li>
              <li>✓ Enable 2FA security (coming soon)</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}