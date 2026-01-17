//levlpro-mvp\src\pages\Landing\components\Footer.jsx
import { Link } from "react-router-dom";
import { Wrench, Home, Search, TrendingUp, Mail } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [zipCode, setZipCode] = useState("");

  const handleNewsletterSignup = (e) => {
    e.preventDefault();
    console.log("Newsletter signup:", email, zipCode);
  };

  return (
    <footer className="bg-secondary-50 text-secondary-900">
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-800 to-primary-900 text-white py-16 md:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Join thousands using LevlPro to simplify property services
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Property Owner CTA */}
            <div className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all">
              <Home className="text-accent-300 mb-4" size={40} />
              <h3 className="text-xl font-bold mb-2">Property Owners</h3>
              <p className="text-primary-100 mb-6 text-sm">
                Find licensed professionals for any property service
              </p>
              <Link
                to="/register/client"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-secondary-900 rounded-lg font-semibold hover:bg-secondary-100 transition-all w-full justify-center"
              >
                <span>Find Professionals</span>
                <Search size={18} />
              </Link>
            </div>

            {/* Professional CTA */}
            <div className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all">
              <Wrench className="text-primary-300 mb-4" size={40} />
              <h3 className="text-xl font-bold mb-2">Service Professionals</h3>
              <p className="text-primary-100 mb-6 text-sm">
                Get quality leads and grow your business
              </p>
              <Link
                to="/register/professional"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-secondary-900 rounded-lg font-semibold hover:bg-secondary-100 transition-all w-full justify-center"
              >
                <span>Grow Your Business</span>
                <TrendingUp size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <div className="bg-secondary-100 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Newsletter Signup */}
            <div className="lg:col-span-1">
              <h4 className="font-bold mb-4 text-secondary-900">
                Sign up for Free Project Cost Information
              </h4>
              <form onSubmit={handleNewsletterSignup} className="space-y-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-secondary-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-600 focus:outline-none text-sm"
                />
                <input
                  type="text"
                  placeholder="ZIP code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  maxLength="5"
                  className="w-full px-4 py-2 rounded-lg border-2 border-secondary-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-600 focus:outline-none text-sm"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors text-sm"
                >
                  Sign up
                </button>
              </form>
            </div>

            {/* Homeowner Services */}
            <div>
              <h4 className="font-bold mb-4 text-secondary-900">
                Homeowner services
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/find-pros"
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    Find Pros
                  </Link>
                </li>
                <li>
                  <Link
                    to="/browse"
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    Browse Pro Directory
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    Fixed Price Services
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Service Pros */}
            <div>
              <h4 className="font-bold mb-4 text-secondary-900">
                For service pros
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/login/professional"
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    Service Professional Log In
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register/professional"
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    Join Our Pro Network
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pro-resources"
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    Pro Resource Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contractor-leads"
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    Contractor Leads
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources & About */}
            <div>
              <h4 className="font-bold mb-4 text-secondary-900">Resources</h4>
              <ul className="space-y-2 text-sm mb-6">
                <li>
                  <Link
                    to="/account"
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    My Account
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cost-guide"
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    True Cost Guide
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources"
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    Resource Center
                  </Link>
                </li>
              </ul>

              <h4 className="font-bold mb-4 text-secondary-900">About us</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/how-it-works"
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    How it works
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    Who we are
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    Contact us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-secondary-900 text-white py-6 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Brand & Copyright */}
            <div className="flex items-center gap-3">
              <div className="bg-primary-700 p-2 rounded-lg">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg">LevlPro</div>
                <div className="text-xs text-secondary-400">
                  © {new Date().getFullYear()} All rights reserved
                </div>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-secondary-400">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <span>•</span>
              <Link to="/support" className="hover:text-white transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}