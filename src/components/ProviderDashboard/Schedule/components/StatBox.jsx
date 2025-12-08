// src/components/ProviderDashboard/Schedule/components/StatBox.jsx
import { theme } from "../../../../styles/theme";

export default function StatBox({ label, value, color }) {
  const colorClasses = {
    blue: theme.statCard.blue,
    green: theme.statCard.green,
    slate: theme.statCard.slate,
    orange: theme.statCard.orange,
  };

  return (
    <div className={`${colorClasses[color]} border rounded-xl p-4 text-center`}>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-sm font-semibold opacity-80">{label}</p>
    </div>
  );
}