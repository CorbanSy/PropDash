// src/pages/Landing/components/HowItWorks.jsx
import { Link } from "react-router-dom";
import { Home, Wrench, ArrowRight } from "lucide-react";
import ProcessStep from "../helpers/ProcessStep";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 px-6 bg-secondary-50 fade-in-section opacity-0">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-white border-2 border-secondary-200 text-secondary-700 rounded-full text-sm font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300">
              How It Works
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-secondary-900">
            Two Sides, One Platform
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Seamlessly connecting property owners with service professionals
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* FOR PROPERTY OWNERS */}
          <div className="bg-white rounded-2xl p-8 border-2 border-secondary-200 shadow-lg hover:shadow-2xl hover:border-accent-300 transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-accent-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Home className="text-accent-700" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-secondary-900 mb-4">
              For Property Owners
            </h3>
            <p className="text-secondary-600 mb-8 leading-relaxed">
              Find qualified professionals for any property service need
            </p>

            <div className="space-y-5">
              <ProcessStep
                number="1"
                title="Post Your Request"
                description="Describe your service need in minutes"
              />
              <ProcessStep
                number="2"
                title="Receive Qualified Quotes"
                description="Get proposals from licensed professionals"
              />
              <ProcessStep
                number="3"
                title="Hire with Confidence"
                description="Choose the right pro for your project"
              />
            </div>

            <Link
              to="/register/client"
              className="mt-8 inline-flex items-center gap-2 text-accent-700 font-bold hover:text-accent-800 transition-all duration-200 group"
            >
              <span className="group-hover:underline decoration-2 underline-offset-4">
                Get Started
              </span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-2 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* FOR PROFESSIONALS */}
          <div className="bg-white rounded-2xl p-8 border-2 border-secondary-200 shadow-lg hover:shadow-2xl hover:border-primary-300 transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-primary-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Wrench className="text-primary-700" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-secondary-900 mb-4">
              For Service Professionals
            </h3>
            <p className="text-secondary-600 mb-8 leading-relaxed">
              Grow your business with qualified leads and professional tools
            </p>

            <div className="space-y-5">
              <ProcessStep
                number="1"
                title="Build Your Profile"
                description="Showcase credentials and expertise"
              />
              <ProcessStep
                number="2"
                title="Get Quality Leads"
                description="Receive requests matched to your services"
              />
              <ProcessStep
                number="3"
                title="Win More Work"
                description="Use AI-powered tools to stand out"
              />
            </div>

            <Link
              to="/register/professional"
              className="mt-8 inline-flex items-center gap-2 text-primary-700 font-bold hover:text-primary-800 transition-all duration-200 group"
            >
              <span className="group-hover:underline decoration-2 underline-offset-4">
                Get Started
              </span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-2 transition-transform duration-300"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}