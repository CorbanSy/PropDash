//levlpro-mvp\src\pages\Login\ClientLogin.jsx

import { Link } from "react-router-dom";
import { 
  Home, 
  Shield, 
  Award,
  Zap
} from "lucide-react";
import { theme } from "../../styles/theme";
import LoginForm from "./components/LoginForm";
import FeatureItem from "./components/FeatureItem";

export default function ClientLogin() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-600 via-accent-700 to-accent-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
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

          {/* Tagline */}
          <div className="mb-12">
            <h2 className="text-white text-4xl font-bold leading-tight mb-4">
              Professional Services
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-white">
                For Your Property
              </span>
            </h2>
            <p className="text-slate-100 text-lg leading-relaxed">
              Connect with licensed, verified professionals for all your property maintenance needs.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <FeatureItem
              icon={<Award size={20} />}
              title="Licensed Professionals"
              description="Access verified service providers with proven credentials"
            />
            <FeatureItem
              icon={<Zap size={20} />}
              title="Efficient Booking"
              description="Schedule appointments with real-time availability"
            />
            <FeatureItem
              icon={<Shield size={20} />}
              title="Secure Platform"
              description="Bank-level encryption protects all transactions"
            />
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-sm hover:bg-white/15 transition-all duration-300">
            <p className="text-white text-sm italic mb-2 leading-relaxed">
              "LevlPro connected me with a licensed contractor who delivered exceptional work. The platform made everything seamless."
            </p>
            <p className="text-slate-100 text-xs font-medium">
              — Sarah Thompson, Property Manager
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-secondary-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo - Clickable */}
          <Link to="/" className="lg:hidden flex items-center justify-center gap-3 mb-8 group cursor-pointer">
            <div className="bg-gradient-to-r from-accent-600 to-accent-700 p-3 rounded-xl shadow-lg group-hover:shadow-xl transition">
              <Home className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-secondary-900 group-hover:text-secondary-700 transition">PropDash</h1>
              <p className="text-xs text-secondary-500">Property Services</p>
            </div>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-secondary-900 tracking-tight mb-2">Client Login</h2>
            <p className="text-secondary-700 leading-relaxed">Sign in to manage your projects</p>
          </div>

          {/* Login Form */}
          <LoginForm 
            userType="customer" 
            styling={{
              button: "bg-accent-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-accent-700 active:bg-accent-800 transition-all shadow-sm hover:shadow-md",
              input: "focus:ring-accent-600 focus:border-accent-600"
            }}
          />

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-secondary-300"></div>
            <span className="text-xs text-secondary-500 font-semibold">NEW CLIENT?</span>
            <div className="flex-1 border-t border-secondary-300"></div>
          </div>

          {/* Registration Link */}
          <Link 
            to="/register/client" 
            className="w-full bg-accent-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-accent-700 active:bg-accent-800 transition-all shadow-sm hover:shadow-md inline-flex items-center justify-center gap-2"
          >
            Create Client Account
          </Link>

          {/* Switch Account Type */}
          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-600">
              Are you a service professional?{" "}
              <Link to="/login/professional" className="text-primary-700 font-semibold hover:text-primary-800 hover:underline">
                Professional Login →
              </Link>
            </p>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 pt-6 border-t border-secondary-200 flex items-center justify-center gap-8 text-xs text-secondary-600">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-success-600" />
              <span className="font-medium">Bank-Level Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-accent-600" />
              <span className="font-medium">Instant Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}