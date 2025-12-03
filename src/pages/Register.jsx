// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Wrench, 
  Zap, 
  Shield, 
  CheckCircle2,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    // 1️⃣ Create Auth Account
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          name: formData.name,
        },
      },
    });

    if (signUpError) {
      if (signUpError.code === "user_already_exists") {
        setError("This email is already registered. Please use a different email or try logging in.");
      } else if (signUpError.code === "email_address_invalid") {
        setError("Please enter a valid email address.");
      } else if (signUpError.message.toLowerCase().includes("password")) {
        setError("Password does not meet requirements. It must be at least 6 characters long.");
      } else {
        setError(signUpError.message);
      }
      setLoading(false);
      return;
    }

    const user = data.user;

    // 2️⃣ Insert into providers table
    if (user) {
      const { error: providerError } = await supabase
        .from("providers")
        .insert({
          id: user.id,
          business_name: formData.name,
          base_rate: 85,
          verification_status: "pending",
          insurance_status: "none",
          license_type: "none",
        });

      if (providerError) {
        setError("Account created but profile setup failed. Please contact support.");
        console.error("Provider insert error:", providerError);
        setLoading(false);
        return;
      }
    }

    setLoading(false);

    // 3️⃣ Show success message and redirect
    alert("Account created successfully! Please log in.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding & Benefits */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
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
              <p className="text-purple-100 text-sm">For Home Service Pros</p>
            </div>
          </div>

          {/* Tagline */}
          <div className="mb-12">
            <h2 className="text-white text-4xl font-bold leading-tight mb-4">
              Start Growing
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Your Business Today
              </span>
            </h2>
            <p className="text-purple-100 text-lg">
              Join thousands of pros who've simplified their business operations.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-6">
            <BenefitItem
              icon={<CheckCircle2 size={20} />}
              title="Free to Start"
              description="No credit card required. Set up your account in 2 minutes."
            />
            <BenefitItem
              icon={<Sparkles size={20} />}
              title="AI-Powered Quotes"
              description="Generate professional estimates from photos automatically."
            />
            <BenefitItem
              icon={<Zap size={20} />}
              title="Get Booked Faster"
              description="Share your booking link and let clients schedule instantly."
            />
            <BenefitItem
              icon={<Shield size={20} />}
              title="Stay Compliant"
              description="Built-in compliance tracking for licensing and insurance."
            />
          </div>
        </div>

        {/* Footer Stats */}
        <div className="relative z-10">
          <div className="grid grid-cols-3 gap-6">
            <StatCard number="500+" label="Active Pros" />
            <StatCard number="10k+" label="Jobs Completed" />
            <StatCard number="4.9★" label="Avg Rating" />
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-3 rounded-xl">
              <Wrench className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-slate-900 text-2xl font-bold">PropDash</h1>
              <p className="text-slate-600 text-xs">For Home Service Pros</p>
            </div>
          </div>

          {/* Get Started */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Create your account
            </h2>
            <p className="text-slate-600">
              Start managing your business like a pro
            </p>
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Business Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Business Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition"
                placeholder="John's Handyman Services"
              />
            </div>

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
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition"
                placeholder="••••••••"
              />
              <p className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
                <Shield size={12} />
                Must be at least 6 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition"
                placeholder="••••••••"
              />
            </div>

            {/* Terms */}
            <div className="pt-2">
              <p className="text-xs text-slate-600 leading-relaxed">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-purple-600 hover:underline font-medium">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-purple-600 hover:underline font-medium">
                  Privacy Policy
                </a>
              </p>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3.5 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="text-xs text-slate-500 font-medium">
              ALREADY HAVE AN ACCOUNT?
            </span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="block w-full text-center py-3.5 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-slate-300 hover:bg-slate-100 transition"
          >
            Log In
          </Link>

          {/* Trust Badges */}
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Shield size={14} className="text-green-600" />
              <span>Secure & Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-blue-600" />
              <span>No Credit Card</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Benefit Item Component
function BenefitItem({ icon, title, description }) {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-lg flex-shrink-0">
        <div className="text-white">{icon}</div>
      </div>
      <div>
        <h3 className="text-white font-semibold mb-1">{title}</h3>
        <p className="text-purple-100 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ number, label }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
      <div className="text-2xl font-bold text-white mb-1">{number}</div>
      <div className="text-xs text-purple-100">{label}</div>
    </div>
  );
}