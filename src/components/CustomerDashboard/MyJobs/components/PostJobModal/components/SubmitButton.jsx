//levlpro-mvp\src\components\CustomerDashboard\MyJobs\components\PostJobModal\components\SubmitButton.jsx
import { CheckCircle2 } from "lucide-react";

export default function SubmitButton({ loading, isEditing, isDirectBooking }) {
  return (
    <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-slate-200 -mx-6 px-6">
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-teal-700 hover:to-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-teal-500/30"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {isEditing
              ? "Updating Job..."
              : isDirectBooking
              ? "Sending Request..."
              : "Posting Job..."}
          </>
        ) : (
          <>
            <CheckCircle2 size={20} />
            {isEditing
              ? "Update Job"
              : isDirectBooking
              ? "Send Booking Request"
              : "Post Job"}
          </>
        )}
      </button>
    </div>
  );
}