//levlpro-mvp\src\pages\Register\components\StatCard.jsx

export default function StatCard({ number, label }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-sm">
      <div className="text-2xl font-bold text-white mb-1">{number}</div>
      <div className="text-xs text-slate-100 font-medium">{label}</div>
    </div>
  );
}