import { useState } from "react";
import { Smartphone, CheckCircle2, Send, AlertCircle } from "lucide-react";
import { supabase } from "../../../../lib/supabaseClient";
import { validatePhone, formatPhone, generateVerificationCode } from "../utils/settingsHelpers";
import { theme } from "../../../../styles/theme";

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
    <div className={`${theme.card.base} ${theme.card.padding}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-success-100 p-2.5 rounded-lg">
          <Smartphone className="text-success-600" size={20} />
        </div>
        <div className="flex-1">
          <h3 className={theme.text.h4}>Phone Number</h3>
          <p className={`${theme.text.muted} text-sm`}>
            Verify your phone for SMS notifications and booking alerts
          </p>
        </div>
        {phoneVerified && (
          <span className="px-3 py-1.5 bg-success-100 text-success-700 rounded-full text-sm font-semibold flex items-center gap-1">
            <CheckCircle2 size={14} />
            Verified
          </span>
        )}
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className={`${theme.alert.error} mb-4 flex items-center gap-2 text-sm`}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      {success && (
        <div className={`${theme.alert.success} mb-4 flex items-center gap-2 text-sm`}>
          <CheckCircle2 size={16} />
          {success}
        </div>
      )}

      <div className="space-y-4">
        {/* Phone Input */}
        <div>
          <label className={`${theme.text.label} block mb-2`}>
            Phone Number
          </label>
          <div className="flex gap-2">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!editing || loading}
              className={`${theme.input.base} ${theme.input.focus} ${theme.input.disabled} flex-1`}
              placeholder="(555) 123-4567"
            />
            {!editing && phoneVerified && (
              <button
                onClick={() => setEditing(true)}
                className={theme.button.secondaryOutline}
              >
                Change
              </button>
            )}
          </div>
        </div>

        {/* Verification Code Input */}
        {codeSent && editing && (
          <div>
            <label className={`${theme.text.label} block mb-2`}>
              Verification Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                disabled={loading}
                className={`${theme.input.base} ${theme.input.focus} flex-1`}
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
              <button
                onClick={handleVerify}
                disabled={loading || verificationCode.length !== 6}
                className="px-6 py-3 bg-success-600 text-white rounded-xl hover:bg-success-700 transition disabled:opacity-50 font-semibold"
              >
                Verify
              </button>
            </div>
            <p className={`${theme.text.caption} mt-2`}>
              Didn't receive code?{" "}
              <button
                onClick={handleSendCode}
                className="text-primary-600 hover:text-primary-700 font-medium"
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
            className={`${theme.button.primary} w-full py-3 disabled:opacity-50 justify-center`}
          >
            <Send size={18} />
            {loading ? "Sending..." : "Send Verification Code"}
          </button>
        )}

        {/* Benefits */}
        {!phoneVerified && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-primary-900 mb-2">
              Why verify your phone?
            </p>
            <ul className="text-xs text-primary-800 space-y-1">
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