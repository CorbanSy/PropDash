// src/components/ProviderDashboard/Schedule/Holidays.jsx
import { useState, useEffect } from "react";
import { AlertCircle, Calendar, Check, X } from "lucide-react";
import { theme } from "../../../styles/theme";
import { supabase } from "../../../lib/supabaseClient";
import { getAllHolidays, getUSHolidays, getPopularHolidays } from "./utils/holidayData";

export default function Holidays({ userId }) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [holidays, setHolidays] = useState([]);
  const [selectedHolidays, setSelectedHolidays] = useState(new Set());
  const [customHours, setCustomHours] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const allHolidays = getAllHolidays(selectedYear);
    
    const uniqueHolidays = allHolidays.filter((holiday, index, self) =>
      index === self.findIndex((h) => h.date === holiday.date)
    );
    
    setHolidays(uniqueHolidays);
  }, [selectedYear]);

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("provider_holiday_settings")
        .select("*")
        .eq("provider_id", userId)
        .eq("year", selectedYear)
        .maybeSingle();

      if (data) {
        setSelectedHolidays(new Set(data.blocked_holidays || []));
        setCustomHours(data.custom_hours || {});
      } else {
        setSelectedHolidays(new Set());
        setCustomHours({});
      }
      
      setLoading(false);
    }

    if (userId) {
      loadSettings();
    }
  }, [userId, selectedYear]);

  const toggleHoliday = (date) => {
    const newSelected = new Set(selectedHolidays);
    if (newSelected.has(date)) {
      newSelected.delete(date);
      const newCustom = { ...customHours };
      delete newCustom[date];
      setCustomHours(newCustom);
    } else {
      newSelected.add(date);
    }
    setSelectedHolidays(newSelected);
  };

  const setCustomHoursForHoliday = (date, start, end) => {
    setCustomHours({
      ...customHours,
      [date]: { start, end },
    });
  };

  const clearCustomHours = (date) => {
    const newCustom = { ...customHours };
    delete newCustom[date];
    setCustomHours(newCustom);
  };

  const selectAllFederal = () => {
    const federal = holidays.filter((h) => h.type === "federal");
    const newSelected = new Set(selectedHolidays);
    federal.forEach((h) => newSelected.add(h.date));
    setSelectedHolidays(newSelected);
  };

  const deselectAll = () => {
    setSelectedHolidays(new Set());
    setCustomHours({});
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from("provider_holiday_settings")
        .upsert(
          {
            provider_id: userId,
            year: selectedYear,
            blocked_holidays: Array.from(selectedHolidays),
            custom_hours: customHours,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "provider_id,year",
          }
        );

      if (error) throw error;
      
      alert("Holiday settings saved successfully!");
    } catch (error) {
      console.error("Error saving holiday settings:", error);
      alert("Failed to save holiday settings");
    } finally {
      setSaving(false);
    }
  };

  const filteredHolidays = holidays.filter((h) => {
    if (filter === "all") return true;
    return h.type === filter;
  });

  const federalCount = holidays.filter((h) => h.type === "federal").length;
  const popularCount = holidays.filter((h) => h.type === "popular").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-secondary-700">Loading holiday settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-primary-50 border-2 border-primary-300 text-primary-900 p-4 rounded-lg shadow-sm flex items-start gap-3">
        <AlertCircle className="flex-shrink-0 mt-0.5 text-primary-700" size={20} />
        <div>
          <p className="font-semibold text-sm mb-1">Manage Holiday Availability</p>
          <p className="text-xs text-primary-700">
            Select holidays you want to block or set custom hours. These will override your
            weekly schedule.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-primary-100 border-2 border-primary-300 text-primary-900 rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold mb-1">{selectedHolidays.size}</p>
          <p className="text-xs font-semibold opacity-80">Blocked</p>
        </div>
        <div className="bg-warning-100 border-2 border-warning-300 text-warning-900 rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold mb-1">{Object.keys(customHours).length}</p>
          <p className="text-xs font-semibold opacity-80">Custom Hours</p>
        </div>
        <div className="bg-success-100 border-2 border-success-300 text-success-900 rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold mb-1">
            {holidays.length - selectedHolidays.size}
          </p>
          <p className="text-xs font-semibold opacity-80">Available</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-secondary-200 shadow-card p-6">
        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all"
            >
              <option value={currentYear - 1}>{currentYear - 1}</option>
              <option value={currentYear}>{currentYear}</option>
              <option value={currentYear + 1}>{currentYear + 1}</option>
            </select>

            <div className="flex gap-2 border-l border-secondary-200 pl-4">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 text-sm rounded-lg font-semibold transition-all duration-200 ${
                  filter === "all"
                    ? "bg-primary-100 text-primary-800"
                    : "text-secondary-600 hover:bg-secondary-100"
                }`}
              >
                All ({holidays.length})
              </button>
              <button
                onClick={() => setFilter("federal")}
                className={`px-3 py-1.5 text-sm rounded-lg font-semibold transition-all duration-200 ${
                  filter === "federal"
                    ? "bg-primary-100 text-primary-800"
                    : "text-secondary-600 hover:bg-secondary-100"
                }`}
              >
                Federal ({federalCount})
              </button>
              <button
                onClick={() => setFilter("popular")}
                className={`px-3 py-1.5 text-sm rounded-lg font-semibold transition-all duration-200 ${
                  filter === "popular"
                    ? "bg-primary-100 text-primary-800"
                    : "text-secondary-600 hover:bg-secondary-100"
                }`}
              >
                Popular ({popularCount})
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={selectAllFederal}
              className="border-2 border-secondary-400 text-secondary-700 px-4 py-2 rounded-lg font-semibold hover:bg-secondary-50 active:bg-secondary-100 transition-all inline-flex items-center gap-2 text-sm"
            >
              Block All Federal
            </button>
            <button 
              onClick={deselectAll} 
              className="border-2 border-secondary-400 text-secondary-700 px-4 py-2 rounded-lg font-semibold hover:bg-secondary-50 active:bg-secondary-100 transition-all inline-flex items-center gap-2 text-sm"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Holiday List */}
        <div className="space-y-2">
          {filteredHolidays.map((holiday) => {
            const isSelected = selectedHolidays.has(holiday.date);
            const hasCustomHours = customHours[holiday.date];
            const holidayDate = new Date(holiday.date);
            const dayName = holidayDate.toLocaleDateString("en-US", { weekday: "short" });
            const dateStr = holidayDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });

            return (
              <HolidayRow
                key={holiday.date}
                holiday={holiday}
                dayName={dayName}
                dateStr={dateStr}
                isSelected={isSelected}
                hasCustomHours={hasCustomHours}
                customHours={customHours[holiday.date]}
                onToggle={() => toggleHoliday(holiday.date)}
                onSetCustomHours={(start, end) =>
                  setCustomHoursForHoliday(holiday.date, start, end)
                }
                onClearCustomHours={() => clearCustomHours(holiday.date)}
              />
            );
          })}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full mt-6 bg-primary-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-primary-700 active:bg-primary-800 transition-all shadow-sm hover:shadow-md inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Holiday Settings"}
        </button>
      </div>
    </div>
  );
}

function HolidayRow({
  holiday,
  dayName,
  dateStr,
  isSelected,
  hasCustomHours,
  customHours,
  onToggle,
  onSetCustomHours,
  onClearCustomHours,
}) {
  const [showCustomHours, setShowCustomHours] = useState(false);
  const [start, setStart] = useState(customHours?.start || "09:00");
  const [end, setEnd] = useState(customHours?.end || "13:00");

  const handleSaveCustomHours = () => {
    onSetCustomHours(start, end);
    setShowCustomHours(false);
  };

  return (
    <div className="border-2 border-secondary-200 rounded-lg hover:border-secondary-300 transition-all duration-200">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onToggle}
            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${
              isSelected
                ? "bg-error-100 border-error-400"
                : "border-secondary-300 hover:border-secondary-400"
            }`}
          >
            {isSelected && <X size={16} className="text-error-700" />}
          </button>

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h4 className="font-semibold text-secondary-900">{holiday.name}</h4>
              <span
                className={`text-xs px-2 py-0.5 rounded font-semibold ${
                  holiday.type === "federal"
                    ? "bg-primary-100 text-primary-700"
                    : "bg-premium-100 text-premium-700"
                }`}
              >
                {holiday.type}
              </span>
            </div>
            <p className="text-sm text-secondary-600 mt-0.5">
              {dayName}, {dateStr}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasCustomHours && (
            <div className="text-sm bg-warning-50 text-warning-800 px-3 py-1 rounded border-2 border-warning-200 font-medium">
              Custom: {customHours.start} - {customHours.end}
            </div>
          )}

          {isSelected && !showCustomHours && (
            <button
              onClick={() => setShowCustomHours(true)}
              className="text-sm text-primary-700 hover:text-primary-800 font-semibold px-3 py-1 hover:underline"
            >
              {hasCustomHours ? "Edit Hours" : "Set Custom Hours"}
            </button>
          )}
        </div>
      </div>

      {/* Custom Hours Editor */}
      {showCustomHours && (
        <div className="border-t-2 border-secondary-200 p-4 bg-secondary-50">
          <p className="text-sm font-semibold text-secondary-900 mb-3">
            Set custom hours for {holiday.name}
          </p>
          <div className="flex items-center gap-3">
            <input
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="border-2 border-secondary-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all"
            />
            <span className="text-secondary-600 font-medium">to</span>
            <input
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="border-2 border-secondary-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all"
            />
            <button
              onClick={handleSaveCustomHours}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-all"
            >
              Save
            </button>
            <button
              onClick={() => setShowCustomHours(false)}
              className="text-secondary-700 px-4 py-2 hover:text-secondary-900 font-medium transition-all"
            >
              Cancel
            </button>
            {hasCustomHours && (
              <button
                onClick={() => {
                  onClearCustomHours();
                  setShowCustomHours(false);
                }}
                className="text-error-600 px-4 py-2 hover:text-error-700 font-semibold transition-all"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}