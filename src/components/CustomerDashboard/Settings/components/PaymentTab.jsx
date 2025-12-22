//levlpro-mvp\src\components\CustomerDashboard\Settings\components\PaymentTab.jsx
import { CreditCard, Heart } from "lucide-react";

export default function PaymentTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-2.5 rounded-lg">
            <CreditCard className="text-purple-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Payment Methods
          </h3>
        </div>

        <div className="text-center py-12">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="text-slate-400" size={32} />
          </div>
          <p className="text-slate-900 font-semibold mb-2">
            Payment settings coming soon
          </p>
          <p className="text-slate-600 text-sm">
            Add credit cards to pay for services quickly and securely
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-100 p-2.5 rounded-lg">
            <Heart className="text-green-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Saved Professionals
          </h3>
        </div>

        <div className="text-center py-8">
          <p className="text-slate-600 text-sm">
            Save your favorite pros for quick booking
          </p>
          <button className="mt-4 text-green-600 font-semibold text-sm hover:text-green-700">
            Browse Pros →
          </button>
        </div>
      </div>
    </div>
  );
}