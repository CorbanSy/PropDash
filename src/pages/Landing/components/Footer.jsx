// src/pages/Landing/components/Footer.jsx
import { Link } from "react-router-dom";
import { Wrench } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary-900 text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-600 rounded-lg blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative bg-primary-700 p-3 rounded-lg transition-transform duration-300 group-hover:scale-110">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold">PropDash</h3>
            </div>
            <p className="text-secondary-400 text-base leading-relaxed max-w-md">
              Professional property services platform connecting licensed service
              providers with property owners nationwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-6 text-white text-lg">Get Started</h4>
            <ul className="space-y-3 text-sm text-secondary-400">
              <li>
                <Link
                  to="/register/client"
                  className="hover:text-white transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  For Property Owners
                </Link>
              </li>
              <li>
                <Link
                  to="/register/professional"
                  className="hover:text-white transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  For Professionals
                </Link>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="hover:text-white transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-6 text-white text-lg">Company</h4>
            <ul className="space-y-3 text-sm text-secondary-400">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-secondary-400">
            © {new Date().getFullYear()} PropDash. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-secondary-400">
            <a href="#" className="hover:text-white transition-colors duration-200">
              Security
            </a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors duration-200">
              Trust & Safety
            </a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors duration-200">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}