//levlpro-mvp\src\pages\Landing\components\MobileMenu.jsx
import { Link } from "react-router-dom";
import { Wrench, Home } from "lucide-react";

export default function MobileMenu({ showMobileMenu, setShowMobileMenu }) {
  if (!showMobileMenu) return null;

  return (
    <div className="md:hidden fixed inset-0 z-40 bg-white animate-slideDown">
      <div className="flex flex-col h-full">
        {/* Mobile Menu Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-secondary-200">
          <div className="flex items-center gap-3">
            <div className="bg-primary-700 p-2.5 rounded-lg">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-secondary-900">LevlPro</h1>
          </div>
          <button
            onClick={() => setShowMobileMenu(false)}
            className="p-2 text-secondary-700 hover:bg-secondary-100 rounded-lg transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Content */}
        <nav className="flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-2">
            <a
              href="#features"
              onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-3 text-secondary-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-all duration-200 font-medium"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-3 text-secondary-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-all duration-200 font-medium"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-3 text-secondary-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-all duration-200 font-medium"
            >
              Testimonials
            </a>

            <div className="h-px bg-secondary-200 my-4" />

            <div className="space-y-3">
              <Link
                to="/login/professional"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 px-4 py-3 bg-primary-50 text-primary-800 rounded-lg hover:bg-primary-100 transition-all duration-200"
              >
                <Wrench size={20} className="text-primary-700" />
                <div>
                  <p className="font-semibold">Professional Sign In</p>
                  <p className="text-xs text-primary-600">Service providers</p>
                </div>
              </Link>

              <Link
                to="/login/client"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 px-4 py-3 bg-accent-50 text-accent-800 rounded-lg hover:bg-accent-100 transition-all duration-200"
              >
                <Home size={20} className="text-accent-700" />
                <div>
                  <p className="font-semibold">Property Owner Sign In</p>
                  <p className="text-xs text-accent-600">Find professionals</p>
                </div>
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Footer */}
        <div className="px-8 py-6 border-t border-secondary-200">
          <Link
            to="/register/professional"
            onClick={() => setShowMobileMenu(false)}
            className="btn-primary w-full justify-center"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  );
}