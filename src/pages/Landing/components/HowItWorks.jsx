import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Wrench,
  Home,
  Upload,
  Users,
  CheckCircle,
  Award,
  Zap,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export default function HowItWorks() {
  const [activeUser, setActiveUser] = useState("owner");
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleUserSwitch = (userType) => {
    setHasAnimated(false);
    setActiveUser(userType);
    setTimeout(() => setHasAnimated(true), 50);
  };

  const ownerSteps = [
    {
      number: "1",
      icon: <Upload className="w-8 h-8" />,
      title: "Post Your Request",
      description: "Describe what you need done in minutes. Include photos, timeline, and budget.",
    },
    {
      number: "2",
      icon: <Users className="w-8 h-8" />,
      title: "Review & Compare",
      description: "Receive quotes from licensed professionals. Check reviews, credentials, and past work.",
    },
    {
      number: "3",
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Hire & Complete",
      description: "Choose your professional, agree on terms, and get the work done with confidence.",
    },
  ];

  const professionalSteps = [
    {
      number: "1",
      icon: <Award className="w-8 h-8" />,
      title: "Build Your Profile",
      description: "Showcase your skills, certifications, and past projects to attract quality clients.",
    },
    {
      number: "2",
      icon: <Zap className="w-8 h-8" />,
      title: "Get Matched",
      description: "Receive job requests matched to your skills. Use AI-powered tools to create winning quotes.",
    },
    {
      number: "3",
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Grow Your Business",
      description: "Win jobs, build your reputation, and scale your business with professional tools.",
    },
  ];

  const currentSteps = activeUser === "owner" ? ownerSteps : professionalSteps;

  const getCardVariants = (index) => ({
    initial: {
      x: 0,
      y: index * 8,
      scale: 1 - index * 0.05,
      opacity: 0.7,
      rotateY: index * 3,
    },
    animate: {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      rotateY: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  });

  return (
    <section id="how-it-works" className="py-16 md:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-3 text-secondary-900"
          >
            How it works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-secondary-600 max-w-2xl mx-auto mb-8"
          >
            Get started in minutes, whether you need help or provide services
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex bg-secondary-100 p-1.5 rounded-xl"
          >
            <button
              onClick={() => handleUserSwitch("owner")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeUser === "owner"
                  ? "bg-white shadow-lg text-secondary-900"
                  : "text-secondary-600 hover:text-secondary-900"
              }`}
            >
              <Home size={20} />
              <span className="hidden sm:inline">Property Owners</span>
              <span className="sm:hidden">Owners</span>
            </button>
            <button
              onClick={() => handleUserSwitch("professional")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeUser === "professional"
                  ? "bg-white shadow-lg text-secondary-900"
                  : "text-secondary-600 hover:text-secondary-900"
              }`}
            >
              <Wrench size={20} />
              <span className="hidden sm:inline">Professionals</span>
              <span className="sm:hidden">Pros</span>
            </button>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-10">
          {currentSteps.map((step, index) => (
            <motion.div
              key={`${activeUser}-${index}`}
              variants={getCardVariants(index)}
              initial="initial"
              animate={hasAnimated ? "animate" : "initial"}
              className="bg-white border-2 border-secondary-200 hover:border-primary-300 rounded-xl p-6 md:p-8 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-primary-100 w-10 h-10 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-bold text-lg">{step.number}</span>
                </div>
                <div className="text-primary-600">{step.icon}</div>
              </div>

              <h3 className="text-xl font-bold text-secondary-900 mb-3">{step.title}</h3>
              <p className="text-secondary-600 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <Link
            to={activeUser === "owner" ? "/register/client" : "/register/professional"}
            className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all ${
              activeUser === "owner"
                ? "bg-accent-600 hover:bg-accent-700 text-white"
                : "bg-primary-600 hover:bg-primary-700 text-white"
            }`}
          >
            <span>{activeUser === "owner" ? "Find Professionals" : "Start Growing"}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-secondary-500 mt-3">
            {activeUser === "owner" ? "Free to post • No credit card required" : "Free to join • No monthly fees"}
          </p>
        </motion.div>
      </div>
    </section>
  );
}