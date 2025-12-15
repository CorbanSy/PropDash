// src/pages/Landing/components/CTA.jsx
import { Link } from "react-router-dom";
import { Home, Wrench, Search, TrendingUp, Check } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-gradient-to-r from-primary-700 via-primary-800 to-primary-900 text-white py-24 md:py-32 px-6 fade-in-section opacity-0">
      <div className="max-w-4xl mx-auto text-center">
        <span className="px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-semibold border-2 border-white/20 inline-block mb-8 hover:bg-white/20 hover:scale-105 transition-all duration-300">
          Get Started Today
        </span>
        <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
          Ready to Begin?
        </h2>
        <p className="text-xl text-primary-100 mb-12 leading-relaxed max-w-3xl mx-auto">
          Join thousands of property owners and service professionals using
          PropDash to simplify property management and grow their businesses.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Property Owner CTA */}
          <div className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl p-8 text-left hover:bg-white/15 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-2">
            <Home className="text-accent-300 mb-6" size={48} />
            <h3 className="text-2xl font-bold mb-3">Property Owners</h3>
            <p className="text-primary-100 mb-8 text-base leading-relaxed">
              Find licensed professionals for any property service need
            </p>
            <Link
              to="/register/client"
              className="inline-flex items-center gap-3 px-6 py-4 bg-white text-secondary-900 rounded-xl font-bold hover:bg-secondary-100 transition-all duration-300 shadow-xl w-full justify-center hover:scale-105 group"
            >
              <span>Find Professionals</span>
              <Search
                size={20}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>
            <Link
              to="/login/client"
              className="block text-center text-sm text-white/90 hover:text-white font-semibold transition-all duration-200 hover:underline decoration-2 underline-offset-4 mt-4"
            >
              Already have an account? Sign in
            </Link>
          </div>

          {/* Professional CTA */}
          <div className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl p-8 text-left hover:bg-white/15 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-2">
            <Wrench className="text-primary-300 mb-6" size={48} />
            <h3 className="text-2xl font-bold mb-3">Service Professionals</h3>
            <p className="text-primary-100 mb-8 text-base leading-relaxed">
              Get quality leads and professional business management tools
            </p>
            <Link
              to="/register/professional"
              className="inline-flex items-center gap-3 px-6 py-4 bg-white text-secondary-900 rounded-xl font-bold hover:bg-secondary-100 transition-all duration-300 shadow-xl w-full justify-center hover:scale-105 group"
            >
              <span>Grow Your Business</span>
              <TrendingUp
                size={20}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>
            <Link
              to="/login/professional"
              className="block text-center text-sm text-white/90 hover:text-white font-semibold transition-all duration-200 hover:underline decoration-2 underline-offset-4 mt-4"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-base text-primary-100">
          <span className="flex items-center gap-2 hover:scale-110 transition-transform duration-200">
            <Check className="w-5 h-5" />
            Free to start
          </span>
          <span>•</span>
          <span className="flex items-center gap-2 hover:scale-110 transition-transform duration-200">
            <Check className="w-5 h-5" />
            No credit card required
          </span>
          <span>•</span>
          <span className="flex items-center gap-2 hover:scale-110 transition-transform duration-200">
            <Check className="w-5 h-5" />
            Cancel anytime
          </span>
        </div>
      </div>
    </section>
  );
}