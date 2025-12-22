//levlpro-mvp\src\components\ProviderDashboard\Clients\components\ClientJobHistory.jsx
import { Calendar, DollarSign, CheckCircle2, Clock, XCircle } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { formatCurrency } from "../utils/clientCalculations";

export default function ClientJobHistory({ client, jobs, onRefresh }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return {
          badge: theme.badge.success,
          icon: <CheckCircle2 size={14} />,
          text: "Completed",
        };
      case "scheduled":
        return {
          badge: theme.badge.info,
          icon: <Clock size={14} />,
          text: "Scheduled",
        };
      case "cancelled":
        return {
          badge: theme.badge.error,
          icon: <XCircle size={14} />,
          text: "Cancelled",
        };
      default:
        return {
          badge: theme.badge.neutral,
          icon: <Clock size={14} />,
          text: status,
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={theme.text.h3}>Job History ({jobs.length})</h3>
      </div>

      {jobs.length === 0 ? (
        <div className={`${theme.card.base} ${theme.card.padding} text-center py-12`}>
          <Calendar className="text-slate-400 mx-auto mb-3" size={32} />
          <p className="text-slate-600">No jobs yet</p>
          <p className="text-sm text-slate-500 mt-1">
            Job history will appear here once completed
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            const status = getStatusBadge(job.status);
            return (
              <div key={job.id} className={`${theme.card.base} ${theme.card.padding}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-slate-900">
                        {job.service_name || "Service"}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold border flex items-center gap-1 ${status.badge}`}>
                        {status.icon}
                        {status.text}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-slate-600">
                      <p className="flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(job.scheduled_date || job.created_at).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      {job.description && (
                        <p className="text-sm text-slate-600">{job.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-900">
                      {formatCurrency(job.total || 0)}
                    </p>
                  </div>
                </div>

                {job.notes && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="text-xs text-slate-600 font-semibold mb-1">Notes:</p>
                    <p className="text-sm text-slate-700">{job.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}