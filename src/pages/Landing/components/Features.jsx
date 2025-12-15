// src/pages/Landing/components/Features.jsx
import {
  Search,
  Clock,
  ShieldCheck,
  Sparkles,
  Users,
  BarChart3,
  Home,
  Wrench,
} from "lucide-react";
import AnimatedFeatureCard from "../helpers/AnimatedFeatureCard";

export default function Features() {
  return (
    <section id="features" className="px-6 py-20 md:py-28 bg-white fade-in-section opacity-0">
      <div className="max-w-6xl mx-auto">
        {/* FOR PROPERTY OWNERS */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 bg-accent-50 border-2 border-accent-200 text-accent-800 rounded-full font-semibold hover:scale-105 transition-transform duration-300">
              <Home size={18} />
              For Property Owners
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-secondary-900">
              Professional Service, Guaranteed
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Everything you need to maintain your property with confidence
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <AnimatedFeatureCard
              icon={<Search className="w-8 h-8" />}
              bgColor="bg-accent-50"
              iconColor="text-accent-700"
              borderColor="border-accent-200"
              hoverBorderColor="hover:border-accent-400"
              title="Qualified Professionals"
              description="Browse licensed, insured professionals with verified credentials and customer reviews."
              delay="0"
            />
            <AnimatedFeatureCard
              icon={<Clock className="w-8 h-8" />}
              bgColor="bg-primary-50"
              iconColor="text-primary-700"
              borderColor="border-primary-200"
              hoverBorderColor="hover:border-primary-400"
              title="Fast Response Times"
              description="Many professionals offer same-day service for urgent property needs."
              delay="0.1"
            />
            <AnimatedFeatureCard
              icon={<ShieldCheck className="w-8 h-8" />}
              bgColor="bg-success-50"
              iconColor="text-success-700"
              borderColor="border-success-200"
              hoverBorderColor="hover:border-success-400"
              title="Trust & Safety"
              description="Every professional is background-checked with verified licensing and insurance."
              delay="0.2"
            />
          </div>
        </div>

        {/* FOR PROFESSIONALS */}
        <div>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 bg-primary-50 border-2 border-primary-200 text-primary-800 rounded-full font-semibold hover:scale-105 transition-transform duration-300">
              <Wrench size={18} />
              For Service Professionals
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-secondary-900">
              Business Growth Tools
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Professional-grade tools to manage and scale your service business
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <AnimatedFeatureCard
              icon={<Sparkles className="w-8 h-8" />}
              bgColor="bg-premium-50"
              iconColor="text-premium-700"
              borderColor="border-premium-200"
              hoverBorderColor="hover:border-premium-400"
              title="AI-Powered Quoting"
              description="Generate professional estimates in minutes with intelligent pricing recommendations."
              delay="0"
            />
            <AnimatedFeatureCard
              icon={<Users className="w-8 h-8" />}
              bgColor="bg-primary-50"
              iconColor="text-primary-700"
              borderColor="border-primary-200"
              hoverBorderColor="hover:border-primary-400"
              title="Client Management"
              description="Track jobs, invoices, and customer relationships in one centralized platform."
              delay="0.1"
            />
            <AnimatedFeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              bgColor="bg-success-50"
              iconColor="text-success-700"
              borderColor="border-success-200"
              hoverBorderColor="hover:border-success-400"
              title="Quality Leads"
              description="Get matched with property owners actively seeking your specific services."
              delay="0.2"
            />
          </div>
        </div>
      </div>
    </section>
  );
}