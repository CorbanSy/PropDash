// src/pages/Landing.jsx
import { useState } from "react";
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
  Home,
  Clock,
  Award,
  Search,
  DollarSign,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { theme } from "../styles/theme";

export default function Landing() {
  const [showLoginMenu, setShowLoginMenu] = useState(false);

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
          {/* Sign In Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLoginMenu(!showLoginMenu)}
              className="text-slate-600 hover:text-slate-900 transition font-semibold flex items-center gap-1"
            >
              Sign In
              <ChevronDown size={16} className={`transition ${showLoginMenu ? "rotate-180" : ""}`} />
            </button>

            {showLoginMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLoginMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
                  <Link
                    to="/login/professional"
                    onClick={() => setShowLoginMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Wrench size={16} className="text-blue-600" />
                    <div>
                      <p className="font-semibold">Professional</p>
                      <p className="text-xs text-slate-500">Service providers</p>
                    </div>
                  </Link>
                  
                  <div className="h-px bg-slate-200 my-1" />
                  
                  <Link
                    to="/login/client"
                    onClick={() => setShowLoginMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Home size={16} className="text-teal-600" />
                    <div>
                      <p className="font-semibold">Client</p>
                      <p className="text-xs text-slate-500">Property owners</p>
                    </div>
                  </Link>
                </div>
              </>
            )}
          </div>

          <Link to="/register/professional" className={theme.button.provider}>
            Get Started Free
          </Link>
        </nav>
      </header>

      {/* HERO SECTION - Balanced for Both Audiences */}
      <section className="flex-1 flex flex-col items-center text-center px-6 py-24 relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 right-20 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-200 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-semibold bg-gradient-to-r from-blue-50 to-teal-50 text-slate-700 rounded-full border border-slate-300 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          Connecting 500+ professionals with thousands of property owners
        </div>

        <h2 className={`${theme.text.h1} text-5xl md:text-6xl mb-6 max-w-4xl`}>
          Property Care Made
          <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-transparent bg-clip-text mt-2">
            Simple & Reliable
          </span>
        </h2>

        <p className={`${theme.text.bodyLarge} max-w-2xl mb-10`}>
          Get professional property services at the push of a button, or grow your business 
          with a steady stream of clients. PropDash connects property owners with licensed, 
          verified professionals instantly.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <Link to="/register/client" className={`${theme.button.customer} shadow-lg shadow-teal-500/30`}>
            Find a Professional <Search className="w-5 h-5" />
          </Link>
          <Link to="/register/professional" className={`${theme.button.provider} shadow-lg shadow-blue-500/30`}>
            Grow Your Business <TrendingUp className="w-5 h-5" />
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            Same-day service available
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Licensed & insured pros
          </span>
          <span className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            4.9/5 average rating
          </span>
        </div>
      </section>

      {/* HOW IT WORKS - Two Columns */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className={`${theme.text.h2} mb-4`}>How PropDash Works</h3>
            <p className={`${theme.text.body} max-w-2xl mx-auto`}>
              Two sides of the same platform, working seamlessly together
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* FOR CLIENTS */}
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-8 border-2 border-teal-200">
              <div className="bg-white w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Home className="text-teal-600" size={32} />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-4">For Property Owners</h4>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Get reliable, professional service at the push of a button
              </p>

              <div className="space-y-4">
                <Step number="1" title="Post Your Need" description="Describe the work needed in seconds" />
                <Step number="2" title="Get Instant Quotes" description="Receive quotes from licensed professionals" />
                <Step number="3" title="Book & Relax" description="Choose a pro and schedule—it's that easy" />
              </div>

              <Link to="/register/client" className="mt-6 inline-flex items-center gap-2 text-teal-700 font-semibold hover:text-teal-800 transition">
                Get Started as a Client <ArrowRight size={16} />
              </Link>
            </div>

            {/* FOR PROFESSIONALS */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
              <div className="bg-white w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Wrench className="text-blue-600" size={32} />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-4">For Service Professionals</h4>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Get more jobs, manage your business, and grow faster
              </p>

              <div className="space-y-4">
                <Step number="1" title="Create Your Profile" description="Showcase your skills and credentials" />
                <Step number="2" title="Receive Job Requests" description="Get matched with clients in your area" />
                <Step number="3" title="Send Quotes & Get Hired" description="Use AI-powered tools to win more jobs" />
              </div>

              <Link to="/register/professional" className="mt-6 inline-flex items-center gap-2 text-blue-700 font-semibold hover:text-blue-800 transition">
                Get Started as a Pro <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white py-16 shadow-inner">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100 text-sm font-medium">Active Professionals</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100 text-sm font-medium">Jobs Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9★</div>
              <div className="text-blue-100 text-sm font-medium">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">&lt;2hrs</div>
              <div className="text-blue-100 text-sm font-medium">Avg Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES - Split for Both Audiences */}
      <section className="px-6 py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          {/* FOR CLIENTS */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm font-semibold bg-teal-100 text-teal-700 rounded-full border border-teal-300">
                <Home size={16} />
                For Property Owners
              </div>
              <h3 className={`${theme.text.h2} mb-4`}>
                Fast, Reliable Property Care
              </h3>
              <p className={`${theme.text.body} max-w-2xl mx-auto`}>
                Everything you need to maintain your property with confidence
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <FeatureCard
                icon={<Search className="w-7 h-7" />}
                bgColor="bg-teal-100"
                hoverColor="group-hover:bg-teal-200"
                iconColor="text-teal-700"
                title="Find Pros Instantly"
                description="Browse licensed professionals in your area. See ratings, reviews, and credentials."
              />
              <FeatureCard
                icon={<Clock className="w-7 h-7" />}
                bgColor="bg-blue-100"
                hoverColor="group-hover:bg-blue-200"
                iconColor="text-blue-700"
                title="Same-Day Service"
                description="Many professionals offer same-day availability for urgent needs."
              />
              <FeatureCard
                icon={<ShieldCheck className="w-7 h-7" />}
                bgColor="bg-emerald-100"
                hoverColor="group-hover:bg-emerald-200"
                iconColor="text-emerald-700"
                title="Verified & Insured"
                description="Every professional is background-checked, licensed, and insured."
              />
            </div>
          </div>

          {/* FOR PROFESSIONALS */}
          <div>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm font-semibold bg-blue-100 text-blue-700 rounded-full border border-blue-300">
                <Wrench size={16} />
                For Service Professionals
              </div>
              <h3 className={`${theme.text.h2} mb-4`}>
                Tools to Grow Your Business
              </h3>
              <p className={`${theme.text.body} max-w-2xl mx-auto`}>
                Everything you need to run a professional service business
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <FeatureCard
                icon={<Sparkles className="w-7 h-7" />}
                bgColor="bg-purple-100"
                hoverColor="group-hover:bg-purple-200"
                iconColor="text-purple-700"
                title="AI Quote Builder"
                description="Generate professional estimates in minutes with AI-powered pricing."
              />
              <FeatureCard
                icon={<Users className="w-7 h-7" />}
                bgColor="bg-indigo-100"
                hoverColor="group-hover:bg-indigo-200"
                iconColor="text-indigo-700"
                title="Client Management"
                description="Track jobs, clients, and invoices all in one powerful dashboard."
              />
              <FeatureCard
                icon={<TrendingUp className="w-7 h-7" />}
                bgColor="bg-orange-100"
                hoverColor="group-hover:bg-orange-200"
                iconColor="text-orange-700"
                title="More Job Leads"
                description="Get matched with clients actively looking for your services."
              />
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - Both Sides */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className={`${theme.text.h2} text-center mb-12`}>
            Trusted by Both Sides
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Client Testimonial */}
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-8 border-2 border-teal-200">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />
                ))}
              </div>
              <blockquote className="text-lg font-medium text-slate-900 mb-6 leading-relaxed">
                "I needed a plumber ASAP and PropDash connected me with someone within an hour. Professional, licensed, and the work was perfect. This is how home services should work!"
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="bg-teal-200 w-12 h-12 rounded-full flex items-center justify-center">
                  <span className="text-teal-800 font-bold text-lg">S</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Sarah Thompson</p>
                  <p className="text-sm text-slate-600">Property Manager, SF</p>
                </div>
              </div>
            </div>

            {/* Professional Testimonial */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />
                ))}
              </div>
              <blockquote className="text-lg font-medium text-slate-900 mb-6 leading-relaxed">
                "PropDash doubled my bookings in the first month. The AI quote builder saves me hours, and the compliance tracking is a lifesaver. Best investment for my business."
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="bg-blue-200 w-12 h-12 rounded-full flex items-center justify-center">
                  <span className="text-blue-800 font-bold text-lg">M</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Marcus Rodriguez</p>
                  <p className="text-sm text-slate-600">Licensed Contractor, Oakland</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION - Dual Options */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white text-center py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h3 className="text-4xl md:text-5xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Whether you need reliable property care or want to grow your service business, 
            PropDash has you covered.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Client CTA */}
            <div className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-8 text-left">
              <Home className="text-teal-300 mb-4" size={40} />
              <h4 className="text-2xl font-bold mb-2">Property Owners</h4>
              <p className="text-blue-100 mb-6 text-sm">
                Find licensed professionals for any property need
              </p>
              <Link
                to="/register/client"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition shadow-xl w-full justify-center"
              >
                Find a Professional <Search size={18} />
              </Link>
            </div>

            {/* Professional CTA */}
            <div className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-8 text-left">
              <Wrench className="text-blue-300 mb-4" size={40} />
              <h4 className="text-2xl font-bold mb-2">Service Professionals</h4>
              <p className="text-blue-100 mb-6 text-sm">
                Get more clients and streamline your business
              </p>
              <Link
                to="/register/professional"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition shadow-xl w-full justify-center"
              >
                Grow Your Business <TrendingUp size={18} />
              </Link>
            </div>
          </div>
          <p className="text-sm text-blue-200 mt-8">
            ✓ Free to start • No credit card required • Cancel anytime
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
                The marketplace connecting property owners with licensed, verified 
                service professionals for fast, reliable property care.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-slate-200">Get Started</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link to="/register/client" className="hover:text-white transition">
                    For Property Owners
                  </Link>
                </li>
                <li>
                  <Link to="/register/professional" className="hover:text-white transition">
                    For Service Professionals
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    How It Works
                  </a>
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
              <a href="#" className="hover:text-white transition">Trust & Safety</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition">Help Center</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper Components
function Step({ number, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-white border-2 border-current flex items-center justify-center font-bold flex-shrink-0">
        {number}
      </div>
      <div>
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, bgColor, hoverColor, iconColor, title, description }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition group">
      <div className={`${bgColor} w-14 h-14 rounded-lg flex items-center justify-center mb-4 ${hoverColor} transition`}>
        <div className={iconColor}>{icon}</div>
      </div>
      <h4 className="text-lg font-semibold text-slate-900 mb-2">{title}</h4>
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}