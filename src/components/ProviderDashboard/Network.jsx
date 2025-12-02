import { Users, DollarSign, ShieldCheck, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

export default function Network() {
  const [copied, setCopied] = useState(false);

  const handleCopyInvite = () => {
    navigator.clipboard.writeText("https://app.com/invite/ruben");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Temporary mock data
  const partnerReferrals = [
    {
      id: 1,
      client: "Mrs. Jones",
      service: "Lawn Mowing",
      amount: 5.0,
    },
    {
      id: 2,
      client: "Kevin S.",
      service: "Carpet Cleaning",
      amount: 7.0,
    },
  ];

  const trustedPartners = [
    {
      id: 1,
      name: "Sarah's Lawn Care",
      service: "Lawn Mowing",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&mouth=smile",
      note: "Sarah is the only landscaper I trust for my own home.",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Earnings Summary */}
      <div className="bg-green-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-green-200 text-xs font-bold uppercase mb-1">
            Network Earnings
          </p>
          <h3 className="text-4xl font-black">$45.00</h3>
          <p className="text-green-100 text-xs mt-2">
            Earned when your clients book other trusted services.
          </p>
        </div>
        <Users className="absolute right-2 bottom-2 w-28 h-28 text-white opacity-10" />
      </div>

      {/* Recent Activity */}
      <div>
        <h4 className="font-bold text-slate-800 mb-3 text-sm">Recent Activity</h4>

        <div className="space-y-3">
          {partnerReferrals.map((activity) => (
            <div
              key={activity.id}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {activity.client}
                  </p>
                  <p className="text-xs text-slate-500">
                    Booked a {activity.service}
                  </p>
                </div>
              </div>

              <span className="text-green-600 font-bold text-sm">
                +${activity.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Trusted Partner Recommendation */}
      <div>
        <h4 className="font-bold text-slate-800 mb-3 text-sm">
          Trusted Partners
        </h4>

        {trustedPartners.map((partner) => (
          <div
            key={partner.id}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={partner.avatar}
                alt=""
                className="w-12 h-12 rounded-full bg-slate-100"
              />
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {partner.name}
                </p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Partner
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 italic mb-4">
              "{partner.note}"
            </p>

            <button className="w-full bg-green-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-green-700 transition">
              Book {partner.service}
            </button>
          </div>
        ))}
      </div>

      {/* Invite Section */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center shadow-sm">
        <p className="text-xs text-slate-500 mb-3">
          Invite other pros or clients to expand your network.
        </p>

        <button
          onClick={handleCopyInvite}
          className="w-full py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-100 flex items-center justify-center gap-2"
        >
          <LinkIcon className="w-4 h-4" />
          {copied ? "Invite Link Copied!" : "Copy Invite Link"}
        </button>
      </div>
    </div>
  );
}
