// src/pages/Landing/components/Header.jsx
import { Link } from "react-router-dom";
import { Wrench, Home, ChevronDown } from "lucide-react";

export default function Header({
  isScrolled,
  showLoginMenu,
  setShowLoginMenu,
  setShowMobileMenu,
  showMobileMenu,
}) {
  return (
    <header
      className={`flex justify-between items-center px-8 py-5 bg-white sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-xl border-b border-secondary-200" : "shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative group">
          <div className="absolute inset-0 bg-primary-600 rounded-lg blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
          <div className="relative bg-primary-700 p-2.5 rounded-lg transition-transform duration-300 group-hover:scale-110">
            <Wrench className="w-5 h-5 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-secondary-900 transition-colors duration-300 hover:text-primary-700 cursor-default">
          PropDash
        </h1>
      </div>

      {/* Navigation Links - Desktop */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
        <a
          href="#features"
          className="text-secondary-700 hover:text-primary-700 transition-colors duration-200 relative group"
        >
          Features
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-700 transition-all duration-300 group-hover:w-full"></span>
        </a>
        <a
          href="#how-it-works"
          className="text-secondary-700 hover:text-primary-700 transition-colors duration-200 relative group"
        >
          How It Works
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-700 transition-all duration-300 group-hover:w-full"></span>
        </a>
        <a
          href="#testimonials"
          className="text-secondary-700 hover:text-primary-700 transition-colors duration-200 relative group"
        >
          Testimonials
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-700 transition-all duration-300 group-hover:w-full"></span>
        </a>

        {/* Sign In Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLoginMenu(!showLoginMenu)}
            className="text-secondary-700 hover:text-secondary-900 transition-all duration-200 font-semibold flex items-center gap-1 px-4 py-2 rounded-lg hover:bg-secondary-100"
          >
            Sign In
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${
                showLoginMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {showLoginMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowLoginMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-secondary-200 py-2 z-50 animate-slideDown">
                <Link
                  to="/login/professional"
                  onClick={() => setShowLoginMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-secondary-700 hover:bg-primary-50 transition-all duration-200 group"
                >
                  <div className="bg-primary-100 p-2 rounded-lg group-hover:bg-primary-200 transition-all duration-200 group-hover:scale-110">
                    <Wrench size={16} className="text-primary-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-secondary-900">
                      Professional
                    </p>
                    <p className="text-xs text-secondary-500">
                      Service providers
                    </p>
                  </div>
                </Link>

                <div className="h-px bg-secondary-200 my-1 mx-3" />

                <Link
                  to="/login/client"
                  onClick={() => setShowLoginMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-secondary-700 hover:bg-accent-50 transition-all duration-200 group"
                >
                  <div className="bg-accent-100 p-2 rounded-lg group-hover:bg-accent-200 transition-all duration-200 group-hover:scale-110">
                    <Home size={16} className="text-accent-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-secondary-900">
                      Property Owner
                    </p>
                    <p className="text-xs text-secondary-500">
                      Find professionals
                    </p>
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>

        <Link
          to="/register/professional"
          className="btn-primary hover:scale-105 transition-transform duration-200"
        >
          Get Started Free
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        className="md:hidden p-2 text-secondary-700 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-all duration-200"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {showMobileMenu ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>
    </header>
  );
}