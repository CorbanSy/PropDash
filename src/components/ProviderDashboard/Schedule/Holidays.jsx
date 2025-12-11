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

  // Load holidays list
  useEffect(() => {
    const allHolidays = getAllHolidays(selectedYear);
    
    const uniqueHolidays = allHolidays.filter((holiday, index, self) =>
      index === self.findIndex((h) => h.date === holiday.date)
    );
    
    setHolidays(uniqueHolidays);
  }, [selectedYear]);

  // Load saved settings from database
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
        // No saved settings for this year
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
        <div className={theme.text.body}>Loading holiday settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={theme.alert.info}>
        <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
        <div>
          <p className="font-semibold text-sm mb-1">Manage Holiday Availability</p>
          <p className="text-xs">
            Select holidays you want to block or set custom hours. These will override your
            weekly schedule.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`${theme.statCard.blue} border rounded-xl p-4 text-center`}>
          <p className="text-2xl font-bold mb-1">{selectedHolidays.size}</p>
          <p className="text-xs font-semibold opacity-80">Blocked</p>
        </div>
        <div className={`${theme.statCard.orange} border rounded-xl p-4 text-center`}>
          <p className="text-2xl font-bold mb-1">{Object.keys(customHours).length}</p>
          <p className="text-xs font-semibold opacity-80">Custom Hours</p>
        </div>
        <div className={`${theme.statCard.green} border rounded-xl p-4 text-center`}>
          <p className="text-2xl font-bold mb-1">
            {holidays.length - selectedHolidays.size}
          </p>
          <p className="text-xs font-semibold opacity-80">Available</p>
        </div>
      </div>

      <div className={`${theme.card.base} ${theme.card.padding}`}>
        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className={`${theme.input.base} ${theme.input.provider}`}
            >
              <option value={currentYear - 1}>{currentYear - 1}</option>
              <option value={currentYear}>{currentYear}</option>
              <option value={currentYear + 1}>{currentYear + 1}</option>
            </select>

            <div className="flex gap-2 border-l border-slate-200 pl-4">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 text-sm rounded-lg font-medium transition ${
                  filter === "all"
                    ? "bg-blue-100 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                All ({holidays.length})
              </button>
              <button
                onClick={() => setFilter("federal")}
                className={`px-3 py-1.5 text-sm rounded-lg font-medium transition ${
                  filter === "federal"
                    ? "bg-blue-100 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Federal ({federalCount})
              </button>
              <button
                onClick={() => setFilter("popular")}
                className={`px-3 py-1.5 text-sm rounded-lg font-medium transition ${
                  filter === "popular"
                    ? "bg-blue-100 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Popular ({popularCount})
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={selectAllFederal}
              className={`${theme.button.secondary} text-sm`}
            >
              Block All Federal
            </button>
            <button onClick={deselectAll} className={`${theme.button.secondary} text-sm`}>
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
          className={`w-full mt-6 ${theme.button.provider} justify-center`}
        >
          {saving ? "Saving..." : "Save Holiday Settings"}
        </button>
      </div>
    </div>
  );
}

// Holiday Row Component (unchanged)
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
    <div className="border border-slate-200 rounded-lg">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onToggle}
            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${
              isSelected
                ? "bg-red-100 border-red-400"
                : "border-slate-300 hover:border-slate-400"
            }`}
          >
            {isSelected && <X size={16} className="text-red-700" />}
          </button>

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h4 className="font-semibold text-slate-900">{holiday.name}</h4>
              <span
                className={`text-xs px-2 py-0.5 rounded font-medium ${
                  holiday.type === "federal"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {holiday.type}
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-0.5">
              {dayName}, {dateStr}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasCustomHours && (
            <div className="text-sm bg-amber-50 text-amber-700 px-3 py-1 rounded border border-amber-200">
              Custom: {customHours.start} - {customHours.end}
            </div>
          )}

          {isSelected && !showCustomHours && (
            <button
              onClick={() => setShowCustomHours(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1"
            >
              {hasCustomHours ? "Edit Hours" : "Set Custom Hours"}
            </button>
          )}
        </div>
      </div>

      {/* Custom Hours Editor */}
      {showCustomHours && (
        <div className="border-t border-slate-200 p-4 bg-slate-50">
          <p className="text-sm font-semibold text-slate-700 mb-3">
            Set custom hours for {holiday.name}
          </p>
          <div className="flex items-center gap-3">
            <input
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="border-2 border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
            <span className="text-slate-600">to</span>
            <input
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="border-2 border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
            <button
              onClick={handleSaveCustomHours}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => setShowCustomHours(false)}
              className="text-slate-600 px-4 py-2 hover:text-slate-800"
            >
              Cancel
            </button>
            {hasCustomHours && (
              <button
                onClick={() => {
                  onClearCustomHours();
                  setShowCustomHours(false);
                }}
                className="text-red-600 px-4 py-2 hover:text-red-700"
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