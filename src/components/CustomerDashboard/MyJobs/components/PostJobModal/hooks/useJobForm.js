//levlpro-mvp\src\components\CustomerDashboard\MyJobs\components\PostJobModal\hooks\useJobForm.js
import { useState, useEffect } from "react";
import { DEFAULT_FORM_DATA } from "../utils/constants";
import { parseAddress } from "../utils/validation";

export function useJobForm(editingJob) {
  const [formData, setFormData] = useState(() => {
    if (!editingJob) return DEFAULT_FORM_DATA;

    return {
      jobTitle: editingJob.service_name || "",
      category: editingJob.category || "",
      description: editingJob.notes || "",
      photos: [],
      useDefaultAddress: !editingJob.client_address || editingJob.client_address === null,
      address: "",
      unit: "",
      city: "",
      zipCode: "",
      schedulingType: editingJob.special_requirements?.schedulingType || "flexible",
      preferredDate: editingJob.scheduled_date
        ? editingJob.scheduled_date.split("T")[0]
        : "",
      backupDate: editingJob.special_requirements?.backupDate || "",
      allowMultiplePros: editingJob.allow_multiple_quotes ?? true,
      needMaterials: editingJob.special_requirements?.needMaterials || false,
      mustBeLicensed: editingJob.special_requirements?.mustBeLicensed || false,
      weekendAvailability:
        editingJob.special_requirements?.weekendAvailability || false,
      sameDayAvailability:
        editingJob.special_requirements?.sameDayAvailability || false,
      petsInHome: editingJob.special_requirements?.petsInHome || false,
      parkingInfo: editingJob.special_requirements?.parkingInfo || "",
      notifyViaSMS: true,
      notifyViaEmail: true,
    };
  });

  const [existingPhotos, setExistingPhotos] = useState(editingJob?.photos || []);

  // Parse address if editing
  useEffect(() => {
    if (editingJob?.client_address && !formData.useDefaultAddress) {
      const parsed = parseAddress(editingJob.client_address);
      if (parsed) {
        setFormData((prev) => ({
          ...prev,
          ...parsed,
        }));
      }
    }
  }, [editingJob]);

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  return {
    formData,
    setFormData,
    updateFormData,
    existingPhotos,
    setExistingPhotos,
  };
}