// src/pages/Landing.jsx
import { Link } from "react-router-dom";
import {
  Wrench,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Star,
  Users,
  Zap,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { theme } from "../styles/theme";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* NAVBAR */}
      <header className="flex justify-between items-center px-8 py-5 border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className={`${theme.gradient.provider} p-2 rounded-lg shadow-sm`}>
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            PropDash
          </h1>
        </div>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            to="/login"
            className="text-slate-600 hover:text-slate-900 transition font-semibold"
          >
            Sign In
          </Link>
          <Link to="/register" className={theme.button.provider}>
            Get Started Free
          </Link>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="flex-1 flex flex-col items-center text-center px-6 py-24 relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        {/* Background decoration - more subtle */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 right-20 w-96 h-96 bg-slate-200 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-semibold bg-slate-100 text-slate-700 rounded-full border border-slate-300 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          Trusted by 500+ service professionals
        </div>

        <h2 className={`${theme.text.h1} text-5xl md:text-6xl mb-6 max-w-4xl`}>
          Professional Business Management
          <span className="block bg-gradient-to-r from-slate-700 to-blue-700 text-transparent bg-clip-text mt-2">
            Built for Service Pros
          </span>
        </h2>

        <p className={`${theme.text.bodyLarge} max-w-2xl mb-10`}>
          PropDash provides handymen, contractors, and home service professionals
          with enterprise-grade tools to manage bookings, create quotes, and grow
          their business efficiently.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <Link to="/register" className={theme.button.provider}>
            Start Free Trial <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/customer-register" className={theme.button.secondary}>
            Find a Professional <Users className="w-5 h-5" />
          </Link>
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            No credit card required
          </span>
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-600" />
            Setup in under 2 minutes
          </span>
          <span className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            4.9/5 rating
          </span>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className={`${theme.gradient.providerLight} text-white py-16 shadow-inner`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-slate-200 text-sm font-medium">Active Professionals</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-slate-200 text-sm font-medium">Jobs Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9★</div>
              <div className="text-slate-200 text-sm font-medium">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-slate-200 text-sm font-medium">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className={`${theme.text.h2} mb-4`}>
              Enterprise Tools for Your Business
            </h3>
            <p className={`${theme.text.body} max-w-2xl mx-auto`}>
              Professional-grade features designed specifically for service industry professionals
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Feature Card 1 */}
            <div className={`${theme.card.base} ${theme.card.padding} ${theme.card.hover} group`}>
              <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition">
                <Calendar className="w-7 h-7 text-blue-700" />
              </div>
              <h4 className={`${theme.text.h4} mb-3`}>
                Smart Scheduling
              </h4>
              <p className={theme.text.body}>
                Professional calendar management with automated reminders and conflict detection.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className={`${theme.card.base} ${theme.card.padding} ${theme.card.hover} group`}>
              <div className="bg-slate-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:bg-slate-200 transition">
                <Sparkles className="w-7 h-7 text-slate-700" />
              </div>
              <h4 className={`${theme.text.h4} mb-3`}>
                AI-Powered Estimates
              </h4>
              <p className={theme.text.body}>
                Generate accurate professional quotes instantly with AI-assisted pricing and materials.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className={`${theme.card.base} ${theme.card.padding} ${theme.card.hover} group`}>
              <div className="bg-emerald-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition">
                <ShieldCheck className="w-7 h-7 text-emerald-700" />
              </div>
              <h4 className={`${theme.text.h4} mb-3`}>
                Compliance Management
              </h4>
              <p className={theme.text.body}>
                Automated compliance tracking for licensing requirements and job value limits.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className={`${theme.card.base} ${theme.card.padding} ${theme.card.hover} group`}>
              <div className="bg-teal-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-200 transition">
                <Users className="w-7 h-7 text-teal-700" />
              </div>
              <h4 className={`${theme.text.h4} mb-3`}>
                Client Database
              </h4>
              <p className={theme.text.body}>
                Comprehensive CRM with client history, preferences, and automated follow-ups.
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className={`${theme.card.base} ${theme.card.padding} ${theme.card.hover} group`}>
              <div className="bg-orange-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition">
                <Zap className="w-7 h-7 text-orange-700" />
              </div>
              <h4 className={`${theme.text.h4} mb-3`}>
                Online Booking
              </h4>
              <p className={theme.text.body}>
                24/7 client self-service booking with automated confirmation and calendar sync.
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className={`${theme.card.base} ${theme.card.padding} ${theme.card.hover} group`}>
              <div className="bg-indigo-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition">
                <TrendingUp className="w-7 h-7 text-indigo-700" />
              </div>
              <h4 className={`${theme.text.h4} mb-3`}>
                Business Analytics
              </h4>
              <p className={theme.text.body}>
                Real-time insights into revenue, job metrics, and business performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL SECTION */}
      <section className="bg-slate-50 border-y border-slate-200 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-6 h-6 text-amber-500 fill-amber-500"
              />
            ))}
          </div>
          <blockquote className="text-2xl font-semibold text-slate-900 mb-6 leading-relaxed">
            "PropDash streamlined our operations and saved us over 15 hours per week. 
            The compliance features alone are worth their weight in gold."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="bg-slate-200 w-14 h-14 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-slate-700 font-bold text-xl">M</span>
            </div>
            <div className="text-left">
              <p className="font-semibold text-slate-900">Marcus Rodriguez</p>
              <p className={theme.text.caption}>Licensed Contractor, Oakland CA</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className={`${theme.gradient.providerLight} text-white text-center py-20 px-6 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h3 className="text-4xl font-bold mb-4">Ready to Streamline Your Business?</h3>
          <p className="text-xl text-slate-100 mb-10 leading-relaxed">
            Join hundreds of professionals who trust PropDash to manage their daily operations.
            Start your free trial today—no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-slate-900 rounded-lg text-lg font-semibold hover:bg-slate-100 transition shadow-xl flex items-center gap-2"
            >
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/customer-register"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg text-lg font-semibold hover:bg-white/20 transition flex items-center gap-2"
            >
              Find a Professional <Users className="w-5 h-5" />
            </Link>
          </div>
          <p className={`${theme.text.caption} text-slate-200 mt-6`}>
            Free forever for up to 10 jobs per month • No contracts • Cancel anytime
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className={`${theme.gradient.provider} p-2 rounded-lg`}>
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">PropDash</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                Enterprise-grade business management platform designed specifically 
                for home service professionals.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-slate-200">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link to="/register" className="hover:text-white transition">
                    For Service Providers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/customer-register"
                    className="hover:text-white transition"
                  >
                    For Property Owners
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4 text-slate-200">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} PropDash. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition">Security</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition">Compliance</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition">Documentation</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}