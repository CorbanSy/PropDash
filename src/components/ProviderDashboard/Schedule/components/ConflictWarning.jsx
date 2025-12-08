// src/components/ProviderDashboard/Schedule/components/ConflictWarning.jsx
import { AlertTriangle } from "lucide-react";
import { theme } from "../../../../styles/theme";

export default function ConflictWarning({ conflicts }) {
  if (!conflicts || conflicts.length === 0) return null;

  return (
    <div className={theme.alert.warning}>
      <AlertTriangle className="flex-shrink-0" size={20} />
      <div className="space-y-1">
        <p className="font-semibold text-sm">Scheduling Conflicts</p>
        {conflicts.map((conflict, index) => (
          <div key={index} className="text-xs">
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