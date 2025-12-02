import { Link as LinkIcon, Wand2, Clock, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function Home() {
  // Temporary mock data for MVP
  const upcoming = [
    {
      id: 1,
      service: "Furniture Assembly",
      time: "Mon 2:00 PM",
      price: 160,
      client: "Sarah J.",
    },
    {
      id: 2,
      service: "TV Mounting",
      time: "Tue 10:00 AM",
      price: 120,
      client: "Marcus R.",
    },
  ];

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("https://app.com/book/ruben");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back, Ruben 👋</h1>
        <p className="text-slate-500 text-sm mt-1">
          Here’s what’s happening with your business today.
        </p>
      </div>

      {/* Booking Link */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
        <div>
          <p className="text-xs font-bold text-slate-800">My Booking Link</p>
          <p className="text-[11px] text-slate-400">app.com/book/ruben</p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-blue-600 text-xs font-bold"
        >
          <LinkIcon className="w-4 h-4" />
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* AI Quote Builder */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 rounded-2xl text-white shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <Wand2 className="w-5 h-5" />
          <span className="font-bold text-sm">AI Quote Builder</span>
        </div>
        <p className="text-[12px] opacity-90 mb-4">
          Turn a photo into a professional estimate in seconds.
        </p>

        <button className="bg-white/20 py-2 px-3 rounded-lg text-xs font-bold hover:bg-white/30 transition">
          Create Quote
        </button>
      </div>

      {/* Upcoming Schedule */}
      <div>
        <h2 className="text-sm font-bold text-slate-700 mb-3">Upcoming Bookings</h2>

        {upcoming.length === 0 ? (
          <p className="text-slate-400 text-sm text-center">
            No upcoming jobs. Share your link to get booked.
          </p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((job) => (
              <div
                key={job.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-start"
              >
                <div>
                  <p className="text-sm font-bold text-slate-800">{job.service}</p>
                  <p className="text-[12px] text-slate-500 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" /> {job.time} • {job.client}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900">${job.price}</p>
                  <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-bold">
                    CONFIRMED
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
