//levlpro-mvp\src\components\ProviderDashboard\Schedule\WeeklyHours.jsx
import { useState, useEffect } from "react";
import { AlertCircle, Plus, Trash2 } from "lucide-react";
import { theme } from "../../../styles/theme";
import { supabase } from "../../../lib/supabaseClient";
import { checkTimeBlockOverlap, validateTimeBlock } from "./utils/conflictDetection";
import ConflictWarning from "./components/ConflictWarning";

const DEFAULT_AVAILABILITY = [
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
];

export default function WeeklyHours({ userId }) {
  const [availability, setAvailability] = useState(DEFAULT_AVAILABILITY);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [conflicts, setConflicts] = useState({});

  useEffect(() => {
    async function loadWeeklyHours() {
      setLoading(true);

      const { data, error } = await supabase
        .from("provider_weekly_hours")
        .select("*")
        .eq("provider_id", userId)
        .maybeSingle();

      if (data && data.availability) {
        setAvailability(data.availability);
      } else {
        setAvailability(DEFAULT_AVAILABILITY);
      }

      setLoading(false);
    }

    if (userId) {
      loadWeeklyHours();
    }
  }, [userId]);

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

    try {
      const { error } = await supabase
        .from("provider_weekly_hours")
        .upsert(
          {
            provider_id: userId,
            availability: availability,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "provider_id",
          }
        );

      if (error) throw error;

      alert("Weekly schedule saved successfully!");
    } catch (error) {
      console.error("Error saving weekly hours:", error);
      alert("Failed to save weekly schedule");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-secondary-700">Loading weekly schedule...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-primary-50 border-2 border-primary-300 text-primary-900 p-4 rounded-lg shadow-sm flex items-start gap-3">
        <AlertCircle className="flex-shrink-0 mt-0.5 text-primary-700" size={20} />
        <div>
          <p className="font-semibold text-sm mb-1">Set Your Regular Hours</p>
          <p className="text-xs text-primary-700">
            These hours repeat every week. You can add multiple time blocks per day for
            split shifts or breaks.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-secondary-200 shadow-card p-6">
        <h3 className="text-xl font-semibold text-secondary-900 mb-6">Weekly Schedule</h3>
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
                    className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                  />
                  <span
                    className={`font-semibold ${
                      day.enabled ? "text-secondary-900" : "text-secondary-400"
                    }`}
                  >
                    {day.day}
                  </span>
                </label>

                {day.enabled && (
                  <button
                    onClick={() => addTimeBlock(dayIndex)}
                    className="text-sm text-primary-700 hover:text-primary-800 font-semibold flex items-center gap-1 hover:underline transition"
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
                        className="border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all"
                      />
                      <span className="text-secondary-700 leading-relaxed">to</span>
                      <input
                        type="time"
                        value={block.end}
                        onChange={(e) =>
                          updateTimeBlock(dayIndex, blockIndex, "end", e.target.value)
                        }
                        className="border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all"
                      />
                      {day.blocks.length > 1 && (
                        <button
                          onClick={() => removeTimeBlock(dayIndex, blockIndex)}
                          className="text-error-600 hover:text-error-700 p-2 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="pl-6">
                  <span className="text-secondary-400 text-sm">Unavailable</span>
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
                <div className="border-b border-secondary-200 pt-3"></div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={saving || hasAnyConflicts()}
          className={`w-full mt-6 bg-primary-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-primary-700 active:bg-primary-800 transition-all shadow-sm hover:shadow-md inline-flex items-center justify-center gap-2 ${
            (saving || hasAnyConflicts()) ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {saving ? "Saving..." : "Save Weekly Schedule"}
        </button>
      </div>
    </div>
  );
}