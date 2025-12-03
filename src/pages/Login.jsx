// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Wrench, 
  Zap, 
  Shield, 
  Sparkles,
  ArrowRight,
  Briefcase,
  Home
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("provider"); // 'provider' or 'customer'
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (signInError) {
      if (signInError.message.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please try again.");
      } else if (signInError.message.includes("Email not confirmed")) {
        setError("Please confirm your email address before logging in.");
      } else {
        setError(signInError.message);
      }
      setLoading(false);
      return;
    }

    const userType = data.user.user_metadata?.user_type;
    
    // Validate that selected type matches account type
    if (userType && userType !== selectedType) {
      setError(
        `This account is registered as a ${userType === "customer" ? "Customer" : "Service Pro"}. Please select the correct account type.`
      );
      setLoading(false);
      return;
    }

    console.log("Login successful:", data.user);
    setLoading(false);

    // Route based on account type
    if (selectedType === "customer" || userType === "customer") {
      navigate("/customer/dashboard");
    } else {
      navigate("/provider");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Wrench className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-white text-3xl font-bold">PropDash</h1>
              <p className="text-blue-100 text-sm">
                {selectedType === "customer" ? "Find Trusted Pros" : "For Home Service Pros"}
              </p>
            </div>
          </div>

          {/* Tagline */}
          <div className="mb-12">
            <h2 className="text-white text-4xl font-bold leading-tight mb-4">
              {selectedType === "customer" ? (
                <>
                  Get Your Projects
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                    Done Right
                  </span>
                </>
              ) : (
                <>
                  Your Business
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                    Operating System
                  </span>
                </>
              )}
            </h2>
            <p className="text-blue-100 text-lg">
              {selectedType === "customer"
                ? "Connect with verified local pros for all your home service needs."
                : "Manage clients, create quotes, and get booked—all in one place."}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            {selectedType === "customer" ? (
              <>
                <FeatureItem
                  icon={<Shield size={20} />}
                  title="Verified Pros"
                  description="All service providers are vetted and verified"
                />
                <FeatureItem
                  icon={<Zap size={20} />}
                  title="Instant Booking"
                  description="Book appointments in seconds, not hours"
                />
                <FeatureItem
                  icon={<Sparkles size={20} />}
                  title="Quality Guaranteed"
                  description="Read reviews and ratings from real customers"
                />
              </>
            ) : (
              <>
                <FeatureItem
                  icon={<Sparkles size={20} />}
                  title="AI Quote Builder"
                  description="Turn photos into professional estimates in seconds"
                />
                <FeatureItem
                  icon={<Zap size={20} />}
                  title="Instant Booking Link"
                  description="Share your link, clients book directly"
                />
                <FeatureItem
                  icon={<Shield size={20} />}
                  title="Compliance Built-In"
                  description="Stay compliant with licensing laws automatically"
                />
              </>
            )}
          </div>
        </div>

        {/* Footer Quote */}
        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <p className="text-white text-sm italic mb-2">
              {selectedType === "customer"
                ? '"Found an amazing handyman through PropDash. Super easy!"'
                : '"PropDash changed how I run my business. My clients love the booking link!"'}
            </p>
            <p className="text-blue-200 text-xs font-medium">
              {selectedType === "customer"
                ? "— Sarah T., Homeowner in Berkeley"
                : "— Marcus R., Handyman in Oakland"}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl">
              <Wrench className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-slate-900 text-2xl font-bold">PropDash</h1>
              <p className="text-slate-600 text-xs">
                {selectedType === "customer" ? "Find Trusted Pros" : "For Home Service Pros"}
              </p>
            </div>
          </div>

          {/* Welcome Back */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome back
            </h2>
            <p className="text-slate-600">Log in to access your dashboard</p>
          </div>

          {/* Account Type Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              I am a:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedType("provider")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${
                  selectedType === "provider"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                <Briefcase size={24} />
                <span className="font-semibold text-sm">Service Pro</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedType("customer")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${
                  selectedType === "customer"
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                <Home size={24} />
                <span className="font-semibold text-sm">Customer</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm flex items-start gap-3">
              <div className="bg-red-200 rounded-full p-1 flex-shrink-0">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
              </div>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                placeholder="••••••••"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg ${
                selectedType === "customer"
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-green-500/30"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-blue-500/30"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging in...
                </>
              ) : (
                <>
                  Log In as {selectedType === "customer" ? "Customer" : "Pro"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="text-xs text-slate-500 font-medium">
              NEW TO PROPDASH?
            </span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          {/* Registration Options */}
          <div className="space-y-3">
            <Link
              to="/register"
              className="block w-full text-center py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-lg shadow-blue-500/30"
            >
              Register as a Service Pro
            </Link>

            <Link
              to="/customer-register"
              className="block w-full text-center py-3.5 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-slate-300 hover:bg-slate-100 transition"
            >
              Register as a Customer
            </Link>
          </div>

          <p className="mt-4 text-center text-xs text-slate-500">
            Not sure? Service pros offer services. Customers hire pros.
          </p>

          {/* Trust Badges */}
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Shield size={14} className="text-green-600" />
              <span>Secure Login</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap size={14} className="text-blue-600" />
              <span>Fast Setup</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Feature Item Component
function FeatureItem({ icon, title, description }) {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-lg flex-shrink-0">
        <div className="text-white">{icon}</div>
      </div>
      <div>
        <h3 className="text-white font-semibold mb-1">{title}</h3>
        <p className="text-blue-100 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}