import { Calendar, Clock, MapPin } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { formatCurrency } from "../utils/clientCalculations";

export default function UpcomingAppointments({ client, jobs }) {
  const upcomingJobs = jobs
    .filter(j => {
      const jobDate = new Date(j.scheduled_date);
      return jobDate >= new Date() && j.status !== "cancelled" && j.status !== "completed";
    })
    .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date));

  return (
    <div className={`${theme.card.base} ${theme.card.padding}`}>
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="text-primary-600" size={20} />
        <h4 className={theme.text.h4}>Upcoming Appointments</h4>
      </div>

      {upcomingJobs.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="text-secondary-400 mx-auto mb-3" size={32} />
          <p className={theme.text.body}>No upcoming appointments</p>
          <p className={`${theme.text.caption} mt-1`}>
            Schedule a new job to see it here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingJobs.map((job) => (
            <div
              key={job.id}
              className="p-4 bg-primary-50 border-2 border-primary-200 rounded-lg"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h5 className={`${theme.text.h5} mb-2`}>
                    {job.service_name || "Service"}
                  </h5>
                  <div className={`space-y-1 ${theme.text.caption}`}>
                    <p className="flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(job.scheduled_date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    {job.scheduled_time && (
                      <p className="flex items-center gap-2">
                        <Clock size={14} />
                        {job.scheduled_time}
                      </p>
                    )}
                    {job.address && (
                      <p className="flex items-center gap-2">
                        <MapPin size={14} />
                        {job.address}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary-900">
                    {formatCurrency(job.total || 0)}
                  </p>
                </div>
              </div>

              {job.notes && (
                <div className="pt-3 border-t border-primary-200">
                  <p className="text-xs text-primary-700 font-semibold mb-1">Notes:</p>
                  <p className={`${theme.text.caption} text-secondary-700`}>{job.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}