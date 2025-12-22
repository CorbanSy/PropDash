import { useState, useEffect } from "react";
import { Briefcase, Save, CheckCircle2 } from "lucide-react";
import { supabase } from "../../../../lib/supabaseClient";
import { SERVICES_BY_CATEGORY } from "../../../../constants/serviceCategories";
import { theme } from "../../../../styles/theme";

export default function ServicesOffered({ providerData, onUpdate }) {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    if (providerData.services_offered) {
      setSelectedServices(providerData.services_offered);
    }
  }, [providerData]);

  const handleSave = async () => {
    setSaving(true);
    setSuccess("");

    // ✅ Extract categories from selected services
    const selectedCategories = [
      ...new Set(
        selectedServices.map((serviceId) => {
          // Extract category from service ID (e.g., "handyman-general" → "handyman")
          return serviceId.split('-')[0];
        })
      ),
    ];

    const { error } = await supabase
      .from("providers")
      .update({ 
        services_offered: selectedServices,
        service_categories: selectedCategories // ✅ Save categories too
      })
      .eq("id", providerData.id);

    if (error) {
      console.error("Save error:", error);
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
    const categoryServices = SERVICES_BY_CATEGORY[category].map((s) => s.id);
    const allSelected = categoryServices.every((id) =>
      selectedServices.includes(id)
    );

    if (allSelected) {
      setSelectedServices(
        selectedServices.filter((s) => !categoryServices.includes(s))
      );
    } else {
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
        <div className={`${theme.alert.success} flex items-center gap-3`}>
          <CheckCircle2 size={20} />
          <span className="font-medium">{success}</span>
        </div>
      )}

      {/* Header */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-indigo-100 p-2.5 rounded-lg">
            <Briefcase className="text-indigo-600" size={20} />
          </div>
          <div>
            <h3 className={theme.text.h4}>
              Services You Offer
            </h3>
            <p className={`${theme.text.muted} text-sm`}>
              Select all services you provide to receive relevant job offers
            </p>
          </div>
        </div>

        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <p className="text-sm text-primary-900">
            <strong>💡 Important:</strong> Only jobs matching your selected services will be dispatched to you.
          </p>
        </div>
      </div>

      {/* Services by Category */}
      <div className="space-y-4">
        {Object.entries(SERVICES_BY_CATEGORY).map(([category, services]) => {
          const allSelected = services.every((s) =>
            selectedServices.includes(s.id)
          );

          return (
            <div
              key={category}
              className={`${theme.card.base} ${theme.card.padding}`}
            >
              {/* Category Header */}
              <div className="flex items-center justify-between mb-4">
                <h4 className={`${theme.text.h4} capitalize`}>
                  {category}
                </h4>
                <button
                  onClick={() => selectAllInCategory(category)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
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
                          ? "border-primary-400 bg-primary-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                            isSelected
                              ? "bg-primary-600 border-primary-600"
                              : "border-slate-300"
                          }`}
                        >
                          {isSelected && (
                            <CheckCircle2 size={14} className="text-white" />
                          )}
                        </div>
                        <span
                          className={`font-medium text-sm ${
                            isSelected ? "text-primary-900" : "text-secondary-900"
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
        <p className="text-sm text-secondary-700">
          <strong>{selectedServices.length}</strong> service
          {selectedServices.length !== 1 ? "s" : ""} selected
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
            Save Services
          </>
        )}
      </button>
    </div>
  );
}