//levlpro-mvp\src\pages\Landing\components\TrustBadges.jsx
import { useEffect, useState } from "react";
import { Shield, Award, Star, CheckCircle, Lock, Users } from "lucide-react";

const badges = [
  { icon: <Shield size={24} />, text: "Licensed & Insured", color: "primary" },
  { icon: <Award size={24} />, text: "Top Rated 2024", color: "warning" },
  { icon: <Star size={24} />, text: "5-Star Service", color: "warning" },
  { icon: <CheckCircle size={24} />, text: "Background Checked", color: "success" },
  { icon: <Lock size={24} />, text: "Secure Payments", color: "info" },
  { icon: <Users size={24} />, text: "10,000+ Jobs", color: "accent" },
  { icon: <Shield size={24} />, text: "Money-Back Guarantee", color: "success" },
  { icon: <Award size={24} />, text: "Industry Certified", color: "premium" },
];

export default function TrustBadges() {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => (prev - 1) % (badges.length * 200));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white py-12 border-y-2 border-secondary-200 overflow-hidden">
      <div className="mb-6 text-center">
        <p className="text-sm font-semibold text-secondary-600 uppercase tracking-wider">
          Trusted by Property Owners & Professionals
        </p>
      </div>
      
      <div className="relative">
        <div
          className="flex gap-8 items-center"
          style={{
            transform: `translateX(${position}px)`,
            transition: "transform 0.03s linear",
          }}
        >
          {/* Duplicate badges for seamless loop */}
          {[...badges, ...badges, ...badges].map((badge, index) => (
            <div
              key={index}
              className={`flex-shrink-0 flex items-center gap-3 px-6 py-3 bg-${badge.color}-50 border-2 border-${badge.color}-200 rounded-full hover:scale-110 transition-transform duration-300 cursor-default`}
            >
              <div className={`text-${badge.color}-700`}>{badge.icon}</div>
              <span className={`font-semibold text-${badge.color}-900 whitespace-nowrap`}>
                {badge.text}
              </span>
            </div>
          ))}
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
}