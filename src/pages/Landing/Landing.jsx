import { useState, useEffect } from "react";
import Header from "./components/Header";
import MobileMenu from "./components/MobileMenu";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import StatsEnhanced from "./components/Stats";
import VisualShowcase from "./components/VisualShowcase";
import Features from "./components/Features";
import TestimonialsEnhanced from "./components/Testimonials";
import Footer from "./components/Footer";

export default function Landing() {
  const [showLoginMenu, setShowLoginMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    document.querySelectorAll(".fade-in-section").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        isScrolled={isScrolled}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />

      <MobileMenu
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />

      {/* Hero now includes the service categories */}
      <Hero />
      
      {/* How It Works section (separate from services) */}
      <HowItWorks />
      
      {/* Keep your other sections */}
      <StatsEnhanced />
      
      <VisualShowcase />
      
      <Features />
      
      <TestimonialsEnhanced />
      
      <Footer />
    </div>
  );
}