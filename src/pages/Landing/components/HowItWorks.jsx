import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Wrench, ArrowRight, Upload, Users, CheckCircle, Zap, Award, TrendingUp } from "lucide-react";

export default function HowItWorksInteractive() {
  const [activeUser, setActiveUser] = useState("owner"); // 'owner' or 'professional'

  const ownerSteps = [
    {
      number: "1",
      icon: <Upload className="w-10 h-10" />,
      title: "Post Your Request",
      description: "Describe what you need done in minutes. Include photos, timeline, and budget.",
      details: ["Free to post", "Visible to qualified pros only", "Response within hours"],
    },
    {
      number: "2",
      icon: <Users className="w-10 h-10" />,
      title: "Review & Compare",
      description: "Receive quotes from licensed professionals. Check reviews, credentials, and past work.",
      details: ["Multiple quotes", "Verified credentials", "Customer reviews & ratings"],
    },
    {
      number: "3",
      icon: <CheckCircle className="w-10 h-10" />,
      title: "Hire & Complete",
      description: "Choose your professional, agree on terms, and get the work done with confidence.",
      details: ["Secure payment", "Track progress", "Quality guaranteed"],
    },
  ];

  const professionalSteps = [
    {
      number: "1",
      icon: <Award className="w-10 h-10" />,
      title: "Build Your Profile",
      description: "Showcase your skills, certifications, and past projects to attract quality clients.",
      details: ["Highlight expertise", "Upload portfolio", "Set your service area"],
    },
    {
      number: "2",
      icon: <Zap className="w-10 h-10" />,
      title: "Get Matched",
      description: "Receive job requests matched to your skills. Use AI-powered tools to create winning quotes.",
      details: ["Smart matching", "AI quote builder", "Instant notifications"],
    },
    {
      number: "3",
      icon: <TrendingUp className="w-10 h-10" />,
      title: "Grow Your Business",
      description: "Win jobs, build your reputation, and scale your business with professional tools.",
      details: ["Secure payments", "Client management", "Business analytics"],
    },
  ];

  const currentSteps = activeUser === "owner" ? ownerSteps : professionalSteps;
  const currentColor = activeUser === "owner" ? "accent" : "primary";

  return (
    <section id="how-it-works" className="py-16 md:py-20 px-6 bg-white fade-in-section opacity-0">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="px-4 py-2 bg-secondary-100 border-2 border-secondary-200 text-secondary-700 rounded-full text-sm font-semibold inline-block mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 text-secondary-900">
            Simple Steps to Success
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Get started in minutes, whether you need help or provide services
          </p>
        </div>

        {/* User Type Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-secondary-100 p-1.5 rounded-xl shadow-inner">
            <button
              onClick={() => setActiveUser("owner")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeUser === "owner"
                  ? "bg-white shadow-lg text-accent-700 scale-105"
                  : "text-secondary-600 hover:text-secondary-900"
              }`}
            >
              <Home size={20} />
              <span>Property Owners</span>
            </button>
            <button
              onClick={() => setActiveUser("professional")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeUser === "professional"
                  ? "bg-white shadow-lg text-primary-700 scale-105"
                  : "text-secondary-600 hover:text-secondary-900"
              }`}
            >
              <Wrench size={20} />
              <span>Professionals</span>
            </button>
          </div>
        </div>

        {/* Steps Display */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {currentSteps.map((step, index) => (
            <div
              key={index}
              className={`relative bg-gradient-to-br ${
                activeUser === "owner"
                  ? "from-accent-50 to-white border-accent-200"
                  : "from-primary-50 to-white border-primary-200"
              } rounded-2xl p-8 border-2 shadow-lg hover:shadow-2xl transition-all duration-500 opacity-0 animate-slideUp hover:-translate-y-2`}
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
            >
              {/* Step Number Badge */}
              <div
                className={`absolute -top-4 -right-4 w-12 h-12 ${
                  activeUser === "owner"
                    ? "bg-gradient-to-br from-accent-500 to-accent-600"
                    : "bg-gradient-to-br from-primary-500 to-primary-600"
                } rounded-full flex items-center justify-center shadow-lg border-4 border-white`}
              >
                <span className="text-white font-bold text-xl">{step.number}</span>
              </div>

              {/* Icon */}
              <div
                className={`${
                  activeUser === "owner" ? "bg-accent-100 text-accent-700" : "bg-primary-100 text-primary-700"
                } w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto transition-transform hover:scale-110 hover:rotate-6`}
              >
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-secondary-900 mb-3 text-center">{step.title}</h3>
              <p className="text-secondary-600 mb-6 text-center leading-relaxed">{step.description}</p>

              {/* Details List */}
              <ul className="space-y-2">
                {step.details.map((detail, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-secondary-600">
                    <CheckCircle
                      className={`w-4 h-4 flex-shrink-0 ${
                        activeUser === "owner" ? "text-accent-600" : "text-primary-600"
                      }`}
                    />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to={activeUser === "owner" ? "/register/client" : "/register/professional"}
            className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group ${
              activeUser === "owner"
                ? "bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white"
                : "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white"
            }`}
          >
            <span>{activeUser === "owner" ? "Find Professionals" : "Start Growing"}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-sm text-secondary-500 mt-4">
            {activeUser === "owner" ? "Free to post • No credit card required" : "Free to join • No monthly fees"}
          </p>
        </div>
      </div>
    </section>
  );
}