// src/components/CustomerDashboard/MyJobs/components/PostJobModal/utils/jobSubmission.js
import { supabase } from "../../../../../../lib/supabaseClient";

export async function uploadPhotos(photos, userId) {
  const photoUrls = [];
  
  for (const photo of photos) {
    const fileName = `${userId}/${Date.now()}-${photo.file.name}`;
    const { data, error: uploadError } = await supabase.storage
      .from("job-photos")
      .upload(fileName, photo.file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("job-photos")
      .getPublicUrl(fileName);

    photoUrls.push(publicUrl);
  }
  
  return photoUrls;
}

export function buildJobData(formData, userId, customerData, photoUrls, jobAddress, isDirectBooking, directProviderId) {
  const jobData = {
    customer_id: userId,
    client_name: customerData?.full_name || "Customer",
    service_name: formData.jobTitle,
    category: formData.category,
    notes: formData.description,
    client_address: jobAddress,
    scheduled_date: formData.schedulingType === "specific" ? formData.preferredDate : null,
    photos: photoUrls,
    special_requirements: {
      schedulingType: formData.schedulingType,
      needMaterials: formData.needMaterials,
      mustBeLicensed: formData.mustBeLicensed,
      weekendAvailability: formData.weekendAvailability,
      sameDayAvailability: formData.sameDayAvailability,
      petsInHome: formData.petsInHome,
      parkingInfo: formData.parkingInfo,
      backupDate: formData.backupDate,
    },
    allow_multiple_quotes: formData.allowMultiplePros,
    // DON'T set status - let database default handle it
  };

  // Add provider_id for direct booking (but NOT status)
  if (isDirectBooking) {
    jobData.provider_id = directProviderId;
  }

  return jobData;
}

export async function dispatchJobToProviders(jobId) {
  try {
    console.log("🚀 Dispatching job to providers...", jobId);
    
    const { data: dispatchResult, error: dispatchError } = await supabase.rpc(
      "dispatch_job_to_providers",
      { p_job_id: jobId }
    );

    if (dispatchError) {
      console.error("⚠️ Dispatch error:", dispatchError);
      return {
        success: false,
        message: "Job posted! However, there was an issue notifying providers. Our team will follow up.",
      };
    }

    console.log("✅ Dispatch result:", dispatchResult);

    if (dispatchResult && dispatchResult.length > 0) {
      const { total_providers_found } = dispatchResult[0];

      if (total_providers_found === 0) {
        return {
          success: true,
          message: "Job posted successfully! However, no providers are currently available in your area. We'll notify you when providers become available.",
        };
      }

      return {
        success: true,
        message: `🎉 Job posted successfully! We're notifying ${total_providers_found} qualified providers in your area.`,
      };
    }

    return {
      success: true,
      message: "Job posted successfully!",
    };
  } catch (dispatchErr) {
    console.error("⚠️ Dispatch exception:", dispatchErr);
    return {
      success: false,
      message: "Job posted! However, there was an issue with the dispatch system. Our team will follow up.",
    };
  }
}