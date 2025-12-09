// src/components/ProviderDashboard/Settings/components/ServicesOffered.jsx
import { useState, useEffect } from "react";
import { Briefcase, Save, CheckCircle2 } from "lucide-react";
import { supabase } from "../../../../lib/supabaseClient";
import { groupServicesByCategory } from "../utils/settingsHelpers";

export default function ServicesOffered({ providerData, onUpdate }) {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);

  const servicesByCategory = groupServicesByCategory();

  useEffect(() => {
    if (providerData.services_offered) {
      setSelectedServices(providerData.services_offered);
    }
  }, [providerData]);

  const handleSave = async () => {
    setSaving(true);
    setSuccess("");

    const { error } = await supabase
      .from("providers")
      .update({ services_offered: selectedServices })
      .eq("id", providerData.id);

    if (error) {
      alert("Failed to save services");
    } else {
      setSuccess("Services saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
      onUpdate();
    }

    setSaving(false);
  };

  const toggleService = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((s) => s !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const selectAllInCategory = (category) => {
    const categoryServices = servicesByCategory[category].map((s) => s.id);
    const allSelected = categoryServices.every((id) =>
      selectedServices.includes(id)
    );

    if (allSelected) {
      // Deselect all in category
      setSelectedServices(
        selectedServices.filter((s) => !categoryServices.includes(s))
      );
    } else {
      // Select all in category
      const newServices = [
        ...new Set([...selectedServices, ...categoryServices]),
      ];
      setSelectedServices(newServices);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl flex items-center gap-2">
          <CheckCircle2 size={20} />
          {success}
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-indigo-100 p-2.5 rounded-lg">
            <Briefcase className="text-indigo-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Services You Offer
            </h3>
            <p className="text-sm text-slate-600">
              Select all services you provide to help clients find you
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>💡 Why this matters:</strong> These services will be used in AI quote generation and help match you with relevant jobs in the Network.
          </p>
        </div>
      </div>

      {/* Services by Category */}
      <div className="space-y-4">
        {Object.entries(servicesByCategory).map(([category, services]) => {
          const allSelected = services.every((s) =>
            selectedServices.includes(s.id)
          );

          return (
            <div
              key={category}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-slate-900 text-lg">
                  {category}
                </h4>
                <button
                  onClick={() => selectAllInCategory(category)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {allSelected ? "Deselect All" : "Select All"}
                </button>
              </div>

              {/* Services Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {services.map((service) => {
                  const isSelected = selectedServices.includes(service.id);

                  return (
                    <button
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`p-4 rounded-lg border-2 transition text-left ${
                        isSelected
                          ? "border-blue-400 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                            isSelected
                              ? "bg-blue-600 border-blue-600"
                              : "border-slate-300"
                          }`}
                        >
                          {isSelected && (
                            <CheckCircle2 size={14} className="text-white" />
                          )}
                        </div>
                        <span
                          className={`font-medium ${
                            isSelected ? "text-blue-900" : "text-slate-900"
                          }`}
                        >
                          {service.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Count */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <p className="text-sm text-slate-700">
          <strong>{selectedServices.length}</strong> service
          {selectedServices.length !== 1 ? "s" : ""} selected
        </p>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Save size={20} />
        {saving ? "Saving..." : "Save Services"}
      </button>
    </div>
  );
}