import { Link } from "react-router-dom";
import {
  Wrench,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Star,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* NAVBAR */}
      <header className="flex justify-between items-center px-8 py-5 border-b border-slate-100 bg-white/80 backdrop-blur">
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-blue-600">Prop</span>Dash
        </h1>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link to="/login" className="text-slate-600 hover:text-black">
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="flex-1 flex flex-col items-center text-center px-6 py-24">
        <div className="inline-flex items-center gap-2 px-4 py-1 mb-4 text-sm font-medium bg-blue-50 text-blue-600 rounded-full border border-blue-100">
          <Sparkles className="w-4 h-4" /> Built for service providers
        </div>

        <h2 className="text-5xl font-extrabold tracking-tight mb-6">
          Run Your Service Business  
          <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            Smarter & Faster
          </span>
        </h2>

        <p className="text-lg text-slate-600 max-w-2xl mb-10">
          PropDash gives handymen, cleaners, and home service professionals
          everything they need to manage bookings, send quotes, and grow their
          business — all in one clean dashboard.
        </p>

        <Link
          to="/register"
          className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 flex items-center gap-2 shadow-md transition"
        >
          Create My Free Account <ArrowRight className="w-5 h-5" />
        </Link>

        <p className="text-sm text-slate-500 mt-4">
          No credit card required • Start in 60 seconds
        </p>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-3">
          {/* Feature Card */}
          <div className="p-8 bg-white rounded-2xl border shadow-sm hover:shadow-md transition text-center">
            <Calendar className="w-10 h-10 mx-auto text-blue-600 mb-4" />
            <h3 className="font-bold text-xl mb-2">Smart Scheduling</h3>
            <p className="text-slate-500 text-sm">
              Organize all your jobs with a clean, drag-and-drop calendar.
            </p>
          </div>

          <div className="p-8 bg-white rounded-2xl border shadow-sm hover:shadow-md transition text-center">
            <Wrench className="w-10 h-10 mx-auto text-indigo-600 mb-4" />
            <h3 className="font-bold text-xl mb-2">AI-Powered Estimates</h3>
            <p className="text-slate-500 text-sm">
              Upload photos & instantly generate accurate professional quotes.
            </p>
          </div>

          <div className="p-8 bg-white rounded-2xl border shadow-sm hover:shadow-md transition text-center">
            <ShieldCheck className="w-10 h-10 mx-auto text-green-600 mb-4" />
            <h3 className="font-bold text-xl mb-2">Secure & Reliable</h3>
            <p className="text-slate-500 text-sm">
              Enterprise-grade security keeps your client & job data protected.
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL STRIP */}
      <section className="bg-white border-t border-b py-12">
        <div className="max-w-4xl mx-auto text-center">
          <Star className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
          <p className="text-xl font-medium text-slate-700">
            “PropDash saves me 3+ hours every day. My business finally feels
            organized.”
          </p>
          <p className="text-slate-500 mt-2">— Marcus, Handyman</p>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-indigo-600 text-white text-center py-20 px-6">
        <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
        <p className="text-indigo-100 mb-8">
          Join hundreds of home-service pros leveling up their business.
        </p>
        <Link
          to="/register"
          className="px-8 py-4 bg-white text-indigo-700 rounded-xl text-lg font-semibold hover:bg-indigo-100 transition"
        >
          Create My Account
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} PropDash — All rights reserved.
      </footer>
    </div>
  );
}
