//levlpro-mvp\src\pages\Landing\components\Header.jsx
import { Link } from "react-router-dom";
import { Wrench, Menu, X } from "lucide-react";
import { useState } from "react";

export default function HeaderSimplified({
  isScrolled,
  showMobileMenu,
  setShowMobileMenu,
}) {
  return (
    <header
      className={`bg-white sticky top-0 z-50 transition-all duration-200 ${
        isScrolled ? "shadow-md" : "shadow-sm border-b border-secondary-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary-600 p-2 rounded-lg group-hover:bg-primary-700 transition-colors">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-secondary-900">
              LevlPro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#services"
              className="text-secondary-700 hover:text-secondary-900 font-medium transition-colors"
            >
              Services
            </a>
            <a
              href="#how-it-works"
              className="text-secondary-700 hover:text-secondary-900 font-medium transition-colors"
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="text-secondary-700 hover:text-secondary-900 font-medium transition-colors"
            >
              Pricing
            </a>

            <div className="h-6 w-px bg-secondary-300" />

            <Link
              to="/login/client"
              className="text-secondary-700 hover:text-secondary-900 font-medium transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/register/professional"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
            >
              Sign up
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-secondary-700 hover:text-secondary-900 hover:bg-secondary-50 rounded-lg transition-all"
          >
            {showMobileMenu ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-secondary-200 bg-white">
          <div className="px-6 py-4 space-y-3">
            <a
              href="#services"
              className="block py-2 text-secondary-700 hover:text-secondary-900 font-medium"
              onClick={() => setShowMobileMenu(false)}
            >
              Services
            </a>
            <a
              href="#how-it-works"
              className="block py-2 text-secondary-700 hover:text-secondary-900 font-medium"
              onClick={() => setShowMobileMenu(false)}
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="block py-2 text-secondary-700 hover:text-secondary-900 font-medium"
              onClick={() => setShowMobileMenu(false)}
            >
              Pricing
            </a>
            <div className="h-px bg-secondary-200 my-3" />
            <Link
              to="/login"
              className="block py-2 text-secondary-700 hover:text-secondary-900 font-medium"
              onClick={() => setShowMobileMenu(false)}
            >
              Log in
            </Link>
            <Link
              to="/register/professional"
              className="block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold text-center transition-colors"
              onClick={() => setShowMobileMenu(false)}
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}