//levlpro-mvp\src\components\CustomerDashboard\Settings\components\PaymentTab.jsx
import { CreditCard, Heart } from "lucide-react";

export default function PaymentTab() {
  return (
    <div className="space-y-6">
      {/* Payment Methods - PRIMARY ICON */}
      <div className="bg-white rounded-2xl shadow-card border-2 border-secondary-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary-100 p-3 rounded-xl">
            <CreditCard className="text-primary-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900">
            Payment Methods
          </h3>
        </div>

        <div className="text-center py-12">
          <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="text-secondary-400" size={32} />
          </div>
          <p className="text-secondary-900 font-semibold mb-2">
            Payment settings coming soon
          </p>
          <p className="text-secondary-600 text-sm">
            Add credit cards to pay for services quickly and securely
          </p>
        </div>
      </div>

      {/* Saved Professionals - PRIMARY ICON */}
      <div className="bg-white rounded-2xl shadow-card border-2 border-secondary-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary-100 p-3 rounded-xl">
            <Heart className="text-primary-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900">
            Saved Professionals
          </h3>
        </div>

        <div className="text-center py-8">
          <p className="text-secondary-600 text-sm">
            Save your favorite pros for quick booking
          </p>
          <button className="mt-4 text-primary-600 font-semibold text-sm hover:text-primary-700 transition-all duration-300">
            Browse Pros →
          </button>
        </div>
      </div>
    </div>
  );
}
