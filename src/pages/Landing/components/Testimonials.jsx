// src/pages/Landing/components/Testimonials.jsx
import { Star } from "lucide-react";

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-secondary-50 py-20 md:py-28 px-6 fade-in-section opacity-0">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="px-4 py-2 bg-white border-2 border-secondary-200 text-secondary-700 rounded-full text-sm font-semibold inline-block mb-4 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300">
            Customer Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-secondary-900">
            Trusted by Professionals & Property Owners
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Property Owner Testimonial */}
          <div className="bg-white rounded-2xl p-8 border-2 border-secondary-200 shadow-lg hover:shadow-2xl hover:border-accent-300 transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 text-warning-500 fill-warning-500 hover:scale-125 transition-transform duration-200"
                  style={{ transitionDelay: `${i * 50}ms` }}
                />
              ))}
            </div>
            <blockquote className="text-lg font-medium text-secondary-800 mb-8 leading-relaxed">
              "PropDash connected me with a licensed plumber within an hour of
              posting my request. Professional service, transparent pricing, and
              excellent results. Exactly what I needed."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="bg-accent-200 w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110">
                <span className="text-accent-900 font-bold text-xl">S</span>
              </div>
              <div>
                <p className="font-bold text-secondary-900">Sarah Thompson</p>
                <p className="text-sm text-secondary-600">
                  Property Manager, San Francisco
                </p>
              </div>
            </div>
          </div>

          {/* Professional Testimonial */}
          <div className="bg-white rounded-2xl p-8 border-2 border-secondary-200 shadow-lg hover:shadow-2xl hover:border-primary-300 transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 text-warning-500 fill-warning-500 hover:scale-125 transition-transform duration-200"
                  style={{ transitionDelay: `${i * 50}ms` }}
                />
              ))}
            </div>
            <blockquote className="text-lg font-medium text-secondary-800 mb-8 leading-relaxed">
              "PropDash has transformed my business. Quality leads, professional
              tools, and reliable income. The AI quote builder alone saves me
              hours every week."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="bg-primary-200 w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110">
                <span className="text-primary-900 font-bold text-xl">M</span>
              </div>
              <div>
                <p className="font-bold text-secondary-900">Marcus Rodriguez</p>
                <p className="text-sm text-secondary-600">
                  Licensed Contractor, Oakland
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}