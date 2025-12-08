// src/components/ProviderDashboard/Schedule/components/DateModal.jsx
import { useState } from "react";
import { X, Ban, Clock, CheckCircle2, Plus, Trash2, AlertTriangle } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { validateTimeBlock, checkTimeBlockOverlap } from "../utils/conflictDetection";

export default function DateModal({
  date,
  dateInfo,
  weeklySchedule,
  onClose,
  onBlock,
  onUnblock,
  onCustomHours,
}) {
  const [view, setView] = useState("overview");
  const [blockReason, setBlockReason] = useState("");
  const [customBlocks, setCustomBlocks] = useState(
    dateInfo.schedule?.blocks || [{ start: "09:00", end: "17:00" }]
  );
  const [errors, setErrors] = useState([]);

  const dayOfWeek = date.getDay();
  const daySchedule = weeklySchedule.find((d) => d.day === dayOfWeek);

  const formatDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const addTimeBlock = () => {
    const lastBlock = customBlocks[customBlocks.length - 1];
    const [hours] = lastBlock.end.split(":").map(Number);
    const newStart = `${String(Math.min(hours + 1, 22)).padStart(2, "0")}:00`;
    const newEnd = `${String(Math.min(hours + 3, 23)).padStart(2, "0")}:00`;

    setCustomBlocks([...customBlocks, { start: newStart, end: newEnd }]);
  };

  const removeTimeBlock = (index) => {
    if (customBlocks.length === 1) return;
    setCustomBlocks(customBlocks.filter((_, i) => i !== index));
  };

  const updateTimeBlock = (index, field, value) => {
    const updated = [...customBlocks];
    updated[index][field] = value;
    setCustomBlocks(updated);
    validateBlocks(updated);
  };

  const validateBlocks = (blocks) => {
    const newErrors = [];

    // Validate each block
    blocks.forEach((block, index) => {
      const blockErrors = validateTimeBlock(block.start, block.end);
      if (blockErrors.length > 0) {
        newErrors.push({
          type: "validation",
          blockIndex: index,
          errors: blockErrors,
        });
      }
    });

    // Check for overlaps
    const overlaps = checkTimeBlockOverlap(blocks);
    if (overlaps.length > 0) {
      newErrors.push({
        type: "overlap",
        conflicts: overlaps,
      });
    }

    setErrors(newErrors);
  };

  const handleSaveCustomHours = () => {
    if (errors.length > 0) {
      alert("Please fix all errors before saving");
      return;
    }
    onCustomHours(customBlocks);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between">
          <div>
            <h2 className={theme.text.h2}>{formatDate}</h2>
            <p className={theme.text.caption}>
              {dateInfo.type === "blocked"
                ? "Blocked"
                : dateInfo.type === "custom"
                ? "Custom Hours"
                : dateInfo.type === "booked"
                ? `${dateInfo.jobs.length} booking(s)`
                : dateInfo.type === "available"
                ? "Available"
                : "Unavailable"}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {view === "overview" && (
            <>
              <div>
                <h3 className={`${theme.text.h4} mb-3`}>Current Status</h3>
                {dateInfo.type === "blocked" && (
                  <div className={theme.alert.error}>
                    <Ban className="flex-shrink-0" size={20} />
                    <div>
                      <p className="font-semibold text-sm">Date Blocked</p>
                      <p className="text-xs mt-1">{dateInfo.schedule.reason}</p>
                    </div>
                  </div>
                )}
                {dateInfo.type === "custom" && (
                  <div className={theme.alert.warning}>
                    <Clock className="flex-shrink-0" size={20} />
                    <div>
                      <p className="font-semibold text-sm">Custom Hours</p>
                      <div className="text-xs mt-1 space-y-1">
                        {dateInfo.schedule.blocks?.map((block, i) => (
                          <p key={i}>
                            Block {i + 1}: {block.start} - {block.end}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {dateInfo.type === "available" && (
                  <div className={theme.alert.info}>
                    <CheckCircle2 className="flex-shrink-0" size={20} />
                    <div>
                      <p className="font-semibold text-sm">Available</p>
                      <div className="text-xs mt-1 space-y-1">
                        {daySchedule?.blocks?.map((block, i) => (
                          <p key={i}>
                            {block.start} - {block.end}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {dateInfo.type === "unavailable" && (
                  <div className="bg-slate-100 rounded-lg p-4">
                    <p className={theme.text.body}>This day is not in your weekly schedule</p>
                  </div>
                )}
              </div>

              {dateInfo.jobs?.length > 0 && (
                <div>
                  <h3 className={`${theme.text.h4} mb-3`}>Bookings on This Day</h3>
                  <div className="space-y-2">
                    {dateInfo.jobs.map((job) => (
                      <div key={job.id} className="bg-slate-50 rounded-lg p-3">
                        <p className="font-semibold text-slate-900">{job.service_name}</p>
                        <p className={`${theme.text.caption} mt-1`}>
                          {job.client_name} •{" "}
                          {new Date(job.scheduled_date).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {dateInfo.type === "blocked" || dateInfo.type === "custom" ? (
                  <button
                    onClick={onUnblock}
                    className={`w-full ${theme.button.secondary} justify-center`}
                  >
                    <CheckCircle2 size={18} />
                    Remove Override (Use Weekly Schedule)
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setView("block")}
                      className={`w-full ${theme.button.danger} justify-center`}
                    >
                      <Ban size={18} />
                      Block This Date
                    </button>
                    <button
                      onClick={() => setView("custom")}
                      className={`w-full ${theme.button.secondary} justify-center`}
                    >
                      <Clock size={18} />
                      Set Custom Hours
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          {view === "block" && (
            <>
              <div>
                <label className={theme.text.label}>Reason for Blocking (Optional)</label>
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="e.g., Vacation, Holiday, Personal"
                  className={`${theme.input.base} ${theme.input.provider} mt-2`}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setView("overview")}
                  className={`flex-1 ${theme.button.secondary} justify-center`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => onBlock(blockReason || "Unavailable")}
                  className={`flex-1 ${theme.button.danger} justify-center`}
                >
                  Block Date
                </button>
              </div>
            </>
          )}

          {view === "custom" && (
            <>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className={theme.text.label}>Custom Time Blocks</label>
                  <button
                    onClick={addTimeBlock}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    <Plus size={16} />
                    Add Block
                  </button>
                </div>

                <div className="space-y-3">
                  {customBlocks.map((block, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="time"
                          value={block.start}
                          onChange={(e) => updateTimeBlock(index, "start", e.target.value)}
                          className={`${theme.input.base} ${theme.input.provider}`}
                        />
                        <span className="text-slate-600">to</span>
                        <input
                          type="time"
                          value={block.end}
                          onChange={(e) => updateTimeBlock(index, "end", e.target.value)}
                          className={`${theme.input.base} ${theme.input.provider}`}
                        />
                      </div>
                      {customBlocks.length > 1 && (
                        <button
                          onClick={() => removeTimeBlock(index)}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {errors.length > 0 && (
                  <div className={`${theme.alert.error} mt-4`}>
                    <AlertTriangle className="flex-shrink-0" size={20} />
                    <div className="space-y-1">
                      <p className="font-semibold text-sm">Errors Found</p>
                      {errors.map((error, index) => (
                        <div key={index} className="text-xs">
                          {error.type === "validation" && (
                            <>
                              <p className="font-medium">Block {error.blockIndex + 1}:</p>
                              <ul className="list-disc pl-4">
                                {error.errors.map((err, i) => (
                                  <li key={i}>{err}</li>
                                ))}
                              </ul>
                            </>
                          )}
                          {error.type === "overlap" && (
                            <>
                              <p className="font-medium">Overlapping blocks detected</p>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setView("overview")}
                  className={`flex-1 ${theme.button.secondary} justify-center`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCustomHours}
                  disabled={errors.length > 0}
                  className={`flex-1 ${theme.button.provider} justify-center ${
                    errors.length > 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Save Custom Hours
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}