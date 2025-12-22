import { useState, useEffect } from "react";
import { MapPin, Save, Plus, X, Navigation, CheckCircle2 } from "lucide-react";
import { supabase } from "../../../../lib/supabaseClient";
import { validateZipCode } from "../utils/settingsHelpers";
import { theme } from "../../../../styles/theme";

export default function ServiceAreas({ providerData, onUpdate }) {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [serviceMethod, setServiceMethod] = useState("zipcodes"); // zipcodes or radius
  const [zipCodes, setZipCodes] = useState([]);
  const [newZipCode, setNewZipCode] = useState("");
  const [radius, setRadius] = useState(15);
  const [baseLocation, setBaseLocation] = useState("");

  useEffect(() => {
    if (providerData.service_areas) {
      const areas = providerData.service_areas;
      setServiceMethod(areas.method || "zipcodes");
      setZipCodes(areas.zipCodes || []);
      setRadius(areas.radius || 15);
      setBaseLocation(areas.baseLocation || "");
    }
  }, [providerData]);

  const handleSave = async () => {
    setSaving(true);
    setSuccess("");

    const serviceAreas = {
      method: serviceMethod,
      zipCodes: serviceMethod === "zipcodes" ? zipCodes : [],
      radius: serviceMethod === "radius" ? radius : null,
      baseLocation: serviceMethod === "radius" ? baseLocation : null,
    };

    const { error } = await supabase
      .from("providers")
      .update({ service_areas: serviceAreas })
      .eq("id", providerData.id);

    if (error) {
      alert("Failed to save service areas");
    } else {
      setSuccess("Service areas saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
      onUpdate();
    }

    setSaving(false);
  };

  const addZipCode = () => {
    const trimmed = newZipCode.trim();
    
    if (!validateZipCode(trimmed)) {
      alert("Please enter a valid ZIP code");
      return;
    }

    if (zipCodes.includes(trimmed)) {
      alert("ZIP code already added");
      return;
    }

    setZipCodes([...zipCodes, trimmed]);
    setNewZipCode("");
  };

  const removeZipCode = (zip) => {
    setZipCodes(zipCodes.filter((z) => z !== zip));
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

      {/* Service Area Method */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-2.5 rounded-lg">
            <MapPin className="text-purple-600" size={20} />
          </div>
          <div>
            <h3 className={theme.text.h4}>
              Service Areas
            </h3>
            <p className={`${theme.text.muted} text-sm`}>
              Define where you provide services
            </p>
          </div>
        </div>

        {/* Method Selection */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setServiceMethod("zipcodes")}
            className={`p-4 rounded-lg border-2 transition text-left ${
              serviceMethod === "zipcodes"
                ? "border-primary-400 bg-primary-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <MapPin size={20} className="text-primary-600" />
              <h4 className={`${theme.text.h5}`}>Specific ZIP Codes</h4>
            </div>
            <p className={`${theme.text.caption}`}>
              Choose exact ZIP codes you serve
            </p>
          </button>

          <button
            onClick={() => setServiceMethod("radius")}
            className={`p-4 rounded-lg border-2 transition text-left ${
              serviceMethod === "radius"
                ? "border-primary-400 bg-primary-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Navigation size={20} className="text-primary-600" />
              <h4 className={`${theme.text.h5}`}>Radius</h4>
            </div>
            <p className={`${theme.text.caption}`}>
              Set a mile radius around your location
            </p>
          </button>
        </div>

        {/* ZIP Codes Method */}
        {serviceMethod === "zipcodes" && (
          <div>
            <h4 className={`${theme.text.h5} mb-3`}>Add ZIP Codes</h4>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newZipCode}
                onChange={(e) => setNewZipCode(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addZipCode()}
                placeholder="Enter ZIP code"
                className={`${theme.input.base} ${theme.input.focus} flex-1`}
                maxLength={10}
              />
              <button
                onClick={addZipCode}
                className={theme.button.primary}
              >
                <Plus size={18} />
                Add
              </button>
            </div>

            {/* ZIP Code List */}
            <div className="flex flex-wrap gap-2">
              {zipCodes.length === 0 ? (
                <p className={`${theme.text.muted} text-sm`}>No ZIP codes added yet</p>
              ) : (
                zipCodes.map((zip) => (
                  <span
                    key={zip}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg font-medium"
                  >
                    {zip}
                    <button
                      onClick={() => removeZipCode(zip)}
                      className="hover:bg-primary-200 rounded-full p-0.5 transition"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
        )}

        {/* Radius Method */}
        {serviceMethod === "radius" && (
          <div className="space-y-4">
            <div>
              <label className={`${theme.text.label} block mb-2`}>
                Your Base Location (ZIP or Address)
              </label>
              <input
                type="text"
                value={baseLocation}
                onChange={(e) => setBaseLocation(e.target.value)}
                placeholder="e.g., 90210 or 123 Main St, Los Angeles, CA"
                className={`${theme.input.base} ${theme.input.focus}`}
              />
            </div>

            <div>
              <label className={`${theme.text.label} block mb-2`}>
                Service Radius: {radius} miles
              </label>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-xs text-secondary-600 mt-1">
                <span>5 mi</span>
                <span>25 mi</span>
                <span>50 mi</span>
              </div>
            </div>

            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <p className="text-sm text-primary-900">
                <strong>Coverage Area:</strong> You'll serve all locations within {radius} miles of {baseLocation || "your base location"}.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Travel Fee Info */}
      <div className="bg-warning-50 border border-warning-200 rounded-xl p-5">
        <h4 className="font-semibold text-warning-900 mb-2">💡 Pro Tip</h4>
        <p className="text-sm text-warning-800">
          Set travel fees in your AI Quote Preferences to automatically charge for jobs outside your primary area.
        </p>
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
            Save Service Areas
          </>
        )}
      </button>
    </div>
  );
}