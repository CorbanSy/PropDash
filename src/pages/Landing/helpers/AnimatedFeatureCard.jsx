// levlpro-mvp\src\pages\Landing\helpers\AnimatedFeatureCard.jsx
export default function AnimatedFeatureCard({
  icon,
  bgColor,
  iconColor,
  borderColor,
  hoverBorderColor,
  title,
  description,
  delay,
}) {
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