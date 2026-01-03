//levlpro-mvp\src\pages\Landing\components\ServiceCategories.jsx
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

export default function ServiceCategories() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % categories.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  const getVisibleCategories = () => {
    const visible = [];
    for (let i = 0; i < itemsPerView; i++) {
      visible.push(categories[(currentIndex + i) % categories.length]);
    }
    return visible;
  };

  return (
    <section className="py-20 bg-white overflow-hidden fade-in-section opacity-0">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="px-4 py-2 bg-primary-50 border-2 border-primary-200 text-primary-700 rounded-full text-sm font-semibold inline-block mb-4">
            Popular Services
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-secondary-900">
            Every Service You Need
          </h2>
          <p className="text-lg text-secondary-600">
            From routine maintenance to major renovations
          </p>
        </div>

        <div className="relative">
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
      </div>
    </section>
  );
}