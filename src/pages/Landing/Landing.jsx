//levlpro-mvp\src\pages\Landing\Landing.jsx
import { useState, useEffect } from "react";
import Header from "./components/Header";
import MobileMenu from "./components/MobileMenu";
import HeroEnhanced from "./components/Hero";
import TrustBadges from "./components/TrustBadges";
import ServiceCategories from "./components/ServiceCategories";
import HowItWorks from "./components/HowItWorks";
import StatsEnhanced from "./components/Stats";
import VisualShowcase from "./components/VisualShowcase";
import Features from "./components/Features";
import TestimonialsEnhanced from "./components/Testimonials";
import CTA from "./components/CTA";
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
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <Header
        isScrolled={isScrolled}
        showLoginMenu={showLoginMenu}
        setShowLoginMenu={setShowLoginMenu}
        setShowMobileMenu={setShowMobileMenu}
        showMobileMenu={showMobileMenu}
      />

      <MobileMenu
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />

      <HeroEnhanced />
      
      <TrustBadges />
      
      <ServiceCategories />
      
      <HowItWorks />
      
      <StatsEnhanced />
      
      <VisualShowcase />
      
      <Features />
      
      <TestimonialsEnhanced />
      
      <CTA />
      
      <Footer />
    </div>
  );
}