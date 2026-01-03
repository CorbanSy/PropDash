//levlpro-mvp\src\pages\Landing\components\Stats.jsx
import { useEffect, useState, useRef } from "react";
import { Users, Briefcase, Star, Clock } from "lucide-react";

const stats = [
  { icon: Users, value: 500, suffix: "+", label: "Active Professionals", color: "primary" },
  { icon: Briefcase, value: 10000, suffix: "+", label: "Jobs Completed", color: "success" },
  { icon: Star, value: 4.9, suffix: "★", label: "Average Rating", color: "warning", decimal: true },
  { icon: Clock, value: 2, suffix: "hrs", label: "Response Time", color: "info", prefix: "<" },
];

function CountUpStat({ stat, isVisible }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = stat.value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= stat.value) {
        setCount(stat.value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, stat.value]);

  const displayValue = stat.decimal 
    ? count.toFixed(1) 
    : Math.floor(count).toLocaleString();

  return (
    <div className="group relative">
      {/* Background Glow */}
      <div className={`absolute inset-0 bg-${stat.color}-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      {/* Card */}
      <div className="relative bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl p-8 hover:bg-white/15 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
        {/* Icon */}
        <div className={`bg-${stat.color}-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
          <stat.icon className={`w-8 h-8 text-${stat.color}-700`} />
        </div>

        {/* Value */}
        <div className="text-5xl md:text-6xl font-extrabold mb-2 text-white">
          {stat.prefix}
          {displayValue}
          {stat.suffix}
        </div>

        {/* Label */}
        <div className="text-primary-200 text-sm md:text-base font-medium">
          {stat.label}
        </div>
      </div>
    </div>
  );
}

export default function StatsEnhanced() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20 shadow-2xl overflow-hidden fade-in-section opacity-0"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-float"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 15}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-extrabold mb-4">
            Trusted Platform, Proven Results
          </h3>
          <p className="text-primary-200 text-lg">
            Join thousands of satisfied customers and professionals
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="animate-slideUp"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: "forwards",
              }}
            >
              <CountUpStat stat={stat} isVisible={isVisible} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}