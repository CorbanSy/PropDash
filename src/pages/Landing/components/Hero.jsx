// src/pages/Landing/components/Hero.jsx
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Search,
  TrendingUp,
  Clock,
  ShieldCheck,
  Star,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="flex-1 flex flex-col items-center text-center px-6 py-20 md:py-28 relative overflow-hidden bg-white">
      {/* Animated background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-100 rounded-full blur-3xl opacity-20 animate-float"></div>
        <div
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-100 rounded-full blur-3xl opacity-15 animate-float"
          style={{ animationDelay: "2s", animationDuration: "25s" }}
        ></div>
      </div>

      <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 bg-white border-2 border-secondary-200 text-secondary-700 rounded-full font-semibold shadow-sm hover:shadow-md hover:border-primary-300 transition-all duration-300 animate-fadeIn">
        <CheckCircle2
          className="w-4 h-4 text-primary-600 animate-pulse"
          style={{ animationDuration: "2s" }}
        />
        <span className="text-sm">
          Trusted by 500+ professionals and thousands of property owners
        </span>
      </div>

      <h1 className="text-5xl md:text-6xl font-extrabold mb-6 max-w-5xl leading-tight text-secondary-900 animate-slideUp">
        Professional Property Services,
        <span className="block text-primary-700 mt-2">Simplified</span>
      </h1>

      <p
        className="text-xl text-secondary-600 max-w-3xl mb-12 leading-relaxed animate-slideUp"
        style={{ animationDelay: "0.1s" }}
      >
        Connect with licensed, verified professionals for all your property
        needs, or grow your service business with qualified leads and powerful
        tools.
      </p>

      <div
        className="flex flex-col sm:flex-row items-center gap-6 mb-12 animate-slideUp"
        style={{ animationDelay: "0.2s" }}
      >
        {/* Property Owner CTA */}
        <div className="flex flex-col items-center gap-3 group">
          <Link
            to="/register/client"
            className="btn-accent px-8 py-4 text-lg shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <span className="relative z-10">Find a Professional</span>
            <Search className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <Link
            to="/login/client"
            className="text-sm text-accent-700 hover:text-accent-900 font-semibold transition-all duration-200 hover:underline decoration-2 underline-offset-4"
          >
            Sign in as Property Owner
          </Link>
        </div>

        {/* Professional CTA */}
        <div className="flex flex-col items-center gap-3 group">
          <Link
            to="/register/professional"
            className="btn-primary px-8 py-4 text-lg shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <span className="relative z-10">Grow Your Business</span>
            <TrendingUp className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <Link
            to="/login/professional"
            className="text-sm text-primary-700 hover:text-primary-900 font-semibold transition-all duration-200 hover:underline decoration-2 underline-offset-4"
          >
            Sign in as Professional
          </Link>
        </div>
      </div>

      <div
        className="flex flex-wrap items-center justify-center gap-8 text-sm text-secondary-700 animate-fadeIn"
        style={{ animationDelay: "0.3s" }}
      >
        <span className="flex items-center gap-2 font-medium bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
          <Clock className="w-5 h-5 text-primary-600" />
          Same-day availability
        </span>
        <span className="flex items-center gap-2 font-medium bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
          <ShieldCheck className="w-5 h-5 text-success-600" />
          Licensed & insured
        </span>
        <span className="flex items-center gap-2 font-medium bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
          <Star className="w-5 h-5 text-warning-500 fill-warning-500" />
          4.9/5 average rating
        </span>
      </div>
    </section>
  );
}