//levlpro-mvp\src\components\ProviderDashboard\Schedule\components\StatBox.jsx
export default function StatBox({ label, value, color }) {
  const colorClasses = {
    primary: "bg-primary-100 border-primary-300 text-primary-900",
    success: "bg-success-100 border-success-300 text-success-900",
    secondary: "bg-secondary-100 border-secondary-300 text-secondary-900",
    warning: "bg-warning-100 border-warning-300 text-warning-900",
    blue: "bg-primary-100 border-primary-300 text-primary-900", // Alias for primary
    green: "bg-success-100 border-success-300 text-success-900", // Alias for success
    slate: "bg-secondary-100 border-secondary-300 text-secondary-900", // Alias for secondary
    orange: "bg-warning-100 border-warning-300 text-warning-900", // Alias for warning
  };

  return (
    <div className={`${colorClasses[color]} border-2 rounded-xl p-4 text-center shadow-sm`}>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-sm font-semibold opacity-80">{label}</p>
    </div>
  );
}