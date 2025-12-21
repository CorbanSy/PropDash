//levlpro-mvp\src\components\ProviderDashboard\Schedule\ScheduleSettings.jsx
import { useState } from "react";
import { AlertCircle, Car } from "lucide-react";
import { theme } from "../../../styles/theme";

export default function ScheduleSettings({ userId }) {
  const [settings, setSettings] = useState({
    minAdvanceNotice: "24",
    maxAdvanceBooking: "90",
    bufferTime: "15",
    travelTimeEnabled: false,
    travelTimeBefore: "15",
    travelTimeAfter: "15",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // TODO: Save to database
    console.log("Saving settings:", settings);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border-2 border-secondary-200 shadow-card p-6">
        <h3 className="text-xl font-semibold text-secondary-900 mb-6">Booking Preferences</h3>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-secondary-700">Minimum Advance Notice</label>
            <p className="text-xs text-secondary-500 mb-2">
              Clients must book at least this far in advance
            </p>
            <select
              value={settings.minAdvanceNotice}
              onChange={(e) => setSettings({ ...settings, minAdvanceNotice: e.target.value })}
              className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all"
            >
              <option value="0">No minimum</option>
              <option value="2">2 hours</option>
              <option value="4">4 hours</option>
              <option value="12">12 hours</option>
              <option value="24">24 hours (1 day)</option>
              <option value="48">48 hours (2 days)</option>
              <option value="72">72 hours (3 days)</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-secondary-700">Maximum Advance Booking</label>
            <p className="text-xs text-secondary-500 mb-2">
              Clients can book up to this far in the future
            </p>
            <select
              value={settings.maxAdvanceBooking}
              onChange={(e) => setSettings({ ...settings, maxAdvanceBooking: e.target.value })}
              className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all"
            >
              <option value="30">30 days (1 month)</option>
              <option value="60">60 days (2 months)</option>
              <option value="90">90 days (3 months)</option>
              <option value="180">180 days (6 months)</option>
              <option value="365">365 days (1 year)</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-secondary-700">Buffer Time Between Appointments</label>
            <p className="text-xs text-secondary-500 mb-2">
              Automatic break time between back-to-back bookings
            </p>
            <select
              value={settings.bufferTime}
              onChange={(e) => setSettings({ ...settings, bufferTime: e.target.value })}
              className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all"
            >
              <option value="0">No buffer</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </select>
          </div>
        </div>
      </div>

      {/* Travel Time Settings */}
      <div className="bg-white rounded-xl border-2 border-secondary-200 shadow-card p-6">
        <div className="flex items-start gap-3 mb-6">
          <Car className="text-primary-600 mt-1" size={24} />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-secondary-900 mb-1">Travel Time</h3>
            <p className="text-secondary-700 leading-relaxed">
              Automatically block time before and after jobs for travel
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.travelTimeEnabled}
              onChange={(e) =>
                setSettings({ ...settings, travelTimeEnabled: e.target.checked })
              }
              className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
            />
            <div>
              <p className="font-semibold text-secondary-900">Enable Travel Time Blocking</p>
              <p className="text-sm text-secondary-600">
                Prevent back-to-back bookings without travel buffer
              </p>
            </div>
          </label>

          {settings.travelTimeEnabled && (
            <>
              <div className="bg-primary-50 border-2 border-primary-300 text-primary-900 p-4 rounded-lg shadow-sm flex items-start gap-3">
                <AlertCircle className="flex-shrink-0 text-primary-700" size={20} />
                <p className="text-xs text-primary-700">
                  Travel time will be automatically added before and after each job to ensure
                  you have time to get to and from locations.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-secondary-700">Travel Time Before Job</label>
                  <select
                    value={settings.travelTimeBefore}
                    onChange={(e) =>
                      setSettings({ ...settings, travelTimeBefore: e.target.value })
                    }
                    className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all mt-2"
                  >
                    <option value="0">No buffer</option>
                    <option value="10">10 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="20">20 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-secondary-700">Travel Time After Job</label>
                  <select
                    value={settings.travelTimeAfter}
                    onChange={(e) =>
                      setSettings({ ...settings, travelTimeAfter: e.target.value })
                    }
                    className="w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all mt-2"
                  >
                    <option value="0">No buffer</option>
                    <option value="10">10 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="20">20 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                  </select>
                </div>
              </div>

              <div className="bg-secondary-50 rounded-lg p-4 border-2 border-secondary-200">
                <p className="font-semibold text-secondary-900 text-sm mb-2">Example:</p>
                <p className="text-sm text-secondary-700">
                  If a job is scheduled at 2:00 PM with {settings.travelTimeBefore} min before
                  and {settings.travelTimeAfter} min after, your calendar will be blocked from{" "}
                  {
                    new Date(
                      2000,
                      0,
                      1,
                      14 - Math.floor(Number(settings.travelTimeBefore) / 60),
                      0 - (Number(settings.travelTimeBefore) % 60)
                    ).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })
                  }{" "}
                  to{" "}
                  {
                    new Date(
                      2000,
                      0,
                      1,
                      15 + Math.floor(Number(settings.travelTimeAfter) / 60),
                      0 + (Number(settings.travelTimeAfter) % 60)
                    ).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })
                  }
                  .
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-primary-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-primary-700 active:bg-primary-800 transition-all shadow-sm hover:shadow-md inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}