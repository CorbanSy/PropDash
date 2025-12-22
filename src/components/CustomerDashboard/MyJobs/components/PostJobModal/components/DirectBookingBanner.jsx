//levlpro-mvp\src\components\CustomerDashboard\MyJobs\components\PostJobModal\components\DirectBookingBanner.jsx
import { Info } from "lucide-react";

export default function DirectBookingBanner({ providerName }) {
  return (
    <div className="mx-6 mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
      <div className="flex gap-3">
        <Info size={20} className="text-blue-600 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">📬 Direct Booking Request</p>
          <p className="text-blue-700">
            This job will be sent directly to{" "}
            <strong>{providerName || "the selected provider"}</strong> for their
            review. They can accept or decline your request. You'll be notified
            of their response.
          </p>
        </div>
      </div>
    </div>
  );
}