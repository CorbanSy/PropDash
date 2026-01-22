//levlpro-mvp\src\pages\Register\ClientRegister.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Home,
  CheckCircle2,
  ArrowRight,
  Shield,
  Star,
  Clock,
  Award,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { theme } from "../../styles/theme";
import BenefitItem from "./components/BenefitItem";
import StatCard from "./components/StatCard";
import { 
  validateRegistrationForm,
  parseSupabaseAuthError,
  formatRegistrationData 
} from "../../utils/registrationValidation";

export default function ClientRegister() {
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

    // ✅ Use testable validation
    const validation = validateRegistrationForm(formData, 'customer');
    
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setError(firstError);
      return;
    }

    setLoading(true);

    // ✅ Use testable data formatter
    const authData = formatRegistrationData(formData, 'customer');
    
    const { data, error: signUpError } = await supabase.auth.signUp(authData);

    if (signUpError) {
      // ✅ Use testable error parser
      setError(parseSupabaseAuthError(signUpError));
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
        setError("Account created but profile setup failed. Please contact support.");
        console.error("Customer insert error:", customerError);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    alert("Account created successfully! Please log in.");
    navigate("/login/client");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Benefits */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-600 via-accent-700 to-accent-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          {/* Logo - Clickable */}
          <Link to="/" className="flex items-center gap-3 mb-12 group cursor-pointer">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl shadow-lg group-hover:bg-white/30 transition-all duration-300">
              <Home className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-white text-3xl font-bold tracking-tight group-hover:text-slate-100 transition">LevlPro</h1>
              <p className="text-slate-100 text-sm font-medium">Property Services Platform</p>
            </div>
          </Link>

          <div className="mb-12">
            <h2 className="text-white text-4xl font-bold leading-tight mb-4">
              Professional Services
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-white">
                For Your Property
              </span>
            </h2>
            <p className="text-slate-100 text-lg leading-relaxed">
              Connect with verified, licensed professionals for all your property maintenance needs.
            </p>
          </div>

          <div className="space-y-6">
            <BenefitItem
              icon={<Award size={20} />}
              title="Licensed Professionals"
              description="Access vetted and verified service providers with proven track records"
            />
            <BenefitItem
              icon={<Clock size={20} />}
              title="Streamlined Booking"
              description="Schedule appointments efficiently with real-time availability"
            />
            <BenefitItem
              icon={<Shield size={20} />}
              title="Secure Transactions"
              description="Bank-level encryption protects all your payment information"
            />
            <BenefitItem
              icon={<Star size={20} />}
              title="Verified Reviews"
              description="Make informed decisions based on authentic customer feedback"
            />
          </div>
        </div>

        <div className="relative z-10">
          <div className="grid grid-cols-3 gap-6">
            <StatCard number="2,500+" label="Verified Professionals" />
            <StatCard number="50,000+" label="Completed Services" />
            <StatCard number="4.9★" label="Average Rating" />
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-secondary-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo - Clickable */}
          <Link to="/" className="lg:hidden flex items-center justify-center gap-3 mb-8 group cursor-pointer">
            <div className="bg-gradient-to-r from-accent-600 to-accent-700 p-3 rounded-xl shadow-lg group-hover:shadow-xl transition">
              <Home className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-secondary-900 group-hover:text-secondary-700 transition">LevlPro</h1>
              <p className="text-xs text-secondary-500">Property Services</p>
            </div>
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-secondary-900 tracking-tight mb-2">
              Create Property Owner Account
            </h2>
            <p className="text-secondary-700 leading-relaxed">
              Start booking professional services for your property
            </p>
          </div>

          {error && (
            <div className="bg-error-50 border-2 border-error-300 text-error-900 p-4 rounded-lg shadow-sm mb-6 flex items-start gap-3">
              <div className="bg-error-200 rounded-full p-1 flex-shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 bg-error-600 rounded-full"></div>
              </div>
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-secondary-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-accent-600 focus:border-accent-600 focus:outline-none transition-all mt-2"
                placeholder="John Smith"
              />
            </div>

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
                className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-accent-600 focus:border-accent-600 focus:outline-none transition-all mt-2"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-secondary-700">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-accent-600 focus:border-accent-600 focus:outline-none transition-all mt-2"
                placeholder="(555) 123-4567"
              />
              <p className="mt-2 text-xs text-secondary-500">
                For appointment confirmations and service updates
              </p>
            </div>

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
                className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-accent-600 focus:border-accent-600 focus:outline-none transition-all mt-2"
                placeholder="••••••••"
              />
              <p className="mt-2 text-xs text-secondary-500 flex items-center gap-1.5">
                <Shield size={12} />
                Minimum 6 characters required
              </p>
            </div>

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
                className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-accent-600 focus:border-accent-600 focus:outline-none transition-all mt-2"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2">
              <p className="text-xs text-secondary-600 leading-relaxed">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-accent-700 hover:underline font-semibold">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-accent-700 hover:underline font-semibold">
                  Privacy Policy
                </a>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-accent-700 active:bg-accent-800 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
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
            <div className="flex-1 border-t border-secondary-300"></div>
            <span className="text-xs text-secondary-500 font-semibold">
              ALREADY REGISTERED?
            </span>
            <div className="flex-1 border-t border-secondary-300"></div>
          </div>

          <Link
            to="/login/client"
            className="w-full border-2 border-secondary-400 text-secondary-700 px-5 py-3 rounded-lg font-semibold hover:bg-secondary-50 active:bg-secondary-100 transition-all inline-flex items-center justify-center"
          >
            Sign In to Account
          </Link>

          <p className="mt-6 text-center text-sm text-secondary-600">
            Are you a service provider?{" "}
            <Link to="/register/professional" className="text-primary-700 hover:underline font-semibold">
              Register as Professional
            </Link>
          </p>

          {/* Trust Badges */}
          <div className="mt-8 pt-6 border-t border-secondary-200 flex items-center justify-center gap-8 text-xs text-secondary-600">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-success-600" />
              <span className="font-medium">Secure Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-accent-600" />
              <span className="font-medium">Verified Pros</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}