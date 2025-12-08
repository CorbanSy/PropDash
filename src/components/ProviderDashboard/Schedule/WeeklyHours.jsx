// src/components/ProviderDashboard/Schedule/WeeklyHours.jsx
import { useState } from "react";
import { AlertCircle, Plus, Trash2 } from "lucide-react";
import { theme } from "../../../styles/theme";
import { checkTimeBlockOverlap, validateTimeBlock } from "./utils/conflictDetection";
import ConflictWarning from "./components/ConflictWarning";

export default function WeeklyHours({ userId }) {
  const [availability, setAvailability] = useState([
    {
      day: "Monday",
      enabled: true,
      blocks: [{ start: "09:00", end: "17:00" }],
    },
    {
      day: "Tuesday",
      enabled: true,
      blocks: [{ start: "09:00", end: "17:00" }],
    },
    {
      day: "Wednesday",
      enabled: true,
      blocks: [{ start: "09:00", end: "17:00" }],
    },
    {
      day: "Thursday",
      enabled: true,
      blocks: [{ start: "09:00", end: "17:00" }],
    },
    {
      day: "Friday",
      enabled: true,
      blocks: [{ start: "09:00", end: "17:00" }],
    },
    {
      day: "Saturday",
      enabled: false,
      blocks: [{ start: "10:00", end: "15:00" }],
    },
    {
      day: "Sunday",
      enabled: false,
      blocks: [{ start: "10:00", end: "15:00" }],
    },
  ]);
  const [saving, setSaving] = useState(false);
  const [conflicts, setConflicts] = useState({});

  const toggleDay = (index) => {
    const updated = [...availability];
    updated[index].enabled = !updated[index].enabled;
    setAvailability(updated);
    validateDay(index, updated);
  };

  const updateTimeBlock = (dayIndex, blockIndex, field, value) => {
    const updated = [...availability];
    updated[dayIndex].blocks[blockIndex][field] = value;
    setAvailability(updated);
    validateDay(dayIndex, updated);
  };

  const addTimeBlock = (dayIndex) => {
    const updated = [...availability];
    const lastBlock = updated[dayIndex].blocks[updated[dayIndex].blocks.length - 1];
    
    // Default new block starts 2 hours after last block ends
    const [hours] = lastBlock.end.split(":").map(Number);
    const newStart = `${String(Math.min(hours + 2, 22)).padStart(2, "0")}:00`;
    const newEnd = `${String(Math.min(hours + 4, 23)).padStart(2, "0")}:00`;
    
    updated[dayIndex].blocks.push({ start: newStart, end: newEnd });
    setAvailability(updated);
    validateDay(dayIndex, updated);
  };

  const removeTimeBlock = (dayIndex, blockIndex) => {
    const updated = [...availability];
    updated[dayIndex].blocks = updated[dayIndex].blocks.filter((_, i) => i !== blockIndex);
    
    // If no blocks left, add a default one
    if (updated[dayIndex].blocks.length === 0) {
      updated[dayIndex].blocks.push({ start: "09:00", end: "17:00" });
    }
    
    setAvailability(updated);
    validateDay(dayIndex, updated);
  };

  const validateDay = (dayIndex, availabilityData = availability) => {
    const day = availabilityData[dayIndex];
    if (!day.enabled) {
      setConflicts((prev) => ({ ...prev, [dayIndex]: null }));
      return;
    }

    const dayConflicts = [];

    // Check each block for validation errors
    day.blocks.forEach((block, blockIndex) => {
      const errors = validateTimeBlock(block.start, block.end);
      if (errors.length > 0) {
        dayConflicts.push({
          type: "validation",
          blockIndex,
          errors,
        });
      }
    });

    // Check for overlapping blocks
    const overlaps = checkTimeBlockOverlap(day.blocks);
    if (overlaps.length > 0) {
      dayConflicts.push({
        type: "overlap",
        conflicts: overlaps,
      });
    }

    setConflicts((prev) => ({
      ...prev,
      [dayIndex]: dayConflicts.length > 0 ? dayConflicts : null,
    }));
  };

  const hasAnyConflicts = () => {
    return Object.values(conflicts).some((c) => c !== null);
  };

  const handleSave = async () => {
    if (hasAnyConflicts()) {
      alert("Please resolve all conflicts before saving");
      return;
    }

    setSaving(true);
    // TODO: Save to database
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="space-y-6">
      <div className={theme.alert.info}>
        <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
        <div>
          <p className="font-semibold text-sm mb-1">Set Your Regular Hours</p>
          <p className="text-xs">
            These hours repeat every week. You can add multiple time blocks per day for
            split shifts or breaks.
          </p>
        </div>
      </div>

      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <h3 className={`${theme.text.h3} mb-6`}>Weekly Schedule</h3>
        <div className="space-y-6">
          {availability.map((day, dayIndex) => (
            <div key={day.day} className="space-y-3">
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={day.enabled}
                    onChange={() => toggleDay(dayIndex)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span
                    className={`font-semibold ${
                      day.enabled ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    {day.day}
                  </span>
                </label>

                {day.enabled && (
                  <button
                    onClick={() => addTimeBlock(dayIndex)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    <Plus size={16} />
                    Add Time Block
                  </button>
                )}
              </div>

              {/* Time Blocks */}
              {day.enabled ? (
                <div className="space-y-2 pl-6">
                  {day.blocks.map((block, blockIndex) => (
                    <div key={blockIndex} className="flex items-center gap-3">
                      <input
                        type="time"
                        value={block.start}
                        onChange={(e) =>
                          updateTimeBlock(dayIndex, blockIndex, "start", e.target.value)
                        }
                        className={`${theme.input.base} ${theme.input.provider}`}
                      />
                      <span className={theme.text.body}>to</span>
                      <input
                        type="time"
                        value={block.end}
                        onChange={(e) =>
                          updateTimeBlock(dayIndex, blockIndex, "end", e.target.value)
                        }
                        className={`${theme.input.base} ${theme.input.provider}`}
                      />
                      {day.blocks.length > 1 && (
                        <button
                          onClick={() => removeTimeBlock(dayIndex, blockIndex)}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="pl-6">
                  <span className="text-slate-400 text-sm">Unavailable</span>
                </div>
              )}

              {/* Conflicts for this day */}
              {conflicts[dayIndex] && (
                <div className="pl-6">
                  <ConflictWarning conflicts={conflicts[dayIndex]} />
                </div>
              )}

              {/* Divider */}
              {dayIndex < availability.length - 1 && (
                <div className="border-b border-slate-200 pt-3"></div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={saving || hasAnyConflicts()}
          className={`w-full mt-6 ${theme.button.provider} justify-center ${
            (saving || hasAnyConflicts()) ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {saving ? "Saving..." : "Save Weekly Schedule"}
        </button>
      </div>
    </div>
  );
}