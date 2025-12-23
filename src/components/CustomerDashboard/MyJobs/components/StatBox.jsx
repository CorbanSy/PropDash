//levlpro-mvp\src\components\CustomerDashboard\MyJobs\components\StatBox.jsx
export default function StatBox({ label, value, color }) {
  const colorClasses = {
    primary: "bg-primary-50 border-primary-200 text-primary-600",
    warning: "bg-warning-50 border-warning-200 text-warning-600",
    success: "bg-success-50 border-success-200 text-success-600",
    error: "bg-error-50 border-error-200 text-error-600",
  };

  return (
    <div
      className={`${colorClasses[color]} border-2 rounded-2xl p-4 text-center shadow-card hover:shadow-card-hover transition-all duration-300`}
    >
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-sm font-medium opacity-80">{label}</p>
    </div>
  );
}