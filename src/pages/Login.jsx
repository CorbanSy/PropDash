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
  Home,
  Award,
  BarChart3
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { theme } from "../styles/theme";

export default function Login() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("provider");
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
    
    if (userType && userType !== selectedType) {
      setError(
        `This account is registered as a ${userType === "customer" ? "Client" : "Service Professional"}. Please select the correct account type.`
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

  // Configuration based on selected type
  const config = {
    provider: {
      gradient: theme.gradient.providerLight,
      button: theme.button.provider,
      input: theme.input.provider,
      icon: Wrench,
      subtitle: "Business Management Platform",
      tagline: "Enterprise Tools",
      taglineHighlight: "Built for Growth",
      description: "Manage clients, create quotes, and streamline operations—all in one platform.",
      features: [
        {
          icon: <Sparkles size={20} />,
          title: "AI-Powered Estimates",
          description: "Generate professional quotes with intelligent pricing"
        },
        {
          icon: <BarChart3 size={20} />,
          title: "Business Analytics",
          description: "Track revenue and performance in real-time"
        },
        {
          icon: <Shield size={20} />,
          title: "Compliance Management",
          description: "Automated tracking of licensing requirements"
        }
      ],
      testimonial: {
        quote: "PropDash transformed our operations. The automated compliance tracking alone saves us countless hours each month.",
        author: "Marcus Rodriguez, Licensed Contractor"
      }
    },
    customer: {
      gradient: theme.gradient.customerLight,
      button: theme.button.customer,
      input: theme.input.customer,
      icon: Home,
      subtitle: "Property Services Platform",
      tagline: "Professional Services",
      taglineHighlight: "For Your Property",
      description: "Connect with licensed, verified professionals for all your property maintenance needs.",
      features: [
        {
          icon: <Award size={20} />,
          title: "Licensed Professionals",
          description: "Access verified service providers with proven credentials"
        },
        {
          icon: <Zap size={20} />,
          title: "Efficient Booking",
          description: "Schedule appointments with real-time availability"
        },
        {
          icon: <Shield size={20} />,
          title: "Secure Platform",
          description: "Bank-level encryption protects all transactions"
        }
      ],
      testimonial: {
        quote: "PropDash connected me with a licensed contractor who delivered exceptional work. The platform made everything seamless.",
        author: "Sarah Thompson, Property Manager"
      }
    }
  };

  const current = config[selectedType];
  const CurrentIcon = current.icon;

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding & Features */}
      <div className={`hidden lg:flex lg:w-1/2 ${current.gradient} p-12 flex-col justify-between relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl shadow-lg">
              <CurrentIcon className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-white text-3xl font-bold tracking-tight">PropDash</h1>
              <p className="text-slate-100 text-sm font-medium">{current.subtitle}</p>
            </div>
          </div>

          {/* Tagline */}
          <div className="mb-12">
            <h2 className="text-white text-4xl font-bold leading-tight mb-4">
              {current.tagline}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-white">
                {current.taglineHighlight}
              </span>
            </h2>
            <p className="text-slate-100 text-lg leading-relaxed">{current.description}</p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            {current.features.map((feature, index) => (
              <FeatureItem key={index} {...feature} />
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-sm">
            <p className="text-white text-sm italic mb-2 leading-relaxed">
              "{current.testimonial.quote}"
            </p>
            <p className="text-slate-100 text-xs font-medium">
              — {current.testimonial.author}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className={`${selectedType === "customer" ? theme.gradient.customer : theme.gradient.provider} p-3 rounded-xl shadow-lg`}>
              <CurrentIcon className="text-white" size={28} />
            </div>
            <div>
              <h1 className={theme.text.h2}>PropDash</h1>
              <p className={theme.text.caption}>
                {selectedType === "customer" ? "Property Services" : "Business Management"}
              </p>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className={`${theme.text.h1} mb-2`}>Welcome Back</h2>
            <p className={theme.text.body}>Sign in to access your account</p>
          </div>

          {/* Account Type Selector */}
          <div className="mb-6">
            <label className={`${theme.text.label} mb-3 block`}>Account Type</label>
            <div className="grid grid-cols-2 gap-3">
              <AccountTypeButton
                type="provider"
                icon={<Briefcase size={24} />}
                label="Professional"
                isSelected={selectedType === "provider"}
                onClick={() => setSelectedType("provider")}
              />
              <AccountTypeButton
                type="customer"
                icon={<Home size={24} />}
                label="Client"
                isSelected={selectedType === "customer"}
                onClick={() => setSelectedType("customer")}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`${theme.alert.error} mb-6 flex items-start gap-3`}>
              <div className="bg-red-200 rounded-full p-1 flex-shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
              </div>
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={theme.text.label}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`${theme.input.base} ${current.input} mt-2`}
                placeholder="you@company.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className={theme.text.label}>Password</label>
                <button
                  type="button"
                  className="text-xs text-slate-600 hover:text-slate-900 font-medium"
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
                className={`${theme.input.base} ${current.input}`}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${current.button} disabled:opacity-50 disabled:cursor-not-allowed justify-center`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-slate-300"></div>
            <span className="text-xs text-slate-500 font-semibold">NEW TO PROPDASH?</span>
            <div className="flex-1 border-t border-slate-300"></div>
          </div>

          {/* Registration Options */}
          <div className="space-y-3">
            <Link to="/register" className={`${theme.button.provider} w-full text-center justify-center`}>
              Register as Professional
            </Link>
            <Link to="/customer-register" className={`${theme.button.secondary} w-full text-center justify-center`}>
              Register as Client
            </Link>
          </div>

          <p className="mt-4 text-center text-xs text-slate-500 leading-relaxed">
            Professionals provide services. Clients hire professionals.
          </p>

          {/* Trust Badges */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-center gap-8 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-emerald-600" />
              <span className="font-medium">Bank-Level Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-blue-600" />
              <span className="font-medium">Instant Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Account Type Button Component
function AccountTypeButton({ type, icon, label, isSelected, onClick }) {
  const selectedStyles = type === "provider"
    ? "border-slate-700 bg-slate-50 text-slate-900 shadow-sm"
    : "border-teal-700 bg-teal-50 text-teal-900 shadow-sm";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition ${
        isSelected 
          ? selectedStyles
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
      }`}
    >
      {icon}
      <span className="font-semibold text-sm">{label}</span>
    </button>
  );
}

// Feature Item Component
function FeatureItem({ icon, title, description }) {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-lg flex-shrink-0 shadow-sm">
        <div className="text-white">{icon}</div>
      </div>
      <div>
        <h3 className="text-white font-semibold mb-1">{title}</h3>
        <p className="text-slate-100 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}