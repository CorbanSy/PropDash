// src/pages/CustomerRegister.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Wrench,
  Home,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
  Star,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function CustomerRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
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
          full_name: formData.name,
          user_type: "customer", // 👈 Important!
        },
      },
    });

    if (signUpError) {
      if (signUpError.code === "user_already_exists") {
        setError("This email is already registered.");
      } else {
        setError(signUpError.message);
      }
      setLoading(false);
      return;
    }

    const user = data.user;

    // 2️⃣ Insert into customers table
    if (user) {
      const { error: customerError } = await supabase.from("customers").insert({
        id: user.id,
        full_name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });

      if (customerError) {
        setError("Account created but profile setup failed.");
        console.error("Customer insert error:", customerError);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    alert("Account created successfully! Please log in.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Benefits */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Wrench className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-white text-3xl font-bold">PropDash</h1>
              <p className="text-green-100 text-sm">Find Trusted Pros</p>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-white text-4xl font-bold leading-tight mb-4">
              Get Your Home
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Projects Done Right
              </span>
            </h2>
            <p className="text-green-100 text-lg">
              Connect with verified local pros for all your home service needs.
            </p>
          </div>

          <div className="space-y-6">
            <BenefitItem
              icon={<CheckCircle2 size={20} />}
              title="Verified Pros"
              description="All service providers are vetted and verified"
            />
            <BenefitItem
              icon={<Zap size={20} />}
              title="Instant Booking"
              description="Book appointments in seconds, not hours"
            />
            <BenefitItem
              icon={<Shield size={20} />}
              title="Protected Payments"
              description="Your payments are secure and protected"
            />
            <BenefitItem
              icon={<Star size={20} />}
              title="Quality Guaranteed"
              description="Read reviews and ratings from real customers"
            />
          </div>
        </div>

        <div className="relative z-10">
          <div className="grid grid-cols-3 gap-6">
            <StatCard number="2,500+" label="Trusted Pros" />
            <StatCard number="50k+" label="Jobs Done" />
            <StatCard number="4.9★" label="Avg Rating" />
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-3 rounded-xl">
              <Home className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-slate-900 text-2xl font-bold">PropDash</h1>
              <p className="text-slate-600 text-xs">Find Trusted Pros</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Find your perfect pro
            </h2>
            <p className="text-slate-600">
              Create an account to start booking services
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm flex items-start gap-3">
              <div className="bg-red-200 rounded-full p-1 flex-shrink-0">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
              </div>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition"
                placeholder="John Smith"
              />
            </div>

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
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition"
                placeholder="(555) 123-4567"
              />
            </div>

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
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition"
                placeholder="••••••••"
              />
              <p className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
                <Shield size={12} />
                Must be at least 6 characters
              </p>
            </div>

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
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
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

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="text-xs text-slate-500 font-medium">
              ALREADY HAVE AN ACCOUNT?
            </span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          <Link
            to="/login"
            className="block w-full text-center py-3.5 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-slate-300 hover:bg-slate-100 transition"
          >
            Log In
          </Link>

          <p className="mt-6 text-center text-sm text-slate-600">
            Are you a service provider?{" "}
            <Link to="/register" className="text-green-600 hover:underline font-semibold">
              Register as a Pro
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function BenefitItem({ icon, title, description }) {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-lg flex-shrink-0">
        <div className="text-white">{icon}</div>
      </div>
      <div>
        <h3 className="text-white font-semibold mb-1">{title}</h3>
        <p className="text-green-100 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function StatCard({ number, label }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
      <div className="text-2xl font-bold text-white mb-1">{number}</div>
      <div className="text-xs text-green-100">{label}</div>
    </div>
  );
}