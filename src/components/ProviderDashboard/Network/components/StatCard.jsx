//levlpro-mvp\src\components\ProviderDashboard\Network\components\StatCard.jsx
import { theme } from "../../../../styles/theme";

export default function StatCard({ icon, label, value, color, trend }) {
  const colorClasses = {
    emerald: "bg-emerald-50 border-emerald-200",
    blue: "bg-primary-50 border-primary-200",
    primary: "bg-primary-50 border-primary-200",
    amber: "bg-warning-50 border-warning-200",
    warning: "bg-warning-50 border-warning-200",
    purple: "bg-purple-50 border-purple-200",
    indigo: "bg-indigo-50 border-indigo-200",
    slate: "bg-slate-50 border-slate-200",
    success: "bg-success-50 border-success-200",
    error: "bg-error-50 border-error-200",
  };

  const iconColorClasses = {
    emerald: "text-emerald-600",
    blue: "text-primary-600",
    primary: "text-primary-600",
    amber: "text-warning-600",
    warning: "text-warning-600",
    purple: "text-purple-600",
    indigo: "text-indigo-600",
    slate: "text-secondary-600",
    success: "text-success-600",
    error: "text-error-600",
  };

  return (
    <div className={`${colorClasses[color]} border rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`bg-white p-2 rounded-lg shadow-sm ${iconColorClasses[color]}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-medium ${trend > 0 ? 'text-success-600' : 'text-error-600'}`}>
            {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className={`${theme.text.caption} font-medium text-secondary-600 mb-1`}>{label}</p>
      <p className="text-2xl font-bold text-secondary-900">{value}</p>
    </div>
  );
}