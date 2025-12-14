// src/components/ProviderDashboard/Network/components/Shared/NetworkHeader.jsx
import { Users } from "lucide-react";
import { theme } from "../../../../../styles/theme";

export default function NetworkHeader() {
  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h1 className={theme.text.h1}>Professional Network</h1>
          <p className={`${theme.text.body} mt-1`}>
            Connect with other professionals for referrals and collaborations
          </p>
        </div>
      </div>

      <div className={`${theme.gradient.providerLight} rounded-2xl p-8 text-white relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <Users size={28} />
            <h2 className="text-2xl font-bold">Your Professional Network</h2>
          </div>
          <p className="text-blue-100 mb-6 max-w-2xl">
            Build your professional network by connecting with other service providers. Send referrals to trusted connections and grow your business together.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard
              title="1. Find Professionals"
              description="Browse and search for professionals by service or location"
            />
            <InfoCard
              title="2. Send Invite"
              description="Request to connect with professionals you want to partner with"
            />
            <InfoCard
              title="3. Share Referrals"
              description="Send customer referrals to your trusted connections"
            />
          </div>
        </div>
      </div>
    </>
  );
}

function InfoCard({ title, description }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
      <div className="text-xl font-bold mb-2">{title}</div>
      <p className="text-sm text-blue-100">{description}</p>
    </div>
  );
}