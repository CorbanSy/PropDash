// src/components/CustomerDashboard/MyJobs/components/PostJobModal/components/InfoBox.jsx
import { Info } from "lucide-react";

export default function InfoBox({ isDirectBooking, providerName }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <div className="flex gap-3">
        <Info size={20} className="text-blue-600 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">✨ What happens next?</p>
          <ul className="text-blue-700 space-y-1">
            {isDirectBooking ? (
              <>
                <li>• {providerName || "The provider"} will review your request</li>
                <li>• They can accept or decline within 24 hours</li>
                <li>• You'll receive a notification of their decision</li>
                <li>• If accepted, you can discuss details and schedule</li>
              </>
            ) : (
              <>
                <li>• Licensed professionals will review your job</li>
                <li>• You'll receive quotes within 24 hours</li>
                <li>• Compare quotes and choose the best fit</li>
                <li>• Message pros directly to discuss details</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}