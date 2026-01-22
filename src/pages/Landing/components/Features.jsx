//levlpro-mvp\src\pages\Landing\components\Features.jsx
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
    <section id="features" className="px-6 py-12 md:py-16 bg-white fade-in-section opacity-0">
      <div className="max-w-7xl mx-auto">
        {/* Section Header - More Compact */}
        <div className="text-center mb-8">
          <span className="px-4 py-1.5 bg-secondary-100 border-2 border-secondary-200 text-secondary-700 rounded-full text-xs font-semibold inline-block mb-3">
            Platform Features
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-2 text-secondary-900">
            Built for Both Sides of the Marketplace
          </h2>
          <p className="text-base text-secondary-600 max-w-3xl mx-auto">
            Whether you're finding professionals or growing your business, we've got you covered
          </p>
        </div>

        {/* Two Column Layout - Tighter Spacing */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* FOR PROPERTY OWNERS */}
          <div className="bg-gradient-to-br from-accent-50 to-white rounded-2xl p-6 border-2 border-accent-200 shadow-lg">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-3 bg-white border-2 border-accent-300 text-accent-800 rounded-full font-semibold shadow-sm text-sm">
                <Home size={16} />
                For Property Owners
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold mb-2 text-secondary-900">
                Professional Service, Guaranteed
              </h3>
              <p className="text-sm text-secondary-600">
                Everything you need to maintain your property
              </p>
            </div>

            <div className="space-y-3">
              <AnimatedFeatureCard
                icon={<Search className="w-6 h-6" />}
                bgColor="bg-white"
                iconColor="text-accent-700"
                borderColor="border-accent-200"
                hoverBorderColor="hover:border-accent-400"
                title="Qualified Professionals"
                description="Browse licensed, insured professionals with verified credentials."
                delay="0"
                compact={true}
              />
              <AnimatedFeatureCard
                icon={<Clock className="w-6 h-6" />}
                bgColor="bg-white"
                iconColor="text-primary-700"
                borderColor="border-primary-200"
                hoverBorderColor="hover:border-primary-400"
                title="Fast Response Times"
                description="Many professionals offer same-day service for urgent needs."
                delay="0.1"
                compact={true}
              />
              <AnimatedFeatureCard
                icon={<ShieldCheck className="w-6 h-6" />}
                bgColor="bg-white"
                iconColor="text-success-700"
                borderColor="border-success-200"
                hoverBorderColor="hover:border-success-400"
                title="Trust & Safety"
                description="Background-checked with verified licensing and insurance."
                delay="0.2"
                compact={true}
              />
            </div>
          </div>

          {/* FOR PROFESSIONALS */}
          <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl p-6 border-2 border-primary-200 shadow-lg">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-3 bg-white border-2 border-primary-300 text-primary-800 rounded-full font-semibold shadow-sm text-sm">
                <Wrench size={16} />
                For Service Professionals
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold mb-2 text-secondary-900">
                Business Growth Tools
              </h3>
              <p className="text-sm text-secondary-600">
                Professional tools to manage and scale your business
              </p>
            </div>

            <div className="space-y-3">
              <AnimatedFeatureCard
                icon={<Sparkles className="w-6 h-6" />}
                bgColor="bg-white"
                iconColor="text-premium-700"
                borderColor="border-premium-200"
                hoverBorderColor="hover:border-premium-400"
                title="AI-Powered Quoting"
                description="Generate professional estimates with intelligent pricing."
                delay="0"
                compact={true}
              />
              <AnimatedFeatureCard
                icon={<Users className="w-6 h-6" />}
                bgColor="bg-white"
                iconColor="text-primary-700"
                borderColor="border-primary-200"
                hoverBorderColor="hover:border-primary-400"
                title="Client Management"
                description="Track jobs, invoices, and relationships in one place."
                delay="0.1"
                compact={true}
              />
              <AnimatedFeatureCard
                icon={<BarChart3 className="w-6 h-6" />}
                bgColor="bg-white"
                iconColor="text-success-700"
                borderColor="border-success-200"
                hoverBorderColor="hover:border-success-400"
                title="Quality Leads"
                description="Get matched with property owners seeking your services."
                delay="0.2"
                compact={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}