import { useState, useEffect } from "react";
import { Clock, Save, Calendar, X, Plus, CheckCircle2 } from "lucide-react";
import { supabase } from "../../../../lib/supabaseClient";
import { theme } from "../../../../styles/theme";

const DAYS_OF_WEEK = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

export default function AvailabilitySettings({ providerData, onUpdate }) {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [availability, setAvailability] = useState({
    monday: { enabled: true, start: "09:00", end: "17:00" },
    tuesday: { enabled: true, start: "09:00", end: "17:00" },
    wednesday: { enabled: true, start: "09:00", end: "17:00" },
    thursday: { enabled: true, start: "09:00", end: "17:00" },
    friday: { enabled: true, start: "09:00", end: "17:00" },
    saturday: { enabled: false, start: "09:00", end: "17:00" },
    sunday: { enabled: false, start: "09:00", end: "17:00" },
  });

  const [unavailableDates, setUnavailableDates] = useState([]);
  const [newUnavailableDate, setNewUnavailableDate] = useState({
    start: "",
    end: "",
    reason: "",
  });

  useEffect(() => {
    if (providerData.availability) {
      setAvailability(providerData.availability);
    }
    if (providerData.unavailable_dates) {
      setUnavailableDates(providerData.unavailable_dates);
    }
  }, [providerData]);

  const handleSave = async () => {
    setSaving(true);
    setSuccess("");

    const { error } = await supabase
      .from("providers")
      .update({
        availability: availability,
        unavailable_dates: unavailableDates,
      })
      .eq("id", providerData.id);

    if (error) {
      alert("Failed to save availability");
    } else {
      setSuccess("Availability saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
      onUpdate();
    }

    setSaving(false);
  };

  const toggleDay = (day) => {
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        enabled: !availability[day].enabled,
      },
    });
  };

  const updateTime = (day, field, value) => {
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        [field]: value,
      },
    });
  };

  const addUnavailableDate = () => {
    if (!newUnavailableDate.start || !newUnavailableDate.end) {
      alert("Please select both start and end dates");
      return;
    }

    setUnavailableDates([
      ...unavailableDates,
      { ...newUnavailableDate, id: Date.now() },
    ]);

    setNewUnavailableDate({ start: "", end: "", reason: "" });
  };

  const removeUnavailableDate = (id) => {
    setUnavailableDates(unavailableDates.filter((d) => d.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className={`${theme.alert.success} flex items-center gap-3`}>
          <CheckCircle2 size={20} />
          <span className="font-medium">{success}</span>
        </div>
      )}

      {/* Weekly Hours */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary-100 p-2.5 rounded-lg">
            <Clock className="text-primary-600" size={20} />
          </div>
          <div>
            <h3 className={theme.text.h4}>
              Working Hours
            </h3>
            <p className={`${theme.text.muted} text-sm`}>
              Set your typical weekly availability
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day.key}
              className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg"
            >
              <div className="flex items-center gap-3 w-32">
                <input
                  type="checkbox"
                  checked={availability[day.key].enabled}
                  onChange={() => toggleDay(day.key)}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                />
                <span className="font-medium text-secondary-900">{day.label}</span>
              </div>

              {availability[day.key].enabled ? (
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="time"
                    value={availability[day.key].start}
                    onChange={(e) => updateTime(day.key, "start", e.target.value)}
                    className={`${theme.input.base} ${theme.input.focus}`}
                  />
                  <span className={theme.text.muted}>to</span>
                  <input
                    type="time"
                    value={availability[day.key].end}
                    onChange={(e) => updateTime(day.key, "end", e.target.value)}
                    className={`${theme.input.base} ${theme.input.focus}`}
                  />
                </div>
              ) : (
                <span className={`${theme.text.muted} italic`}>Unavailable</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Time Off / Vacation */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-warning-100 p-2.5 rounded-lg">
            <Calendar className="text-warning-600" size={20} />
          </div>
          <div>
            <h3 className={theme.text.h4}>Time Off</h3>
            <p className={`${theme.text.muted} text-sm`}>
              Block out vacation days or unavailable periods
            </p>
          </div>
        </div>

        {/* Add New Time Off */}
        <div className="bg-slate-50 rounded-lg p-4 mb-4">
          <h4 className={`${theme.text.h5} mb-3`}>
            Add Unavailable Period
          </h4>
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className={`${theme.text.label} block mb-1`}>
                Start Date
              </label>
              <input
                type="date"
                value={newUnavailableDate.start}
                onChange={(e) =>
                  setNewUnavailableDate({
                    ...newUnavailableDate,
                    start: e.target.value,
                  })
                }
                className={`${theme.input.base} ${theme.input.focus}`}
              />
            </div>
            <div>
              <label className={`${theme.text.label} block mb-1`}>
                End Date
              </label>
              <input
                type="date"
                value={newUnavailableDate.end}
                onChange={(e) =>
                  setNewUnavailableDate({
                    ...newUnavailableDate,
                    end: e.target.value,
                  })
                }
                className={`${theme.input.base} ${theme.input.focus}`}
              />
            </div>
            <div>
              <label className={`${theme.text.label} block mb-1`}>
                Reason (Optional)
              </label>
              <input
                type="text"
                value={newUnavailableDate.reason}
                onChange={(e) =>
                  setNewUnavailableDate({
                    ...newUnavailableDate,
                    reason: e.target.value,
                  })
                }
                placeholder="Vacation, etc."
                className={`${theme.input.base} ${theme.input.focus}`}
              />
            </div>
          </div>
          <button
            onClick={addUnavailableDate}
            className={`${theme.button.warning} mt-3`}
          >
            <Plus size={16} />
            Add Time Off
          </button>
        </div>

        {/* List of Unavailable Dates */}
        <div className="space-y-2">
          {unavailableDates.length === 0 ? (
            <p className={`${theme.text.muted} text-center py-4`}>
              No time off scheduled
            </p>
          ) : (
            unavailableDates.map((date) => (
              <div
                key={date.id}
                className="flex items-center justify-between p-3 bg-warning-50 border border-warning-200 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-secondary-900">
                    {new Date(date.start).toLocaleDateString()} -{" "}
                    {new Date(date.end).toLocaleDateString()}
                  </p>
                  {date.reason && (
                    <p className={`${theme.text.caption}`}>{date.reason}</p>
                  )}
                </div>
                <button
                  onClick={() => removeUnavailableDate(date.id)}
                  className="p-2 text-error-600 hover:bg-error-100 rounded-lg transition"
                >
                  <X size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`${theme.button.primary} w-full py-4 disabled:opacity-50 justify-center`}
      >
        {saving ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Saving...
          </>
        ) : (
          <>
            <Save size={20} />
            Save Availability
          </>
        )}
      </button>
    </div>
  );
}