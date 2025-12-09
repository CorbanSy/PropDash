// src/pages/Login/ProfessionalLogin.jsx
import { Link } from "react-router-dom";
import { 
  Wrench, 
  Shield, 
  Sparkles,
  BarChart3,
  Zap
} from "lucide-react";
import { theme } from "../../styles/theme";
import LoginForm from "./components/LoginForm";
import FeatureItem from "./components/FeatureItem";

export default function ProfessionalLogin() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding & Features */}
      <div className={`hidden lg:flex lg:w-1/2 ${theme.gradient.providerLight} p-12 flex-col justify-between relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          {/* Logo - Now Clickable */}
          <Link to="/" className="flex items-center gap-3 mb-12 group cursor-pointer">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl shadow-lg group-hover:bg-white/30 transition">
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
              Enterprise Tools
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-white">
                Built for Growth
              </span>
            </h2>
            <p className="text-slate-100 text-lg leading-relaxed">
              Manage clients, create quotes, and streamline operations—all in one platform.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <FeatureItem
              icon={<Sparkles size={20} />}
              title="AI-Powered Estimates"
              description="Generate professional quotes with intelligent pricing"
            />
            <FeatureItem
              icon={<BarChart3 size={20} />}
              title="Business Analytics"
              description="Track revenue and performance in real-time"
            />
            <FeatureItem
              icon={<Shield size={20} />}
              title="Compliance Management"
              description="Automated tracking of licensing requirements"
            />
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-sm">
            <p className="text-white text-sm italic mb-2 leading-relaxed">
              "PropDash transformed our operations. The automated compliance tracking alone saves us countless hours each month."
            </p>
            <p className="text-slate-100 text-xs font-medium">
              — Marcus Rodriguez, Licensed Contractor
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo - Also Clickable */}
          <Link to="/" className="lg:hidden flex items-center justify-center gap-3 mb-8 group cursor-pointer">
            <div className={`${theme.gradient.provider} p-3 rounded-xl shadow-lg group-hover:shadow-xl transition`}>
              <Wrench className="text-white" size={28} />
            </div>
            <div>
              <h1 className={`${theme.text.h2} group-hover:text-slate-700 transition`}>PropDash</h1>
              <p className={theme.text.caption}>Business Management</p>
            </div>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h2 className={`${theme.text.h1} mb-2`}>Professional Login</h2>
            <p className={theme.text.body}>Sign in to manage your business</p>
          </div>

          {/* Login Form */}
          <LoginForm 
            userType="provider" 
            styling={{
              button: theme.button.provider,
              input: theme.input.provider
            }}
          />

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-slate-300"></div>
            <span className="text-xs text-slate-500 font-semibold">NEW PROFESSIONAL?</span>
            <div className="flex-1 border-t border-slate-300"></div>
          </div>

          {/* Registration Link */}
          <Link 
            to="/register/professional" 
            className={`${theme.button.provider} w-full text-center justify-center`}
          >
            Create Professional Account
          </Link>

          {/* Switch Account Type */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Looking for services?{" "}
              <Link to="/login/client" className="text-blue-600 font-semibold hover:text-blue-700">
                Client Login →
              </Link>
            </p>
          </div>

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