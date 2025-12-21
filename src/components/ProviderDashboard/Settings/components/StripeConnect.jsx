//levlpro-mvp\src\components\ProviderDashboard\Settings\components\StripeConnect.jsx
import { useState } from "react";
import { CreditCard, ExternalLink, DollarSign, TrendingUp, CheckCircle2 } from "lucide-react";
import { supabase } from "../../../../lib/supabaseClient";

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
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-2.5 rounded-lg">
            <CreditCard className="text-purple-600" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900">
              Payment Processing
            </h3>
            <p className="text-sm text-slate-600">
              Connect Stripe to receive payments from clients
            </p>
          </div>
          {isConnected && (
            <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-1">
              <CheckCircle2 size={14} />
              Connected
            </span>
          )}
        </div>

        {isConnected ? (
          /* Connected State */
          <div className="space-y-4">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="text-green-600" size={24} />
                <div>
                  <p className="font-semibold text-green-900">
                    Stripe Account Connected
                  </p>
                  <p className="text-sm text-green-700">
                    You can now receive payments directly
                  </p>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-600 mb-1">Available Balance</p>
                <p className="text-2xl font-bold text-slate-900">$0.00</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-slate-900">$0.00</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <a
                href="https://dashboard.stripe.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition font-semibold text-center flex items-center justify-center gap-2"
              >
                <ExternalLink size={18} />
                Open Stripe Dashboard
              </a>
              <button className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition font-semibold">
                Manage Payouts
              </button>
            </div>
          </div>
        ) : (
          /* Not Connected State */
          <div className="space-y-4">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
              <h4 className="font-semibold text-blue-900 mb-3">
                Why Connect Stripe?
              </h4>
              <ul className="space-y-2 text-sm text-blue-800">
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
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Note:</strong> You'll be redirected to Stripe to complete
                a quick verification process. This typically takes 5-10 minutes
                and requires your business information and bank account details.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Subscription Info */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-100 p-2.5 rounded-lg">
            <DollarSign className="text-green-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Subscription</h3>
            <p className="text-sm text-slate-600">Your current plan</p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold text-slate-900 mb-1">Free Plan</p>
              <p className="text-sm text-slate-600">
                All core features included
              </p>
            </div>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
              ACTIVE
            </span>
          </div>

          <div className="pt-3 border-t border-green-200">
            <p className="text-xs text-slate-600">
              💡 Premium plans with advanced features coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}