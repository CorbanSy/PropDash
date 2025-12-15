// src/pages/Landing/components/Stats.jsx
import AnimatedStatBox from "../helpers/AnimatedStatBox";

export default function Stats() {
  return (
    <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-16 shadow-inner fade-in-section opacity-0">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <AnimatedStatBox value="500+" label="Active Professionals" delay="0" />
          <AnimatedStatBox value="10,000+" label="Jobs Completed" delay="0.1" />
          <AnimatedStatBox value="4.9★" label="Average Rating" delay="0.2" />
          <AnimatedStatBox value="<2hrs" label="Response Time" delay="0.3" />
        </div>
      </div>
    </section>
  );
}