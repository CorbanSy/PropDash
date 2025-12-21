//levlpro-mvp\src\components\ProviderDashboard\Network\components\Shared\NetworkHeader.jsx
import { Users, Share2, UserPlus, Briefcase } from "lucide-react";
import { theme } from "../../../../../styles/theme";

export default function NetworkHeader() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className={theme.text.h1}>Professional Network</h1>
        <p className={`${theme.text.body} mt-1`}>
          Manage trusted provider relationships and referral partnerships
        </p>
      </div>

      {/* Hero Header – JobDetails style */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-700 via-primary-800 to-primary-900" />

        {/* Subtle Glow */}
        <div className="absolute top-12 right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10 p-8 text-white">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Users size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Your Professional Network</h2>
              <p className="text-primary-100 mt-1 max-w-2xl">
                Build trusted referral relationships with other verified service providers.
                Grow your business through collaboration — without giving up control.
              </p>
            </div>
          </div>

          {/* Steps / Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard
              icon={<UserPlus size={20} />}
              title="Discover Providers"
              description="Find verified professionals by service type and location"
            />
            <InfoCard
              icon={<Briefcase size={20} />}
              title="Form Partnerships"
              description="Connect and agree on referral terms transparently"
            />
            <InfoCard
              icon={<Share2 size={20} />}
              title="Send Referrals"
              description="Refer jobs confidently to providers you trust"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, description }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-300">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      <p className="text-sm text-primary-100 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
