import { Link } from "react-router-dom";
import { useState } from "react";
import {
  CheckCircle2,
  Search,
  TrendingUp,
  Clock,
  ShieldCheck,
  Star,
  ArrowRight,
  Play,
  Users,
  Award,
  Zap,
} from "lucide-react";

export default function HeroModern() {
  const [activeUserType, setActiveUserType] = useState("client"); // 'client' or 'professional'

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-0 min-h-[90vh]">
          {/* Left Side - Content */}
          <div className="flex flex-col justify-center px-6 md:px-12 py-16 md:py-24 relative z-10">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 -z-10"></div>

            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-primary-200 text-secondary-700 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 mb-8 self-start animate-slideIn">
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 border-2 border-white"
                  ></div>
                ))}
              </div>
              <span className="text-sm">Join 10,000+ satisfied users</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-slideUp">
              <span className="text-secondary-900">
                Professional
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-700 bg-clip-text text-transparent animate-gradient">
                Property Services
              </span>
              <br />
              <span className="text-secondary-900">Made Simple</span>
            </h1>

            {/* Subheading */}
            <p
              className="text-xl text-secondary-600 mb-10 leading-relaxed max-w-xl animate-slideUp"
              style={{ animationDelay: "0.1s" }}
            >
              Connect with verified professionals for any property need, or grow your service business with our powerful platform.
            </p>

            {/* User Type Toggle */}
            <div
              className="bg-secondary-100 p-1.5 rounded-xl inline-flex gap-1 mb-8 animate-slideUp"
              style={{ animationDelay: "0.2s" }}
            >
              <button
                onClick={() => setActiveUserType("client")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeUserType === "client"
                    ? "bg-white shadow-lg text-secondary-900"
                    : "text-secondary-600 hover:text-secondary-900"
                }`}
              >
                I need a professional
              </button>
              <button
                onClick={() => setActiveUserType("professional")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeUserType === "professional"
                    ? "bg-white shadow-lg text-secondary-900"
                    : "text-secondary-600 hover:text-secondary-900"
                }`}
              >
                I am a professional
              </button>
            </div>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-4 mb-10 animate-slideUp"
              style={{ animationDelay: "0.3s" }}
            >
              <Link
                to={activeUserType === "client" ? "/register/client" : "/register/professional"}
                className={`inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group ${
                  activeUserType === "client"
                    ? "bg-accent-600 text-white hover:bg-accent-700"
                    : "bg-primary-600 text-white hover:bg-primary-700"
                }`}
              >
                <span>{activeUserType === "client" ? "Find Professionals" : "Get Started Free"}</span>
                {activeUserType === "client" ? (
                  <Search className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                ) : (
                  <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                )}
              </Link>

              <Link
                to={activeUserType === "client" ? "/login/client" : "/login/professional"}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg border-2 border-secondary-300 text-secondary-700 hover:bg-secondary-50 hover:border-secondary-400 transition-all duration-300"
              >
                Sign In
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 animate-fadeIn" style={{ animationDelay: "0.4s" }}>
              {[
                { icon: Clock, text: "Same-day service" },
                { icon: ShieldCheck, text: "Licensed & insured" },
                { icon: Star, text: "4.9/5 average" },
              ].map((item, index) => (
                <span
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-secondary-200 rounded-full text-sm font-medium text-secondary-700 hover:border-primary-300 hover:scale-105 transition-all shadow-sm hover:shadow-md"
                >
                  <item.icon className="w-4 h-4 text-primary-600" />
                  {item.text}
                </span>
              ))}
            </div>
          </div>

          {/* Right Side - Visual */}
          <div className="relative lg:min-h-[90vh] bg-gradient-to-br from-secondary-900 to-secondary-800">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
            </div>

            {/* Main Image Placeholder */}
            <div className="relative h-full flex items-center justify-center p-12">
              {/* Replace this with actual image */}
              <div className="relative w-full max-w-lg">
                <div className="aspect-[4/5] bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl shadow-2xl overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center p-8 text-white text-center">
                    <div>
                      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                        <Play className="w-12 h-12 ml-1" />
                      </div>
                      <p className="text-2xl font-bold mb-2">Hero Image Here</p>
                      <p className="text-white/80">Professional working or happy customer</p>
                    </div>
                  </div>
                </div>

                {/* Floating Stats */}
                <div className="absolute -top-8 -left-8 bg-white rounded-2xl p-6 shadow-2xl border-2 border-primary-200 animate-float max-w-[200px]">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary-100 p-3 rounded-xl">
                      <Users className="w-6 h-6 text-primary-700" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-secondary-900">500+</div>
                      <div className="text-sm text-secondary-600">Active Professionals</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl p-6 shadow-2xl border-2 border-success-200 animate-float max-w-[200px]" style={{ animationDelay: "1s" }}>
                  <div className="flex items-start gap-3">
                    <div className="bg-success-100 p-3 rounded-xl">
                      <Award className="w-6 h-6 text-success-700" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-secondary-900">10k+</div>
                      <div className="text-sm text-secondary-600">Jobs Completed</div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/2 -right-12 bg-white rounded-2xl p-6 shadow-2xl border-2 border-warning-200 animate-float" style={{ animationDelay: "2s" }}>
                  <div className="flex items-center gap-3">
                    <div className="bg-warning-100 p-3 rounded-xl">
                      <Star className="w-6 h-6 text-warning-600 fill-warning-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-secondary-900">4.9</div>
                      <div className="text-sm text-secondary-600">Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Gradient Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-secondary-900 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Trusted Companies Strip */}
      <div className="bg-secondary-50 border-t-2 border-secondary-200 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-secondary-600 text-sm font-semibold mb-6 text-center">
            TRUSTED BY LEADING COMPANIES
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12">
            {["Company A", "Company B", "Company C", "Company D", "Company E"].map((company, index) => (
              <div
                key={index}
                className="bg-white px-8 py-4 rounded-xl shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer border-2 border-secondary-200"
              >
                <span className="font-bold text-secondary-400 text-lg whitespace-nowrap">
                  {company}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}