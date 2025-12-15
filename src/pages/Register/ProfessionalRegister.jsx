// src/pages/Register/ProfessionalRegister.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Wrench, 
  Shield, 
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
  BarChart3
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { theme } from "../../styles/theme";
import BenefitItem from "./components/BenefitItem";
import StatCard from "./components/StatCard";

export default function ProfessionalRegister() {
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

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    // 1️⃣ Create Auth Account with user_type metadata
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          name: formData.name,
          user_type: "provider",
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
          email: formData.email,
          phone: formData.phone || null,
          base_rate: 85,
          verification_status: "pending",
          insurance_status: "none",
          license_type: "none",
          service_categories: ['handyman', 'plumbing', 'electrical', 'hvac', 'carpentry', 'painting', 'landscaping', 'cleaning'],
          is_online: false,
          is_available: false,
        });

      if (providerError) {
        setError("Account created but profile setup failed. Please contact support.");
        console.error("Provider insert error:", providerError);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    alert("Account created successfully! Please log in.");
    navigate("/login/professional");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding & Benefits */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Logo - Clickable */}
          <Link to="/" className="flex items-center gap-3 mb-12 group cursor-pointer">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl shadow-lg group-hover:bg-white/30 transition-all duration-300">
              <Wrench className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-white text-3xl font-bold tracking-tight group-hover:text-slate-100 transition">PropDash</h1>
              <p className="text-slate-100 text-sm font-medium">Business Management Platform</p>
            </div>
          </Link>

          {/* Tagline */}
          <div className="mb-12">
            <h2 className="text-white text-4xl font-bold leading-tight mb-4">
              Professional Tools
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-white">
                Built for Your Success
              </span>
            </h2>
            <p className="text-slate-100 text-lg leading-relaxed">
              Join hundreds of service professionals who trust PropDash to manage their operations.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-6">
            <BenefitItem
              icon={<CheckCircle2 size={20} />}
              title="Free Trial Included"
              description="Start with full access. No credit card required to begin."
            />
            <BenefitItem
              icon={<Sparkles size={20} />}
              title="AI-Powered Estimates"
              description="Generate professional quotes with intelligent pricing assistance."
            />
            <BenefitItem
              icon={<Clock size={20} />}
              title="Save 15+ Hours Weekly"
              description="Automate scheduling, invoicing, and client communication."
            />
            <BenefitItem
              icon={<BarChart3 size={20} />}
              title="Business Analytics"
              description="Track revenue, completion rates, and growth metrics in real-time."
            />
          </div>
        </div>

        {/* Footer Stats */}
        <div className="relative z-10">
          <div className="grid grid-cols-3 gap-6">
            <StatCard number="500+" label="Active Professionals" />
            <StatCard number="10,000+" label="Jobs Completed" />
            <StatCard number="4.9★" label="Average Rating" />
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-secondary-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo - Clickable */}
          <Link to="/" className="lg:hidden flex items-center justify-center gap-3 mb-8 group cursor-pointer">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-3 rounded-xl shadow-lg group-hover:shadow-xl transition">
              <Wrench className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-secondary-900 group-hover:text-secondary-700 transition">PropDash</h1>
              <p className="text-xs text-secondary-500">Business Management</p>
            </div>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-secondary-900 tracking-tight mb-2">
              Create Professional Account
            </h2>
            <p className="text-secondary-700 leading-relaxed">
              Start managing your business operations efficiently
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-error-50 border-2 border-error-300 text-error-900 p-4 rounded-lg shadow-sm mb-6 flex items-start gap-3">
              <div className="bg-error-200 rounded-full p-1 flex-shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 bg-error-600 rounded-full"></div>
              </div>
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Business Name */}
            <div>
              <label className="text-sm font-semibold text-secondary-700">
                Business Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all mt-2"
                placeholder="Professional Services LLC"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-secondary-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all mt-2"
                placeholder="you@company.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold text-secondary-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all mt-2"
                placeholder="••••••••"
              />
              <p className="mt-2 text-xs text-secondary-500 flex items-center gap-1.5">
                <Shield size={12} />
                Minimum 6 characters required
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-semibold text-secondary-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all mt-2"
                placeholder="••••••••"
              />
            </div>

            {/* Terms */}
            <div className="pt-2">
              <p className="text-xs text-secondary-600 leading-relaxed">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-primary-700 hover:underline font-semibold">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary-700 hover:underline font-semibold">
                  Privacy Policy
                </a>
              </p>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-primary-700 active:bg-primary-800 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </>
              ) : (
                <>
                  Create Professional Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-secondary-300"></div>
            <span className="text-xs text-secondary-500 font-semibold">
              ALREADY REGISTERED?
            </span>
            <div className="flex-1 border-t border-secondary-300"></div>
          </div>

          {/* Login Link */}
          <Link
            to="/login/professional"
            className="w-full border-2 border-secondary-400 text-secondary-700 px-5 py-3 rounded-lg font-semibold hover:bg-secondary-50 active:bg-secondary-100 transition-all inline-flex items-center justify-center"
          >
            Sign In to Account
          </Link>

          {/* Customer Registration Link */}
          <p className="mt-6 text-center text-sm text-secondary-600">
            Looking to hire a professional?{" "}
            <Link to="/register/client" className="text-accent-700 hover:underline font-semibold">
              Register as Property Owner
            </Link>
          </p>

          {/* Trust Badges */}
          <div className="mt-8 pt-6 border-t border-secondary-200 flex items-center justify-center gap-8 text-xs text-secondary-600">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-success-600" />
              <span className="font-medium">Bank-Level Security</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-primary-600" />
              <span className="font-medium">No Credit Card</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}