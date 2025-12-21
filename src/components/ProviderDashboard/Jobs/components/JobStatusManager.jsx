//levlpro-mvp\src\components\ProviderDashboard\Jobs\components\JobStatusManager.jsx
import { useState } from "react";
import { CheckCircle2, Clock, AlertCircle, Play, Pause } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { supabase } from "../../../../lib/supabaseClient";
import { getStatusBadge, getAvailableStatuses } from "../utils/jobHelpers";

export default function JobStatusManager({ job, onRefresh }) {
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState("");

  const currentStatus = getStatusBadge(job.status);
  const availableStatuses = getAvailableStatuses(job.status);

  const handleStatusChange = async (newStatus) => {
    if (!confirm(`Change job status to ${newStatus}?`)) return;

    setUpdating(true);

    const updateData = {
      status: newStatus,
    };

    // Add timestamps for certain status changes
    if (newStatus === "in_progress" && !job.time_started) {
      updateData.time_started = new Date().toISOString();
    }

    if (newStatus === "completed" && !job.time_completed) {
      updateData.time_completed = new Date().toISOString();
      updateData.completed_at = new Date().toISOString();
    }

    if (newStatus === "paid") {
      updateData.paid = true;
      updateData.paid_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("jobs")
      .update(updateData)
      .eq("id", job.id);

    if (error) {
      alert("Error updating status");
      console.error(error);
    } else {
      // Log status change
      await supabase.from("job_status_history").insert({
        job_id: job.id,
        from_status: job.status,
        to_status: newStatus,
        notes: notes || null,
      });

      onRefresh();
    }

    setUpdating(false);
    setNotes("");
  };

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <div className={`${theme.card.base} ${theme.card.padding} bg-gradient-to-br from-slate-50 to-blue-50`}>
        <h3 className={`${theme.text.h4} mb-4`}>Current Status</h3>
        <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-lg font-bold text-lg border-2 ${currentStatus.color}`}>
          <span className="text-2xl">{currentStatus.icon}</span>
          <span>{currentStatus.label}</span>
        </div>

        {/* Status Info */}
        <div className="mt-4 space-y-2 text-sm">
          {job.time_started && (
            <p className="text-slate-600">
              Started: {new Date(job.time_started).toLocaleString()}
            </p>
          )}
          {job.time_completed && (
            <p className="text-slate-600">
              Completed: {new Date(job.time_completed).toLocaleString()}
            </p>
          )}
          {job.paid_at && (
            <p className="text-slate-600">
              Paid: {new Date(job.paid_at).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Available Status Changes */}
      {availableStatuses.length > 0 && (
        <div>
          <h3 className={`${theme.text.h4} mb-4`}>Change Status To:</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {availableStatuses.map((status) => {
              const badge = getStatusBadge(status);
              return (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={updating}
                  className={`p-4 rounded-lg border-2 hover:shadow-md transition text-left ${
                    updating ? "opacity-50 cursor-not-allowed" : ""
                  } ${badge.color}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <p className="font-semibold">{badge.label}</p>
                      <p className="text-xs opacity-75">
                        {status === "in_progress" && "Start working on this job"}
                        {status === "completed" && "Mark as finished"}
                        {status === "paid" && "Record payment received"}
                        {status === "cancelled" && "Cancel this job"}
                        {status === "scheduled" && "Reschedule this job"}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Optional Notes */}
          <div className="mt-4">
            <label className={theme.text.label}>Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`${theme.input.base} ${theme.input.provider} mt-2`}
              rows={2}
              placeholder="Add any notes about this status change..."
            />
          </div>
        </div>
      )}

      {availableStatuses.length === 0 && job.status === "paid" && (
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-6 text-center">
          <CheckCircle2 className="text-emerald-600 mx-auto mb-3" size={48} />
          <p className="font-semibold text-emerald-900 mb-1">Job Complete!</p>
          <p className="text-sm text-emerald-700">This job is finished and paid.</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-slate-50 rounded-lg p-4 border-2 border-slate-200">
        <h4 className="font-semibold text-slate-900 mb-3">Quick Actions</h4>
        <div className="flex flex-wrap gap-2">
          {job.status === "scheduled" && !job.time_started && (
            <button
              onClick={() => handleStatusChange("in_progress")}
              disabled={updating}
              className={`${theme.button.provider} flex items-center gap-2`}
            >
              <Play size={16} />
              Start Job Now
            </button>
          )}

          {job.status === "in_progress" && (
            <button
              onClick={() => handleStatusChange("completed")}
              disabled={updating}
              className={`${theme.button.provider} flex items-center gap-2 bg-green-600 hover:bg-green-700`}
            >
              <CheckCircle2 size={16} />
              Mark Complete
            </button>
          )}

          {job.status === "completed" && !job.paid && (
            <button
              onClick={() => handleStatusChange("paid")}
              disabled={updating}
              className={`${theme.button.provider} flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700`}
            >
              <CheckCircle2 size={16} />
              Mark as Paid
            </button>
          )}
        </div>
      </div>
    </div>
  );
}