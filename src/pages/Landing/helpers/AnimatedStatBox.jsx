// levlpro-mvp\src\pages\Landing\helpers\AnimatedStatBox.jsx
export default function AnimatedStatBox({ value, label, delay }) {
  return (
    <div
      className="opacity-0 animate-slideUp hover:scale-110 transition-transform duration-300 cursor-default"
      style={{ animationDelay: `${delay}s`, animationFillMode: "forwards" }}
    >
      <div className="text-5xl md:text-6xl font-extrabold mb-3">{value}</div>
      <div className="text-primary-200 text-sm md:text-base font-medium">
        {label}
      </div>
    </div>
  );
}