//levlpro-mvp\src\components\ProviderDashboard\Schedule\components\BlockDaysModal.jsx
import { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { getDateString } from "../utils/timeUtils";

export default function BlockDaysModal({ currentMonth, dateOverrides, onClose, onBlock }) {
  const [selectedDates, setSelectedDates] = useState([]);
  const [reason, setReason] = useState("");
  const [mode, setMode] = useState("single");
  const [rangeStart, setRangeStart] = useState(null);

  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const days = generateCalendar();

  const isDateSelected = (date) => {
    if (!date) return false;
    return selectedDates.some((d) => d.toDateString() === date.toDateString());
  };

  const toggleDate = (date) => {
    if (!date || date < new Date().setHours(0, 0, 0, 0)) return;

    if (mode === "range") {
      if (!rangeStart) {
        setRangeStart(date);
        setSelectedDates([date]);
      } else {
        const start = rangeStart < date ? rangeStart : date;
        const end = rangeStart < date ? date : rangeStart;
        const range = [];
        const current = new Date(start);
        while (current <= end) {
          range.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
        setSelectedDates(range);
        setRangeStart(null);
      }
    } else {
      if (isDateSelected(date)) {
        setSelectedDates(selectedDates.filter((d) => d.toDateString() !== date.toDateString()));
      } else {
        setSelectedDates([...selectedDates, date]);
      }
    }
  };

  const handleBlock = () => {
    if (selectedDates.length === 0) return;
    onBlock(selectedDates, reason || "Unavailable");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b-2 border-secondary-200 p-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900">Block Multiple Days</h2>
            <p className="text-xs text-secondary-500">Select dates you want to block from your calendar</p>
          </div>
          <button onClick={onClose} className="text-secondary-400 hover:text-secondary-600 transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setMode("single");
                setRangeStart(null);
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
                mode === "single"
                  ? "bg-primary-100 text-primary-800 border-2 border-primary-300"
                  : "bg-secondary-100 text-secondary-600 hover:bg-secondary-200"
              }`}
            >
              Select Individual Days
            </button>
            <button
              onClick={() => {
                setMode("range");
                setSelectedDates([]);
                setRangeStart(null);
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
                mode === "range"
                  ? "bg-primary-100 text-primary-800 border-2 border-primary-300"
                  : "bg-secondary-100 text-secondary-600 hover:bg-secondary-200"
              }`}
            >
              Select Date Range
            </button>
          </div>

          {mode === "range" && rangeStart && (
            <div className="bg-primary-50 border-2 border-primary-300 text-primary-900 p-4 rounded-lg shadow-sm flex items-start gap-3">
              <AlertCircle className="flex-shrink-0 text-primary-700" size={20} />
              <p className="text-xs text-primary-700">
                Range starts: {rangeStart.toLocaleDateString()}. Click another date to complete
                the range.
              </p>
            </div>
          )}

          {/* Calendar */}
          <div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center font-semibold text-secondary-700 text-xs py-1"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((date, index) => {
                if (!date) return <div key={index} className="h-12"></div>;

                const isPast = date < new Date().setHours(0, 0, 0, 0);
                const isSelected = isDateSelected(date);

                return (
                  <button
                    key={index}
                    onClick={() => toggleDate(date)}
                    disabled={isPast}
                    className={`
                      h-12 rounded-lg text-sm font-semibold transition-all duration-200
                      ${isPast ? "bg-secondary-50 text-secondary-300 cursor-not-allowed" : ""}
                      ${!isPast && !isSelected ? "bg-secondary-100 hover:bg-secondary-200 text-secondary-700" : ""}
                      ${isSelected ? "bg-error-100 text-error-800 border-2 border-error-400" : "border-2 border-transparent"}
                    `}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Count */}
          {selectedDates.length > 0 && (
            <div className="bg-primary-50 border-2 border-primary-300 rounded-lg p-3">
              <p className="text-sm font-semibold text-primary-900">
                {selectedDates.length} {selectedDates.length === 1 ? "day" : "days"} selected
              </p>
            </div>
          )}

          {/* Reason Input */}
          <div>
            <label className="text-sm font-semibold text-secondary-700">Reason (Optional)</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Vacation, Holiday, Personal"
              className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all mt-2"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 border-2 border-secondary-400 text-secondary-700 px-5 py-3 rounded-lg font-semibold hover:bg-secondary-50 active:bg-secondary-100 transition-all inline-flex items-center justify-center">
              Cancel
            </button>
            <button
              onClick={handleBlock}
              disabled={selectedDates.length === 0}
              className={`flex-1 bg-primary-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-primary-700 active:bg-primary-800 transition-all shadow-sm hover:shadow-md inline-flex items-center justify-center ${
                selectedDates.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Block {selectedDates.length} {selectedDates.length === 1 ? "Day" : "Days"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}