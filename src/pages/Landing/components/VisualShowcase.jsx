import { useState, useEffect } from "react";
import { CheckCircle2, Shield, Award, TrendingUp } from "lucide-react";
import professionalServiceImg from "../../../assets/professional_service.jpg";
import businessGrowthImg from "../../../assets/business_growth.jpg";

export default function VisualShowcase() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate parallax with proper bounds
  const getParallaxX = (multiplier) => {
    const offset = scrollY * multiplier;
    return Math.max(-30, Math.min(30, offset)); // Limit to -30px to 30px
  };

  const getParallaxY = (multiplier) => {
    const offset = scrollY * multiplier;
    return Math.max(-20, Math.min(20, offset)); // Limit to -20px to 20px
  };

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-secondary-50 overflow-hidden fade-in-section opacity-0">
      <div className="max-w-7xl mx-auto px-6">
        {/* Property Owners Section */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center mb-32">
          {/* Left Content */}
          <div className="space-y-6 order-2 md:order-1">
            <span className="px-4 py-2 bg-accent-50 border-2 border-accent-200 text-accent-700 rounded-full text-sm font-semibold inline-block">
              For Property Owners
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-secondary-900 leading-tight">
              Your Property Deserves
              <span className="block text-accent-700 mt-2">Expert Care</span>
            </h2>
            <p className="text-lg md:text-xl text-secondary-600 leading-relaxed">
              Connect with licensed professionals who understand your property needs and deliver exceptional results.
            </p>

            <div className="space-y-4 pt-4">
              {[
                { icon: <CheckCircle2 />, text: "Verified credentials and insurance" },
                { icon: <Shield />, text: "Background-checked professionals" },
                { icon: <Award />, text: "Quality guaranteed or money back" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 group"
                >
                  <div className="bg-accent-100 p-3 rounded-lg text-accent-700 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 flex-shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-base md:text-lg font-medium text-secondary-700">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative order-1 md:order-2 min-h-[400px] md:min-h-[500px]">
            {/* Main Image Container */}
            <div className="relative group h-full">
              {/* Background Decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-400 to-accent-600 rounded-3xl transform rotate-3 md:rotate-6 group-hover:rotate-12 transition-transform duration-500 opacity-20"></div>
              
              {/* Main Card */}
              <div className="relative bg-gradient-to-br from-accent-100 to-accent-200 rounded-3xl p-6 md:p-8 shadow-2xl transform group-hover:-translate-y-2 transition-all duration-500 h-full">
                <div className="aspect-[4/3] md:aspect-video bg-white/50 rounded-2xl overflow-hidden backdrop-blur-sm border-2 border-white">
                  <img 
                    src={professionalServiceImg} 
                    alt="Professional providing expert service to happy homeowner"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Floating Stat Cards - Hidden on mobile to prevent overflow */}
            <div className="hidden md:block absolute -top-6 -left-6 lg:-top-8 lg:-left-8 bg-white rounded-2xl p-4 lg:p-6 shadow-xl border-2 border-accent-200 animate-float max-w-[180px]">
              <div className="text-2xl lg:text-3xl font-bold text-accent-700">98%</div>
              <div className="text-xs lg:text-sm text-secondary-600">Satisfaction Rate</div>
            </div>

            <div className="hidden md:block absolute -bottom-6 -right-6 lg:-bottom-8 lg:-right-8 bg-white rounded-2xl p-4 lg:p-6 shadow-xl border-2 border-success-200 animate-float max-w-[180px]" style={{ animationDelay: "1s" }}>
              <div className="text-2xl lg:text-3xl font-bold text-success-700">&lt;2hrs</div>
              <div className="text-xs lg:text-sm text-secondary-600">Avg Response</div>
            </div>
          </div>
        </div>

        {/* Professionals Section */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Visual */}
          <div className="relative min-h-[400px] md:min-h-[500px]">
            {/* Main Image Container */}
            <div className="relative group h-full">
              {/* Background Decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl transform -rotate-3 md:-rotate-6 group-hover:-rotate-12 transition-transform duration-500 opacity-20"></div>
              
              {/* Main Card */}
              <div className="relative bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl p-6 md:p-8 shadow-2xl transform group-hover:-translate-y-2 transition-all duration-500 h-full">
                <div className="aspect-[4/3] md:aspect-video bg-white/50 rounded-2xl overflow-hidden backdrop-blur-sm border-2 border-white">
                  <img 
                    src={businessGrowthImg} 
                    alt="Professional using dashboard to grow their business"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Floating Stat Cards - Hidden on mobile to prevent overflow */}
            <div className="hidden md:block absolute -top-6 -right-6 lg:-top-8 lg:-right-8 bg-white rounded-2xl p-4 lg:p-6 shadow-xl border-2 border-primary-200 animate-float max-w-[180px]">
              <div className="text-2xl lg:text-3xl font-bold text-primary-700">+40%</div>
              <div className="text-xs lg:text-sm text-secondary-600">Revenue Growth</div>
            </div>

            <div className="hidden md:block absolute -bottom-6 -left-6 lg:-bottom-8 lg:-left-8 bg-white rounded-2xl p-4 lg:p-6 shadow-xl border-2 border-success-200 animate-float max-w-[180px]" style={{ animationDelay: "1s" }}>
              <div className="text-2xl lg:text-3xl font-bold text-success-700">500+</div>
              <div className="text-xs lg:text-sm text-secondary-600">Active Pros</div>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-6">
            <span className="px-4 py-2 bg-primary-50 border-2 border-primary-200 text-primary-700 rounded-full text-sm font-semibold inline-block">
              For Service Professionals
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-secondary-900 leading-tight">
              Grow Your Business
              <span className="block text-primary-700 mt-2">With Smart Tools</span>
            </h2>
            <p className="text-lg md:text-xl text-secondary-600 leading-relaxed">
              Professional-grade platform designed to help you win more work, save time, and scale your business.
            </p>

            <div className="space-y-4 pt-4">
              {[
                { icon: <TrendingUp />, text: "Quality leads matched to your skills" },
                { icon: <Award />, text: "AI-powered quote generation" },
                { icon: <Shield />, text: "Secure payment processing" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 group"
                >
                  <div className="bg-primary-100 p-3 rounded-lg text-primary-700 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 flex-shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-base md:text-lg font-medium text-secondary-700">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}