import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Thompson",
    role: "Property Manager",
    location: "San Francisco",
    avatar: "S",
    color: "accent",
    rating: 5,
    text: "LevlPro connected me with a licensed plumber within an hour. Professional service, transparent pricing, and excellent results.",
    type: "client"
  },
  {
    name: "Marcus Rodriguez",
    role: "Licensed Contractor",
    location: "Oakland",
    avatar: "M",
    color: "primary",
    rating: 5,
    text: "LevlPro has transformed my business. Quality leads, professional tools, and reliable income. The AI quote builder saves me hours.",
    type: "professional"
  },
  {
    name: "Jennifer Lee",
    role: "Homeowner",
    location: "Berkeley",
    avatar: "J",
    color: "success",
    rating: 5,
    text: "I've used LevlPro for everything from routine maintenance to complete renovations. Every professional has been exceptional!",
    type: "client"
  },
  {
    name: "David Chen",
    role: "HVAC Specialist",
    location: "San Jose",
    avatar: "D",
    color: "info",
    rating: 5,
    text: "Best decision for my business. The platform is intuitive, the leads are genuine, and I've grown my client base by 40% in 6 months.",
    type: "professional"
  },
  {
    name: "Lisa Martinez",
    role: "Commercial Property Owner",
    location: "Palo Alto",
    avatar: "L",
    color: "premium",
    rating: 5,
    text: "Managing multiple properties is challenging, but LevlPro makes finding reliable professionals effortless. Unmatched quality and speed.",
    type: "client"
  },
  {
    name: "Robert Kim",
    role: "Electrician",
    location: "San Mateo",
    avatar: "R",
    color: "warning",
    rating: 5,
    text: "Game changer for my electrical business. Consistent work, fair pricing, and a platform that actually works. Highly recommend!",
    type: "professional"
  },
];

export default function TestimonialsConveyor() {
  // Duplicate testimonials for infinite loop effect
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 py-16 md:py-20 px-6 relative overflow-hidden fade-in-section opacity-0">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="px-4 py-2 bg-white/10 border-2 border-white/20 text-white rounded-full text-sm font-semibold inline-block mb-4 backdrop-blur-sm">
            Customer Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3">
            Trusted by Thousands
          </h2>
          <p className="text-lg md:text-xl text-secondary-300">
            See what our community has to say
          </p>
        </div>

        {/* Infinite Scrolling Carousel */}
        <div className="relative">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-secondary-900 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-secondary-900 to-transparent z-10 pointer-events-none"></div>

          {/* Scrolling Container */}
          <div className="overflow-hidden">
            <div className="flex gap-6 animate-scroll-left hover:pause">
              {duplicatedTestimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[350px] md:w-[400px] bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
                >
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-warning-500 fill-warning-500"
                      />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="text-base text-secondary-700 mb-6 leading-relaxed line-clamp-4">
                    "{testimonial.text}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="flex items-center gap-4 border-t border-secondary-200 pt-4">
                    <div className={`bg-${testimonial.color}-200 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <span className={`text-${testimonial.color}-900 font-bold text-lg`}>
                        {testimonial.avatar}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-secondary-900 truncate">{testimonial.name}</p>
                      <p className="text-sm text-secondary-600 truncate">{testimonial.role}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 bg-${testimonial.color}-100 text-${testimonial.color}-800 rounded-full text-xs font-semibold`}>
                        {testimonial.type === "client" ? "Property Owner" : "Professional"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">500+</div>
            <div className="text-sm text-secondary-300">Active Professionals</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">10k+</div>
            <div className="text-sm text-secondary-300">Jobs Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">4.9★</div>
            <div className="text-sm text-secondary-300">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">98%</div>
            <div className="text-sm text-secondary-300">Satisfaction Rate</div>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }

        .animate-scroll-left:hover {
          animation-play-state: paused;
        }

        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}