//levlpro-mvp\src\components\CustomerDashboard\MyJobs\components\StatBox.jsx
export default function StatBox({ label, value, color }) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    orange: "bg-orange-50 border-orange-200 text-orange-600",
    green: "bg-green-50 border-green-200 text-green-600",
    red: "bg-red-50 border-red-200 text-red-600",
  };

  return (
    <div
      className={`${colorClasses[color]} border rounded-xl p-4 text-center`}
    >
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-sm font-medium opacity-80">{label}</p>
    </div>
  );
}