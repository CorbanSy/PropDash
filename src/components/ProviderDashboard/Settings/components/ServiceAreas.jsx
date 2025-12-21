//levlpro-mvp\src\components\ProviderDashboard\Settings\components\ServiceAreas.jsx
import { useState, useEffect } from "react";
import { MapPin, Save, Plus, X, Navigation } from "lucide-react";
import { supabase } from "../../../../lib/supabaseClient";
import { validateZipCode } from "../utils/settingsHelpers";

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
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl">
          {success}
        </div>
      )}

      {/* Service Area Method */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-2.5 rounded-lg">
            <MapPin className="text-purple-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Service Areas
            </h3>
            <p className="text-sm text-slate-600">
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
                ? "border-blue-400 bg-blue-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <MapPin size={20} className="text-blue-600" />
              <h4 className="font-semibold text-slate-900">Specific ZIP Codes</h4>
            </div>
            <p className="text-sm text-slate-600">
              Choose exact ZIP codes you serve
            </p>
          </button>

          <button
            onClick={() => setServiceMethod("radius")}
            className={`p-4 rounded-lg border-2 transition text-left ${
              serviceMethod === "radius"
                ? "border-blue-400 bg-blue-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Navigation size={20} className="text-blue-600" />
              <h4 className="font-semibold text-slate-900">Radius</h4>
            </div>
            <p className="text-sm text-slate-600">
              Set a mile radius around your location
            </p>
          </button>
        </div>

        {/* ZIP Codes Method */}
        {serviceMethod === "zipcodes" && (
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Add ZIP Codes</h4>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newZipCode}
                onChange={(e) => setNewZipCode(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addZipCode()}
                placeholder="Enter ZIP code"
                className="flex-1 border-2 border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                maxLength={10}
              />
              <button
                onClick={addZipCode}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2"
              >
                <Plus size={18} />
                Add
              </button>
            </div>

            {/* ZIP Code List */}
            <div className="flex flex-wrap gap-2">
              {zipCodes.length === 0 ? (
                <p className="text-slate-500 text-sm">No ZIP codes added yet</p>
              ) : (
                zipCodes.map((zip) => (
                  <span
                    key={zip}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg font-medium"
                  >
                    {zip}
                    <button
                      onClick={() => removeZipCode(zip)}
                      className="hover:bg-blue-200 rounded-full p-0.5 transition"
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
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Your Base Location (ZIP or Address)
              </label>
              <input
                type="text"
                value={baseLocation}
                onChange={(e) => setBaseLocation(e.target.value)}
                placeholder="e.g., 90210 or 123 Main St, Los Angeles, CA"
                className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Service Radius: {radius} miles
              </label>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-600 mt-1">
                <span>5 mi</span>
                <span>25 mi</span>
                <span>50 mi</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Coverage Area:</strong> You'll serve all locations within {radius} miles of {baseLocation || "your base location"}.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Travel Fee Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h4 className="font-semibold text-amber-900 mb-2">💡 Pro Tip</h4>
        <p className="text-sm text-amber-800">
          Set travel fees in your AI Quote Preferences to automatically charge for jobs outside your primary area.
        </p>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Save size={20} />
        {saving ? "Saving..." : "Save Service Areas"}
      </button>
    </div>
  );
}