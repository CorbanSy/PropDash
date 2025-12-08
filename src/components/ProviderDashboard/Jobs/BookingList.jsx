//propdash-mvp\src\components\ProviderDashboard\BookingList.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase/client";
import { Calendar, Clock, User, Loader2, CircleCheck } from "lucide-react";
export default function BookingList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs for the logged-in provider
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

  // Status badge color mapping
  function StatusBadge({ status }) {
    const map = {
      confirmed: "bg-blue-100 text-blue-700 border-blue-200",
      completed: "bg-green-100 text-green-700 border-green-200",
      paid: "bg-purple-100 text-purple-700 border-purple-200",
    };

    return (
      <span className={`px-2 py-0.5 text-[10px] rounded font-bold border ${map[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 size={24} className="animate-spin text-slate-400" />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center text-slate-500 py-10">
        <Calendar className="mx-auto mb-2 text-slate-400" size={32} />
        <p>No bookings yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
        >
          <div className="flex justify-between items-center mb-1">
            <strong className="text-sm text-slate-800">{job.client_name}</strong>
            <StatusBadge status={job.status} />
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1 mb-1">
            <User size={14} /> {job.client_phone}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock size={14} />
            {job.time ? formatDateTime(job.time) : "Time not set"}
          </div>

          <div className="mt-3 flex justify-end text-green-600 font-bold text-sm">
            {job.price ? `$${job.price}` : ""}
          </div>
        </div>
      ))}
    </div>
  );
}

// Small helper that formats timestamps
function formatDateTime(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
