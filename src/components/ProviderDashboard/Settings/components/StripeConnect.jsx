import { useState } from "react";
import { CreditCard, ExternalLink, DollarSign, TrendingUp, CheckCircle2 } from "lucide-react";
import { supabase } from "../../../../lib/supabaseClient";
import { theme } from "../../../../styles/theme";

export default function StripeConnect({ providerData, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const handleConnectStripe = async () => {
    setLoading(true);

    try {
      // TODO: Call your backend to create Stripe Connect onboarding link
      // const response = await fetch('/api/stripe/connect', {
      //   method: 'POST',
      //   body: JSON.stringify({ providerId: providerData.id })
      // });
      // const { url } = await response.json();
      // window.location.href = url;

      alert(
        "Stripe Connect integration coming soon! This will allow you to receive payments directly."
      );
    } catch (error) {
      console.error("Stripe connect error:", error);
      alert("Failed to connect Stripe. Please try again.");
    }

    setLoading(false);
  };

  const isConnected = providerData.stripe_connected;

  return (
    <div className="space-y-6">
      {/* Stripe Status */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-2.5 rounded-lg">
            <CreditCard className="text-purple-600" size={20} />
          </div>
          <div className="flex-1">
            <h3 className={theme.text.h4}>
              Payment Processing
            </h3>
            <p className={`${theme.text.muted} text-sm`}>
              Connect Stripe to receive payments from clients
            </p>
          </div>
          {isConnected && (
            <span className="px-3 py-1.5 bg-success-100 text-success-700 rounded-full text-sm font-semibold flex items-center gap-1">
              <CheckCircle2 size={14} />
              Connected
            </span>
          )}
        </div>

        {isConnected ? (
          /* Connected State */
          <div className="space-y-4">
            <div className="bg-success-50 border-2 border-success-200 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="text-success-600" size={24} />
                <div>
                  <p className="font-semibold text-success-900">
                    Stripe Account Connected
                  </p>
                  <p className="text-sm text-success-700">
                    You can now receive payments directly
                  </p>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className={`${theme.text.caption} mb-1`}>Available Balance</p>
                <p className={`${theme.text.h2}`}>$0.00</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className={`${theme.text.caption} mb-1`}>Pending</p>
                <p className={`${theme.text.h2}`}>$0.00</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <a
                href="https://dashboard.stripe.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`${theme.button.secondaryOutline} flex-1 text-center`}
              >
                <ExternalLink size={18} />
                Open Stripe Dashboard
              </a>
              <button className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition font-semibold flex items-center justify-center gap-2">
                Manage Payouts
              </button>
            </div>
          </div>
        ) : (
          /* Not Connected State */
          <div className="space-y-4">
            <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-5">
              <h4 className="font-semibold text-primary-900 mb-3">
                Why Connect Stripe?
              </h4>
              <ul className="space-y-2 text-sm text-primary-800">
                <li className="flex items-start gap-2">
                  <DollarSign size={16} className="flex-shrink-0 mt-0.5" />
                  <span>Receive payments directly from clients</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp size={16} className="flex-shrink-0 mt-0.5" />
                  <span>Fast payouts (2-3 business days)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
                  <span>Secure & PCI compliant</span>
                </li>
                <li className="flex items-start gap-2">
                  <CreditCard size={16} className="flex-shrink-0 mt-0.5" />
                  <span>Accept cards, ACH, and digital wallets</span>
                </li>
              </ul>
            </div>

            {/* Connect Button */}
            <button
              onClick={handleConnectStripe}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
            >
              <CreditCard size={20} />
              {loading ? "Connecting..." : "Connect with Stripe"}
            </button>

            {/* Info */}
            <div className="bg-slate-50 rounded-lg p-4">
              <p className={`${theme.text.caption} leading-relaxed`}>
                <strong>Note:</strong> You'll be redirected to Stripe to complete
                a quick verification process. This typically takes 5-10 minutes
                and requires your business information and bank account details.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Subscription Info */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-success-100 p-2.5 rounded-lg">
            <DollarSign className="text-success-600" size={20} />
          </div>
          <div>
            <h3 className={theme.text.h4}>Subscription</h3>
            <p className={`${theme.text.muted} text-sm`}>Your current plan</p>
          </div>
        </div>

        <div className="bg-success-50 border border-success-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className={`${theme.text.h5} mb-1`}>Free Plan</p>
              <p className={`${theme.text.caption}`}>
                All core features included
              </p>
            </div>
            <span className="bg-success-100 text-success-700 px-3 py-1 rounded-full text-xs font-bold">
              ACTIVE
            </span>
          </div>

          <div className="pt-3 border-t border-success-200">
            <p className={theme.text.caption}>
              💡 Premium plans with advanced features coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}