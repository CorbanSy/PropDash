//levlpro-mvp\src\components\ProviderDashboard\Schedule\components\ConflictWarning.jsx
import { AlertTriangle } from "lucide-react";

export default function ConflictWarning({ conflicts }) {
  if (!conflicts || conflicts.length === 0) return null;

  return (
    <div className="bg-warning-50 border-2 border-warning-300 text-warning-900 p-4 rounded-lg shadow-sm flex items-start gap-3">
      <AlertTriangle className="flex-shrink-0 text-warning-700" size={20} />
      <div className="space-y-1">
        <p className="font-semibold text-sm">Scheduling Conflicts</p>
        {conflicts.map((conflict, index) => (
          <div key={index} className="text-xs text-warning-700">
            {conflict.type === "validation" && (
              <>
                <p className="font-medium">Block {conflict.blockIndex + 1}:</p>
                <ul className="list-disc pl-4">
                  {conflict.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </>
            )}
            {conflict.type === "overlap" && (
              <>
                <p className="font-medium">Overlapping time blocks:</p>
                <ul className="list-disc pl-4">
                  {conflict.conflicts.map((c, i) => (
                    <li key={i}>{c.message}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}