// src/pages/Register/components/BenefitItem.jsx

export default function BenefitItem({ icon, title, description }) {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-lg flex-shrink-0 shadow-sm">
        <div className="text-white">{icon}</div>
      </div>
      <div>
        <h3 className="text-white font-semibold mb-1">{title}</h3>
        <p className="text-slate-100 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}