//levlpro-mvp\src\components\CustomerDashboard\Settings\components\ProfileTab.jsx
import { User, Mail, Phone, Save } from "lucide-react";
import ProfilePhotoUpload from "./ProfilePhotoUpload";
import PhoneVerification from "./PhoneVerification";

export default function ProfileTab({
  customerData,
  setCustomerData,
  user,
  handleSaveProfile,
  saving,
}) {
  return (
    <div className="space-y-6">

      {/* Profile Photo */}
      <ProfilePhotoUpload
        currentPhoto={customerData.profile_photo}
        userId={user.id}
        onUploadSuccess={handleSaveProfile}
      />

      {/* Phone Verification */}
      <PhoneVerification
        currentPhone={customerData.phone}
        phoneVerified={customerData.phone_verified}
        userId={user.id}
        onVerificationSuccess={handleSaveProfile}
      />

      {/* Personal Information - PRIMARY ICON */}
      <div className="bg-white rounded-2xl shadow-card border-2 border-secondary-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary-100 p-3 rounded-xl">
            <User className="text-primary-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900">
            Personal Information
          </h3>
        </div>

        <div className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-secondary-900 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={customerData.full_name}
              onChange={(e) =>
                setCustomerData({
                  ...customerData,
                  full_name: e.target.value,
                })
              }
              className="w-full border-2 border-secondary-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-300"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-secondary-900 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full border-2 border-secondary-200 rounded-xl px-4 py-3 bg-secondary-50 text-secondary-600"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-secondary-900 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={customerData.phone}
              onChange={(e) =>
                setCustomerData({
                  ...customerData,
                  phone: e.target.value,
                })
              }
              className="w-full border-2 border-secondary-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Save Button - PRIMARY GRADIENT */}
      <button
        onClick={handleSaveProfile}
        disabled={saving}
        className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 hover:scale-105"
      >
        {saving ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Saving Changes...
          </>
        ) : (
          <>
            <Save size={20} />
            Save All Changes
          </>
        )}
      </button>
    </div>
  );
}
