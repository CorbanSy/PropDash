export default function AnimatedFeatureCard({
  icon,
  bgColor,
  iconColor,
  borderColor,
  hoverBorderColor,
  title,
  description,
  delay,
  compact = false,
}) {
  if (compact) {
    // Super compact horizontal layout for side-by-side view
    return (
      <div
        className={`flex items-start gap-3 ${bgColor} rounded-lg border-2 ${borderColor} ${hoverBorderColor} p-3 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 opacity-0 animate-slideUp`}
        style={{ animationDelay: `${delay}s`, animationFillMode: "forwards" }}
      >
        <div
          className={`${bgColor === "bg-white" ? "bg-secondary-50" : bgColor} min-w-[40px] w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:rotate-6 flex-shrink-0`}
        >
          <div className={iconColor}>{icon}</div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm md:text-base font-bold text-secondary-900 mb-1 leading-tight">
            {title}
          </h3>
          <p className="text-xs md:text-sm text-secondary-600 leading-snug">
            {description}
          </p>
        </div>
      </div>
    );
  }

  // Original vertical layout for full-width grid
  return (
    <div
      className={`bg-white rounded-xl border-2 ${borderColor} ${hoverBorderColor} p-8 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 opacity-0 animate-slideUp`}
      style={{ animationDelay: `${delay}s`, animationFillMode: "forwards" }}
    >
      <div
        className={`${bgColor} w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-110 hover:rotate-6`}
      >
        <div className={iconColor}>{icon}</div>
      </div>
      <h3 className="text-xl font-bold text-secondary-900 mb-3">{title}</h3>
      <p className="text-secondary-600 leading-relaxed">{description}</p>
    </div>
  );
}