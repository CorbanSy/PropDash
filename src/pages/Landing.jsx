// src/pages/Landing.jsx
import { useState, useEffect } from "react";
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
  Check,
} from "lucide-react";
import { theme } from "../styles/theme";

export default function Landing() {
  const [showLoginMenu, setShowLoginMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ENHANCED NAVBAR */}
      <header className={`flex justify-between items-center px-8 py-5 border-b bg-white/95 backdrop-blur sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-lg border-slate-200" : "border-transparent shadow-sm"
      }`}>
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75 animate-pulse"></div>
            <div className={`${theme.gradient.provider} p-2 rounded-lg shadow-sm relative`}>
              <Wrench className="w-5 h-5 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 text-transparent bg-clip-text">
            PropDash
          </h1>
        </div>

        <nav className="flex items-center gap-6 text-sm font-medium">
          {/* Sign In Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLoginMenu(!showLoginMenu)}
              className="text-slate-600 hover:text-slate-900 transition font-semibold flex items-center gap-1 px-4 py-2 rounded-lg hover:bg-slate-100"
            >
              Sign In
              <ChevronDown size={16} className={`transition-transform duration-200 ${showLoginMenu ? "rotate-180" : ""}`} />
            </button>

            {showLoginMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLoginMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    to="/login/professional"
                    onClick={() => setShowLoginMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition group"
                  >
                    <div className="bg-blue-100 p-2 rounded-lg group-hover:scale-110 transition">
                      <Wrench size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Professional</p>
                      <p className="text-xs text-slate-500">Service providers</p>
                    </div>
                  </Link>
                  
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-1" />
                  
                  <Link
                    to="/login/client"
                    onClick={() => setShowLoginMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 transition group"
                  >
                    <div className="bg-teal-100 p-2 rounded-lg group-hover:scale-110 transition">
                      <Home size={16} className="text-teal-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Client</p>
                      <p className="text-xs text-slate-500">Property owners</p>
                    </div>
                  </Link>
                </div>
              </>
            )}
          </div>

          <Link to="/register/professional" className={`${theme.button.provider} shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200`}>
            Get Started Free
          </Link>
        </nav>
      </header>

      {/* ENHANCED HERO SECTION */}
      <section className="flex-1 flex flex-col items-center text-center px-6 py-24 md:py-32 relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
        {/* Animated Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400 to-blue-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-teal-400 to-emerald-200 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-200 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 -z-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 20}s`,
              }}
            />
          ))}
        </div>

        <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 text-sm font-semibold bg-gradient-to-r from-blue-50 via-purple-50 to-teal-50 text-slate-700 rounded-full border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CheckCircle2 className="w-4 h-4 text-blue-600 animate-bounce" style={{ animationDuration: '2s' }} />
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-transparent bg-clip-text">
            Connecting 500+ professionals with thousands of property owners
          </span>
        </div>

        <h2 className="text-5xl md:text-7xl font-extrabold mb-6 max-w-5xl leading-tight">
          Property Care Made
          <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-transparent bg-clip-text mt-2 animate-gradient bg-300%">
            Simple & Reliable
          </span>
        </h2>

        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mb-12 leading-relaxed">
          Get professional property services at the push of a button, or grow your business 
          with a steady stream of clients. PropDash connects property owners with licensed, 
          verified professionals instantly.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-8 mb-12">
          {/* Client CTA with Sign In Link */}
          <div className="flex flex-col items-center gap-3 group">
            <Link to="/register/client" className="relative px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl font-bold shadow-2xl shadow-teal-500/40 hover:shadow-teal-500/60 transition-all duration-300 hover:scale-110 flex items-center gap-3 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10">Find a Professional</span>
              <Search className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition" />
            </Link>
            <Link 
              to="/login/client" 
              className="text-sm text-teal-700 hover:text-teal-900 font-semibold transition hover:underline decoration-2 underline-offset-4"
            >
              Sign in as Client
            </Link>
          </div>

          {/* Professional CTA with Sign In Link */}
          <div className="flex flex-col items-center gap-3 group">
            <Link to="/register/professional" className="relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-bold shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 transition-all duration-300 hover:scale-110 flex items-center gap-3 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10">Grow Your Business</span>
              <TrendingUp className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition" />
            </Link>
            <Link 
              to="/login/professional" 
              className="text-sm text-blue-700 hover:text-blue-900 font-semibold transition hover:underline decoration-2 underline-offset-4"
            >
              Sign in as Professional
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-600">
          <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Same-day service</span>
          </span>
          <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">Licensed & insured</span>
          </span>
          <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="font-medium">4.9/5 rating</span>
          </span>
        </div>
      </section>

      {/* HOW IT WORKS - Enhanced */}
      <section className="py-20 md:py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-semibold border-2 border-blue-200">
                Simple Process
              </span>
            </div>
            <h3 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 text-transparent bg-clip-text">
              How PropDash Works
            </h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Two sides of the same platform, working seamlessly together
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* FOR CLIENTS - Enhanced Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition"></div>
              <div className="relative bg-gradient-to-br from-teal-50 to-emerald-50 rounded-3xl p-8 border-2 border-teal-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <div className="bg-white w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition">
                  <Home className="text-teal-600" size={40} />
                </div>
                <h4 className="text-3xl font-bold text-slate-900 mb-4">For Property Owners</h4>
                <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                  Get reliable, professional service at the push of a button
                </p>

                <div className="space-y-5">
                  <EnhancedStep number="1" title="Post Your Need" description="Describe the work needed in seconds" color="teal" />
                  <EnhancedStep number="2" title="Get Instant Quotes" description="Receive quotes from licensed professionals" color="teal" />
                  <EnhancedStep number="3" title="Book & Relax" description="Choose a pro and schedule—it's that easy" color="teal" />
                </div>

                <Link to="/register/client" className="mt-8 inline-flex items-center gap-2 text-teal-700 font-bold hover:text-teal-800 transition group/link">
                  <span className="group-hover/link:underline decoration-2 underline-offset-4">Get Started as a Client</span>
                  <ArrowRight size={18} className="group-hover/link:translate-x-1 transition" />
                </Link>
              </div>
            </div>

            {/* FOR PROFESSIONALS - Enhanced Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition"></div>
              <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <div className="bg-white w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition">
                  <Wrench className="text-blue-600" size={40} />
                </div>
                <h4 className="text-3xl font-bold text-slate-900 mb-4">For Service Professionals</h4>
                <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                  Get more jobs, manage your business, and grow faster
                </p>

                <div className="space-y-5">
                  <EnhancedStep number="1" title="Create Your Profile" description="Showcase your skills and credentials" color="blue" />
                  <EnhancedStep number="2" title="Receive Job Requests" description="Get matched with clients in your area" color="blue" />
                  <EnhancedStep number="3" title="Send Quotes & Get Hired" description="Use AI-powered tools to win more jobs" color="blue" />
                </div>

                <Link to="/register/professional" className="mt-8 inline-flex items-center gap-2 text-blue-700 font-bold hover:text-blue-800 transition group/link">
                  <span className="group-hover/link:underline decoration-2 underline-offset-4">Get Started as a Pro</span>
                  <ArrowRight size={18} className="group-hover/link:translate-x-1 transition" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ENHANCED STATS SECTION */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white py-20 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-10"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <AnimatedStat value="500+" label="Active Professionals" />
            <AnimatedStat value="10,000+" label="Jobs Completed" />
            <AnimatedStat value="4.9★" label="Average Rating" />
            <AnimatedStat value="<2hrs" label="Avg Response Time" />
          </div>
        </div>
      </section>

      {/* ENHANCED FEATURES */}
      <section className="px-6 py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          {/* FOR CLIENTS */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 text-sm font-semibold bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-700 rounded-full border-2 border-teal-200 shadow-lg">
                <Home size={18} />
                For Property Owners
              </div>
              <h3 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 text-transparent bg-clip-text">
                Fast, Reliable Property Care
              </h3>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Everything you need to maintain your property with confidence
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <EnhancedFeatureCard
                icon={<Search className="w-8 h-8" />}
                bgGradient="from-teal-100 to-emerald-100"
                iconGradient="from-teal-600 to-emerald-600"
                title="Find Pros Instantly"
                description="Browse licensed professionals in your area. See ratings, reviews, and credentials."
              />
              <EnhancedFeatureCard
                icon={<Clock className="w-8 h-8" />}
                bgGradient="from-blue-100 to-indigo-100"
                iconGradient="from-blue-600 to-indigo-600"
                title="Same-Day Service"
                description="Many professionals offer same-day availability for urgent needs."
              />
              <EnhancedFeatureCard
                icon={<ShieldCheck className="w-8 h-8" />}
                bgGradient="from-emerald-100 to-green-100"
                iconGradient="from-emerald-600 to-green-600"
                title="Verified & Insured"
                description="Every professional is background-checked, licensed, and insured."
              />
            </div>
          </div>

          {/* FOR PROFESSIONALS */}
          <div>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 text-sm font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full border-2 border-blue-200 shadow-lg">
                <Wrench size={18} />
                For Service Professionals
              </div>
              <h3 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 text-transparent bg-clip-text">
                Tools to Grow Your Business
              </h3>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Everything you need to run a professional service business
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <EnhancedFeatureCard
                icon={<Sparkles className="w-8 h-8" />}
                bgGradient="from-purple-100 to-pink-100"
                iconGradient="from-purple-600 to-pink-600"
                title="AI Quote Builder"
                description="Generate professional estimates in minutes with AI-powered pricing."
              />
              <EnhancedFeatureCard
                icon={<Users className="w-8 h-8" />}
                bgGradient="from-indigo-100 to-purple-100"
                iconGradient="from-indigo-600 to-purple-600"
                title="Client Management"
                description="Track jobs, clients, and invoices all in one powerful dashboard."
              />
              <EnhancedFeatureCard
                icon={<TrendingUp className="w-8 h-8" />}
                bgGradient="from-orange-100 to-red-100"
                iconGradient="from-orange-600 to-red-600"
                title="More Job Leads"
                description="Get matched with clients actively looking for your services."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ENHANCED TESTIMONIALS */}
      <section className="bg-white py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 rounded-full text-sm font-semibold border-2 border-amber-200 inline-block mb-4">
              Testimonials
            </span>
            <h3 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 text-transparent bg-clip-text">
              Trusted by Both Sides
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Client Testimonial - Enhanced */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition"></div>
              <div className="relative bg-gradient-to-br from-teal-50 to-emerald-50 rounded-3xl p-8 border-2 border-teal-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-amber-500 fill-amber-500 drop-shadow-sm" />
                  ))}
                </div>
                <blockquote className="text-xl font-medium text-slate-900 mb-8 leading-relaxed">
                  "I needed a plumber ASAP and PropDash connected me with someone within an hour. Professional, licensed, and the work was perfect. This is how home services should work!"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-teal-400 to-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-2xl">S</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">Sarah Thompson</p>
                    <p className="text-sm text-slate-600">Property Manager, SF</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Testimonial - Enhanced */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition"></div>
              <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-amber-500 fill-amber-500 drop-shadow-sm" />
                  ))}
                </div>
                <blockquote className="text-xl font-medium text-slate-900 mb-8 leading-relaxed">
                  "PropDash doubled my bookings in the first month. The AI quote builder saves me hours, and the compliance tracking is a lifesaver. Best investment for my business."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-blue-400 to-indigo-500 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-2xl">M</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">Marcus Rodriguez</p>
                    <p className="text-sm text-slate-600">Licensed Contractor, Oakland</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ENHANCED CTA SECTION */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white text-center py-24 md:py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold border-2 border-white/30 inline-block mb-8">
            Start Today
          </span>
          <h3 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">Ready to Get Started?</h3>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
            Whether you need reliable property care or want to grow your service business, 
            PropDash has you covered.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Client CTA - Enhanced */}
            <div className="relative group">
              <div className="absolute inset-0 bg-white rounded-3xl blur-xl opacity-30 group-hover:opacity-40 transition"></div>
              <div className="relative bg-white/15 backdrop-blur-md border-2 border-white/30 rounded-3xl p-8 text-left hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] shadow-2xl">
                <Home className="text-teal-300 mb-6 drop-shadow-lg" size={48} />
                <h4 className="text-3xl font-bold mb-3">Property Owners</h4>
                <p className="text-blue-100 mb-8 text-base leading-relaxed">
                  Find licensed professionals for any property need
                </p>
                <Link
                  to="/register/client"
                  className="inline-flex items-center gap-3 px-6 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-all shadow-xl w-full justify-center hover:scale-105 group/btn"
                >
                  <span>Find a Professional</span>
                  <Search size={20} className="group-hover/btn:translate-x-1 transition" />
                </Link>
                <Link
                  to="/login/client"
                  className="block text-center text-sm text-white/90 hover:text-white font-semibold transition hover:underline decoration-2 underline-offset-4 mt-4"
                >
                  Already have an account? Sign in
                </Link>
              </div>
            </div>

            {/* Professional CTA - Enhanced */}
            <div className="relative group">
              <div className="absolute inset-0 bg-white rounded-3xl blur-xl opacity-30 group-hover:opacity-40 transition"></div>
              <div className="relative bg-white/15 backdrop-blur-md border-2 border-white/30 rounded-3xl p-8 text-left hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] shadow-2xl">
                <Wrench className="text-blue-300 mb-6 drop-shadow-lg" size={48} />
                <h4 className="text-3xl font-bold mb-3">Service Professionals</h4>
                <p className="text-blue-100 mb-8 text-base leading-relaxed">
                  Get more clients and streamline your business
                </p>
                <Link
                  to="/register/professional"
                  className="inline-flex items-center gap-3 px-6 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-all shadow-xl w-full justify-center hover:scale-105 group/btn"
                >
                  <span>Grow Your Business</span>
                  <TrendingUp size={20} className="group-hover/btn:translate-x-1 transition" />
                </Link>
                <Link
                  to="/login/professional"
                  className="block text-center text-sm text-white/90 hover:text-white font-semibold transition hover:underline decoration-2 underline-offset-4 mt-4"
                >
                  Already have an account? Sign in
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-base text-blue-100">
            <span className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              Free to start
            </span>
            <span>•</span>
            <span className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              No credit card required
            </span>
            <span>•</span>
            <span className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              Cancel anytime
            </span>
          </div>
        </div>
      </section>

      {/* ENHANCED FOOTER */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75"></div>
                  <div className={`${theme.gradient.provider} p-3 rounded-lg relative`}>
                    <Wrench className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold">PropDash</h3>
              </div>
              <p className="text-slate-400 text-base leading-relaxed max-w-md mb-6">
                The marketplace connecting property owners with licensed, verified 
                service professionals for fast, reliable property care.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition">
                  <span className="text-slate-400 hover:text-white transition">𝕏</span>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition">
                  <span className="text-slate-400 hover:text-white transition">in</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-6 text-white text-lg">Get Started</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li>
                  <Link to="/register/client" className="hover:text-white transition flex items-center gap-2 group">
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition" />
                    For Property Owners
                  </Link>
                </li>
                <li>
                  <Link to="/register/professional" className="hover:text-white transition flex items-center gap-2 group">
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition" />
                    For Service Professionals
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition flex items-center gap-2 group">
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition" />
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition flex items-center gap-2 group">
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition" />
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold mb-6 text-white text-lg">Company</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition flex items-center gap-2 group">
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition" />
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition flex items-center gap-2 group">
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition" />
                    Contact Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition flex items-center gap-2 group">
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition" />
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition flex items-center gap-2 group">
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition" />
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
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition">Security</a>
              <span className="text-slate-700">•</span>
              <a href="#" className="hover:text-white transition">Trust & Safety</a>
              <span className="text-slate-700">•</span>
              <a href="#" className="hover:text-white transition">Help Center</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Enhanced Helper Components

function EnhancedStep({ number, title, description, color }) {
  const colors = {
    teal: "border-teal-500 text-teal-700 bg-teal-50",
    blue: "border-blue-500 text-blue-700 bg-blue-50",
  };

  return (
    <div className="flex items-start gap-4 group">
      <div className={`w-12 h-12 rounded-xl ${colors[color]} border-2 flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-md group-hover:scale-110 transition`}>
        {number}
      </div>
      <div>
        <p className="font-bold text-slate-900 text-lg mb-1">{title}</p>
        <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function EnhancedFeatureCard({ icon, bgGradient, iconGradient, title, description }) {
  return (
    <div className="relative group">
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition`}></div>
      <div className="relative bg-white rounded-2xl shadow-lg border-2 border-slate-100 p-8 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-slate-200">
        <div className={`bg-gradient-to-br ${bgGradient} w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition`}>
          <div className={`bg-gradient-to-br ${iconGradient} text-transparent bg-clip-text`}>
            {icon}
          </div>
        </div>
        <h4 className="text-xl font-bold text-slate-900 mb-3">{title}</h4>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function AnimatedStat({ value, label }) {
  return (
    <div className="group cursor-default">
      <div className="text-5xl md:text-6xl font-extrabold mb-3 drop-shadow-lg group-hover:scale-110 transition duration-300">
        {value}
      </div>
      <div className="text-blue-100 text-sm md:text-base font-medium">{label}</div>
    </div>
  );
}