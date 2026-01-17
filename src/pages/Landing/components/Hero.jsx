import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  ArrowRight,
  Wrench,
  Trees,
  Droplets,
  Zap,
  Drill,
  Home,
  PaintBucket,
  Trash2,
  Wind,
  Lightbulb,
  Fence,
  Hammer,
} from "lucide-react";

const categories = [
  { icon: Wrench, name: "Handyperson", color: "text-secondary-700" },
  { icon: Trees, name: "Landscaping", color: "text-secondary-700" },
  { icon: Droplets, name: "Plumbing", color: "text-secondary-700" },
  { icon: Zap, name: "Electrical", color: "text-secondary-700" },
  { icon: Drill, name: "Remodeling", color: "text-secondary-700" },
  { icon: Home, name: "Roofing", color: "text-secondary-700" },
  { icon: PaintBucket, name: "Painting", color: "text-secondary-700" },
  { icon: Trash2, name: "Cleaning", color: "text-secondary-700" },
  { icon: Wind, name: "HVAC", color: "text-secondary-700" },
  { icon: Lightbulb, name: "Windows", color: "text-secondary-700" },
  { icon: Fence, name: "Concrete", color: "text-secondary-700" },
  { icon: Hammer, name: "Carpentry", color: "text-secondary-700" },
];

const rotatingServices = [
  "home project",
  "plumbing repair",
  "electrical work",
  "landscaping job",
  "renovation",
  "roofing project",
  "paint job",
  "cleaning service",
  "HVAC repair",
  "home repair",
  "yard work",
  "carpentry project",
];

export default function Hero() {
  const [zipCode, setZipCode] = useState("");
  const [serviceQuery, setServiceQuery] = useState("");
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Rotate through services every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentServiceIndex((prev) => (prev + 1) % rotatingServices.length);
        setIsVisible(true);
      }, 300); // Match this with the CSS transition duration
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", serviceQuery, "in", zipCode);
  };

  return (
    <section className="relative">
      {/* Background Image Section - Only covers heading to search */}
      <div
        className="relative bg-cover bg-center h-[70vh]"
        style={{
          backgroundImage: "url('/src/assets/landing_page2.jpg')",
          filter: "brightness(1.2)",
        }}
      >
        {/* Lighter Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 md:px-0 py-20 md:py-32 w-full">
          <div className="max-w-4xl text-left flex justify-start">
            {/* Grey Transparent Box */}
            <div className="bg-gray-900/40 backdrop-blur-sm rounded-3xl px-8 py-12 md:px-12 md:py-16 max-w-4xl md:-ml-40 md:-mt-16">
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-left">
              Find the right professional
              <br />
              for any{" "}
              <span
                className="inline-block transition-opacity duration-300"
                style={{ opacity: isVisible ? 1 : 0 }}
              >
                {rotatingServices[currentServiceIndex]}
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-white/90 mb-3 max-w-2xl text-left">
              Connect with top-rated local professionals for home services,
              repairs, and improvements.
            </p>

            {/* Professional Link */}
            <div className="mb-12">
              <Link
                to="/register/professional"
                className="text-sm text-white/80 hover:text-white font-medium inline-flex items-center gap-1 hover:underline"
              >
                Are you a professional?
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Search Box */}
            <form onSubmit={handleSearch}>
              <div className="bg-white rounded-2xl shadow-2xl border-2 border-secondary-200 overflow-hidden">
                <div className="grid md:grid-cols-[1fr,auto,auto] gap-0">
                  {/* Service Input */}
                  <div className="relative border-b md:border-b-0 md:border-r-2 border-secondary-200">
                    <input
                      type="text"
                      placeholder="What do you need done?"
                      value={serviceQuery}
                      onChange={(e) => setServiceQuery(e.target.value)}
                      className="w-full px-6 py-5 text-lg border-0 focus:ring-0 focus:outline-none"
                    />
                  </div>

                  {/* Zip Code Input */}
                  <div className="relative border-b md:border-b-0 md:border-r-2 border-secondary-200">
                    <div className="flex items-center px-6 py-5">
                      <MapPin className="w-5 h-5 text-secondary-400 mr-3" />
                      <input
                        type="text"
                        placeholder="Zip code"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        maxLength="5"
                        className="w-full text-lg border-0 focus:ring-0 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Search Button */}
                  <button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-5 font-semibold text-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <Search className="w-5 h-5" />
                    <span className="hidden sm:inline">Get Started</span>
                  </button>
                </div>
              </div>
            </form>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section - Below background image */}
      <div className="bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="overflow-x-auto no-scrollbar pb-4">
              <div className="flex gap-6 md:gap-8 justify-start md:justify-center min-w-max px-4">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setServiceQuery(category.name)}
                    className="group flex flex-col items-center gap-3 min-w-[80px] hover:opacity-80 transition-opacity"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                      <category.icon
                        className="w-10 h-10 md:w-12 md:h-12 text-secondary-700 group-hover:scale-110 transition-transform"
                        strokeWidth={1.5}
                      />
                    </div>
                    <span className="text-sm md:text-base font-medium text-gray-900 text-center whitespace-nowrap">
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}