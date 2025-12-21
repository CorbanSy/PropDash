//levlpro-mvp\src\components\ProviderDashboard\Jobs\components\JobTimeline.jsx
import { Calendar, Clock, CheckCircle2, DollarSign, FileText } from "lucide-react";
import { theme } from "../../../../styles/theme";

export default function JobTimeline({ job }) {
  const events = [];

  // Created
  if (job.created_at) {
    events.push({
      icon: FileText,
      color: "blue",
      title: "Job Created",
      time: job.created_at,
      description: "Job was created in the system",
    });
  }

  // Scheduled
  if (job.scheduled_date) {
    events.push({
      icon: Calendar,
      color: "purple",
      title: "Scheduled",
      time: job.scheduled_date,
      description: `Scheduled for ${new Date(job.scheduled_date).toLocaleDateString()}${
        job.scheduled_time ? ` at ${job.scheduled_time}` : ""
      }`,
    });
  }

  // Started
  if (job.time_started) {
    events.push({
      icon: Clock,
      color: "amber",
      title: "Work Started",
      time: job.time_started,
      description: "Provider began working on this job",
    });
  }

  // Completed
  if (job.time_completed) {
    events.push({
      icon: CheckCircle2,
      color: "green",
      title: "Work Completed",
      time: job.time_completed,
      description: "Job was marked as complete",
    });
  }

  // Paid
  if (job.paid && job.paid_at) {
    events.push({
      icon: DollarSign,
      color: "emerald",
      title: "Payment Received",
      time: job.paid_at,
      description: `Paid via ${job.payment_method || "cash"}`,
    });
  }

  // Sort by time
  events.sort((a, b) => new Date(a.time) - new Date(b.time));

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-700 border-blue-200",
      purple: "bg-purple-100 text-purple-700 border-purple-200",
      amber: "bg-amber-100 text-amber-700 border-amber-200",
      green: "bg-green-100 text-green-700 border-green-200",
      emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      <h3 className={theme.text.h3}>Job Timeline</h3>

      {events.length === 0 ? (
        <div className={`${theme.card.base} ${theme.card.padding} text-center py-8`}>
          <Clock className="text-slate-400 mx-auto mb-3" size={32} />
          <p className="text-slate-600">No timeline events yet</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200"></div>

          {/* Events */}
          <div className="space-y-6">
            {events.map((event, i) => (
              <div key={i} className="relative flex gap-4">
                {/* Icon */}
                <div className={`relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center ${getColorClasses(event.color)}`}>
                  <event.icon size={20} />
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <h4 className="font-semibold text-slate-900 mb-1">{event.title}</h4>
                  <p className="text-sm text-slate-600 mb-2">{event.description}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(event.time).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Job Duration */}
      {job.time_started && job.time_completed && (
        <div className={`${theme.card.base} ${theme.card.padding} bg-slate-50`}>
          <h4 className="font-semibold text-slate-900 mb-2">Job Duration</h4>
          <p className="text-2xl font-bold text-blue-700">
            {calculateDuration(job.time_started, job.time_completed)}
          </p>
        </div>
      )}
    </div>
  );
}

function calculateDuration(start, end) {
  const startTime = new Date(start);
  const endTime = new Date(end);
  const diffMs = endTime - startTime;
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
}