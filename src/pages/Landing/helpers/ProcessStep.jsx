// src/pages/Landing/helpers/ProcessStep.jsx
export default function ProcessStep({ number, title, description }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="w-10 h-10 rounded-lg bg-secondary-900 text-white flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
        {number}
      </div>
      <div>
        <p className="font-bold text-secondary-900 mb-1">{title}</p>
        <p className="text-sm text-secondary-600">{description}</p>
      </div>
    </div>
  );
}