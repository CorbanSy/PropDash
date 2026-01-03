import { useState, useEffect } from "react";
import {
  Wrench,
  Zap,
  Droplets,
  Wind,
  Hammer,
  PaintBucket,
  Fence,
  Trees,
  ChevronLeft,
  ChevronRight,
  Shield,
  Award,
  Star,
  CheckCircle,
  Lock,
  Users,
} from "lucide-react";

const categories = [
  { icon: <Wrench size={32} />, name: "General Contracting", color: "primary" },
  { icon: <Zap size={32} />, name: "Electrical", color: "warning" },
  { icon: <Droplets size={32} />, name: "Plumbing", color: "info" },
  { icon: <Wind size={32} />, name: "HVAC", color: "accent" },
  { icon: <Hammer size={32} />, name: "Carpentry", color: "secondary" },
  { icon: <PaintBucket size={32} />, name: "Painting", color: "premium" },
  { icon: <Fence size={32} />, name: "Fencing", color: "primary" },
  { icon: <Trees size={32} />, name: "Landscaping", color: "success" },
];

const badges = [
  { icon: <Shield size={20} />, text: "Licensed & Insured", color: "primary" },
  { icon: <Award size={20} />, text: "Top Rated 2024", color: "warning" },
  { icon: <Star size={20} />, text: "5-Star Service", color: "warning" },
  { icon: <CheckCircle size={20} />, text: "Background Checked", color: "success" },
  { icon: <Lock size={20} />, text: "Secure Payments", color: "info" },
  { icon: <Users size={20} />, text: "10,000+ Jobs", color: "accent" },
  { icon: <Shield size={20} />, text: "Money-Back Guarantee", color: "success" },
  { icon: <Award size={20} />, text: "Industry Certified", color: "premium" },
];

export default function ServiceCategories() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [badgePosition, setBadgePosition] = useState(0);

  // Handle responsive items per view for categories
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 768) setItemsPerView(2);
      else if (window.innerWidth < 1024) setItemsPerView(3);
      else setItemsPerView(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-rotate categories
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Animate trust badges
  useEffect(() => {
    const interval = setInterval(() => {
      setBadgePosition((prev) => (prev - 1) % (badges.length * 200));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % categories.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  return (
    <section className="py-16 md:py-20 bg-white overflow-hidden fade-in-section opacity-0">
      <div className="max-w-7xl mx-auto px-6">
        {/* Service Categories Header */}
        <div className="text-center mb-12">
          <span className="px-4 py-2 bg-primary-50 border-2 border-primary-200 text-primary-700 rounded-full text-sm font-semibold inline-block mb-4">
            Popular Services
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-secondary-900">
            Every Service You Need
          </h2>
          <p className="text-lg text-secondary-600">
            From routine maintenance to major renovations
          </p>
        </div>

        {/* Service Categories Carousel */}
        <div className="relative mb-16">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-secondary-200"
          >
            <ChevronLeft className="w-6 h-6 text-secondary-700" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-secondary-200"
          >
            <ChevronRight className="w-6 h-6 text-secondary-700" />
          </button>

          {/* Carousel */}
          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
              }}
            >
              {categories.map((category, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 bg-gradient-to-br from-${category.color}-50 to-white rounded-2xl p-8 border-2 border-${category.color}-200 hover:border-${category.color}-400 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer`}
                  style={{ width: `calc(${100 / itemsPerView}% - ${(24 * (itemsPerView - 1)) / itemsPerView}px)` }}
                >
                  <div className={`bg-${category.color}-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4 text-${category.color}-700 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 group-hover:text-primary-700 transition-colors duration-300">
                    {category.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {categories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary-700 w-8"
                    : "bg-secondary-300 hover:bg-secondary-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Trust Badges Infinite Scroll */}
        <div className="py-10 border-y-2 border-secondary-200 overflow-hidden mb-16">
          <div className="mb-6 text-center">
            <p className="text-sm font-semibold text-secondary-600 uppercase tracking-wider">
              Trusted by Property Owners & Professionals
            </p>
          </div>
          
          <div className="relative">
            <div
              className="flex gap-6 items-center"
              style={{
                transform: `translateX(${badgePosition}px)`,
                transition: "transform 0.03s linear",
              }}
            >
              {/* Duplicate badges for seamless loop */}
              {[...badges, ...badges, ...badges].map((badge, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-${badge.color}-50 border-2 border-${badge.color}-200 rounded-full hover:scale-110 transition-transform duration-300 cursor-default`}
                >
                  <div className={`text-${badge.color}-700`}>{badge.icon}</div>
                  <span className={`font-semibold text-${badge.color}-900 whitespace-nowrap text-sm`}>
                    {badge.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Gradient Overlays */}
            <div className="absolute inset-y-0 left-0 w-24 md:w-32 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-24 md:w-32 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* Trusted Companies Section */}
        <div className="bg-secondary-50 rounded-2xl border-2 border-secondary-200 py-10 px-6">
          <p className="text-secondary-600 text-sm font-semibold mb-8 text-center uppercase tracking-wider">
            Trusted by Leading Companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {["Company A", "Company B", "Company C", "Company D", "Company E"].map((company, index) => (
              <div
                key={index}
                className="bg-white px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer border-2 border-secondary-200"
              >
                <span className="font-bold text-secondary-400 text-base md:text-lg whitespace-nowrap">
                  {company}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}