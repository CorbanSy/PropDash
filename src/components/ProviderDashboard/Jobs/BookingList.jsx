//levlpro-mvp\src\components\ProviderDashboard\Jobs\BookingList.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Calendar, Clock, User, Loader2 } from "lucide-react";

export default function BookingList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("provider_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) setJobs(data || []);
    setLoading(false);
  }

  function StatusBadge({ status }) {
    const map = {
      confirmed: "bg-primary-100 text-primary-800 border-primary-300",
      completed: "bg-success-100 text-success-800 border-success-300",
      paid: "bg-premium-100 text-premium-800 border-premium-300",
    };

    return (
      <span className={`px-2 py-0.5 text-[10px] rounded font-bold border-2 ${map[status] || map.confirmed}`}>
        {status.toUpperCase()}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 size={24} className="animate-spin text-secondary-400" />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center text-secondary-500 py-10">
        <Calendar className="mx-auto mb-2 text-secondary-400" size={32} />
        <p>No bookings yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="bg-white border-2 border-secondary-200 rounded-xl p-4 shadow-card hover:shadow-card-hover hover:border-secondary-300 transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-1">
            <strong className="text-sm text-secondary-900">{job.client_name}</strong>
            <StatusBadge status={job.status} />
          </div>

          <div className="text-xs text-secondary-500 flex items-center gap-1 mb-1">
            <User size={14} /> {job.client_phone}
          </div>

          <div className="flex items-center gap-2 text-xs text-secondary-500">
            <Clock size={14} />
            {job.time ? formatDateTime(job.time) : "Time not set"}
          </div>

          <div className="mt-3 flex justify-end text-success-600 font-bold text-sm">
            {job.price ? `$${job.price}` : ""}
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDateTime(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}