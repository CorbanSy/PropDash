//levlpro-mvp\src\components\CustomerDashboard\MyJobs\components\PostJobModal\PostJobModal.jsx
import { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { supabase } from "../../../../../lib/supabaseClient";
import { theme } from "../../../../../styles/theme";

// Hooks
import { useJobForm } from "./hooks/useJobForm";

// Sections
import BasicInfoSection from "./sections/BasicInfoSection";
import PhotosSection from "./sections/PhotosSection";
import LocationSection from "./sections/LocationSection";
import SchedulingSection from "./sections/SchedulingSection";
import RequirementsSection from "./sections/RequirementsSection";
import NotificationsSection from "./sections/NotificationsSection";

// Components
import DirectBookingBanner from "./components/DirectBookingBanner";
import InfoBox from "./components/InfoBox";
import SubmitButton from "./components/SubmitButton";

// Utils
import { validateJobForm, formatJobAddress } from "./utils/validation";
import {
  uploadPhotos,
  buildJobData,
  dispatchJobToProviders,
} from "./utils/jobSubmission";

export default function PostJobModal({
  onClose,
  onSuccess,
  userId,
  editingJob,
  directProviderId = null,
  providerName = null,
}) {
  const isEditing = !!editingJob;
  const isDirectBooking = !!directProviderId && !isEditing;

  const {
    formData,
    updateFormData,
    existingPhotos,
    setExistingPhotos,
  } = useJobForm(editingJob);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const validationError = validateJobForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Fetch customer info
      const { data: customerData, error: customerError } = await supabase
        .from("customers")
        .select("full_name, address, city, state, zip_code")
        .eq("id", userId)
        .single();

      if (customerError) throw customerError;

      // Upload photos
      const newPhotoUrls = await uploadPhotos(formData.photos, userId);
      const photoUrls = [...existingPhotos, ...newPhotoUrls];

      // Format address
      const jobAddress = formatJobAddress(formData, customerData);

      // Build job data
      const jobData = buildJobData(
        formData,
        userId,
        customerData,
        photoUrls,
        jobAddress,
        isDirectBooking,
        directProviderId
      );

      // Update or insert
      if (isEditing) {
        const { error: updateError } = await supabase
          .from("jobs")
          .update(jobData)
          .eq("id", editingJob.id)
          .eq("customer_id", userId);

        if (updateError) throw updateError;

        alert("Job updated successfully!");
        onSuccess();
      } else {
        // Insert new job
        const { data: insertedJob, error: insertError } = await supabase
          .from("jobs")
          .insert(jobData)
          .select()
          .single();

        if (insertError) throw insertError;

        // Handle direct booking vs dispatch
        if (isDirectBooking) {
          console.log("📬 Direct booking created for provider:", directProviderId);
          alert(
            `🎉 Booking request sent to ${
              providerName || "the provider"
            }! They will be notified and can accept or decline your request.`
          );
          onSuccess();
        } else {
          // Dispatch to providers
          const result = await dispatchJobToProviders(insertedJob.id);
          alert(result.message);
          onSuccess();
        }
      }
    } catch (err) {
      console.error("Full error:", err);
      setError(
        err.message ||
          `Failed to ${isEditing ? "update" : "post"} job. Please check console for details.`
      );
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-secondary-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className={theme.text.h2}>
              {isEditing
                ? "Edit Job"
                : isDirectBooking
                ? `Book ${providerName || "Provider"}`
                : "Post a Job"}
            </h2>
            <p className={theme.text.body}>
              {isEditing
                ? "Update job details below"
                : isDirectBooking
                ? `Send a direct booking request to ${
                    providerName || "this provider"
                  }`
                : "Fill out the details below"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Direct Booking Banner */}
        {isDirectBooking && <DirectBookingBanner providerName={providerName} />}

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 bg-error-50 border border-error-200 text-error-800 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <span className={theme.text.caption}>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <BasicInfoSection formData={formData} updateFormData={updateFormData} />

          <PhotosSection
            formData={formData}
            updateFormData={updateFormData}
            existingPhotos={existingPhotos}
            setExistingPhotos={setExistingPhotos}
            isEditing={isEditing}
            setError={setError}
          />

          <LocationSection formData={formData} updateFormData={updateFormData} />

          <SchedulingSection
            formData={formData}
            updateFormData={updateFormData}
          />

          <RequirementsSection
            formData={formData}
            updateFormData={updateFormData}
            isDirectBooking={isDirectBooking}
          />

          <NotificationsSection
            formData={formData}
            updateFormData={updateFormData}
          />

          <InfoBox
            isDirectBooking={isDirectBooking}
            providerName={providerName}
          />

          <SubmitButton
            loading={loading}
            isEditing={isEditing}
            isDirectBooking={isDirectBooking}
          />
        </form>
      </div>
    </div>
  );
}