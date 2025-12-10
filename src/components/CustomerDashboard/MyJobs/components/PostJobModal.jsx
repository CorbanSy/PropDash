// src/components/CustomerDashboard/MyJobs/components/PostJobModal.jsx
import { useState, useEffect } from "react";
import {
  X,
  Upload,
  Wrench,
  Home,
  Zap,
  Paintbrush,
  TreePine,
  Package,
  Droplet,
  Sparkles,
  Info,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "../../../../lib/supabaseClient";

export default function PostJobModal({ onClose, onSuccess, userId, editingJob }) {
  const isEditing = !!editingJob; // ✅ Check if we're editing

  // ✅ Initialize form data from editingJob if it exists
  const [formData, setFormData] = useState({
    jobTitle: editingJob?.service_name || "",
    category: editingJob?.category || "",
    description: editingJob?.notes || "",
    photos: [], // Photos from existing job will be shown separately
    useDefaultAddress: !editingJob?.client_address || editingJob?.client_address === null,
    address: "",
    unit: "",
    city: "",
    zipCode: "",
    schedulingType: editingJob?.special_requirements?.schedulingType || "flexible",
    preferredDate: editingJob?.scheduled_date ? editingJob.scheduled_date.split('T')[0] : "",
    backupDate: editingJob?.special_requirements?.backupDate || "",
    allowMultiplePros: editingJob?.allow_multiple_quotes ?? true,
    needMaterials: editingJob?.special_requirements?.needMaterials || false,
    mustBeLicensed: editingJob?.special_requirements?.mustBeLicensed || false,
    weekendAvailability: editingJob?.special_requirements?.weekendAvailability || false,
    sameDayAvailability: editingJob?.special_requirements?.sameDayAvailability || false,
    petsInHome: editingJob?.special_requirements?.petsInHome || false,
    parkingInfo: editingJob?.special_requirements?.parkingInfo || "",
    notifyViaSMS: true,
    notifyViaEmail: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [existingPhotos, setExistingPhotos] = useState(editingJob?.photos || []); // ✅ Track existing photos

  // ✅ Parse address if editing
  useEffect(() => {
    if (editingJob?.client_address && !formData.useDefaultAddress) {
      const addressParts = editingJob.client_address.split(", ");
      if (addressParts.length >= 3) {
        setFormData(prev => ({
          ...prev,
          address: addressParts[0] || "",
          city: addressParts[1] || "",
          zipCode: addressParts[2] || "",
        }));
      }
    }
  }, [editingJob]);

  const categories = [
    { id: "handyman", name: "Handyman", icon: Wrench },
    { id: "plumbing", name: "Plumbing", icon: Droplet },
    { id: "electrical", name: "Electrical", icon: Zap },
    { id: "cleaning", name: "Cleaning", icon: Sparkles },
    { id: "painting", name: "Painting", icon: Paintbrush },
    { id: "assembly", name: "Assembly", icon: Package },
    { id: "landscaping", name: "Landscaping", icon: TreePine },
    { id: "hvac", name: "HVAC", icon: Home },
  ];

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalPhotos = formData.photos.length + existingPhotos.length;
    
    if (totalPhotos + files.length > 5) {
      setError("Maximum 5 photos allowed");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFormData({
      ...formData,
      photos: [...formData.photos, ...newPhotos],
    });
  };

  const removePhoto = (index) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    setFormData({ ...formData, photos: newPhotos });
  };

  // ✅ Remove existing photo
  const removeExistingPhoto = (index) => {
    const newExistingPhotos = existingPhotos.filter((_, i) => i !== index);
    setExistingPhotos(newExistingPhotos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.jobTitle.trim()) {
      setError("Please enter a job title");
      return;
    }
    if (!formData.category) {
      setError("Please select a category");
      return;
    }
    if (!formData.description.trim()) {
      setError("Please enter a job description");
      return;
    }
    if (
      !formData.useDefaultAddress &&
      (!formData.address || !formData.city || !formData.zipCode)
    ) {
      setError("Please fill in all address fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Fetch customer info first
      const { data: customerData, error: customerError } = await supabase
        .from("customers")
        .select("full_name, address, city, state, zip_code")
        .eq("id", userId)
        .single();

      if (customerError) throw customerError;

      // Upload new photos to Supabase Storage
      const photoUrls = [...existingPhotos]; // ✅ Keep existing photos
      for (const photo of formData.photos) {
        const fileName = `${userId}/${Date.now()}-${photo.file.name}`;
        const { data, error: uploadError } = await supabase.storage
          .from("job-photos")
          .upload(fileName, photo.file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("job-photos").getPublicUrl(fileName);

        photoUrls.push(publicUrl);
      }

      // Determine the address to use
      let jobAddress;
      if (formData.useDefaultAddress && customerData) {
        jobAddress = `${customerData.address}${customerData.city ? `, ${customerData.city}` : ""}${customerData.state ? `, ${customerData.state}` : ""}${customerData.zip_code ? ` ${customerData.zip_code}` : ""}`;
      } else {
        jobAddress = `${formData.address}${formData.unit ? `, ${formData.unit}` : ""}, ${formData.city}, ${formData.zipCode}`;
      }

      const jobData = {
        customer_id: userId,
        client_name: customerData?.full_name || "Customer",
        service_name: formData.jobTitle,
        category: formData.category,
        notes: formData.description,
        client_address: jobAddress,
        scheduled_date:
          formData.schedulingType === "specific"
            ? formData.preferredDate
            : null,
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
      };

      // ✅ Update or insert based on editing mode
      if (isEditing) {
        const { error: updateError } = await supabase
          .from("jobs")
          .update(jobData)
          .eq("id", editingJob.id)
          .eq("customer_id", userId); // Security: only update own jobs

        if (updateError) {
          console.error("Update error:", updateError);
          throw updateError;
        }

        // Success message for edit
        alert("Job updated successfully!");
        onSuccess();
      } else {
        // ✅ INSERT NEW JOB
        const { data: insertedJob, error: insertError } = await supabase
          .from("jobs")
          .insert(jobData)
          .select()
          .single();

        if (insertError) {
          console.error("Insert error:", insertError);
          throw insertError;
        }

        // ✅✅✅ TRIGGER DISPATCH SYSTEM ✅✅✅
        if (insertedJob) {
          try {
            console.log("🚀 Dispatching job to providers...", insertedJob.id);
            
            const { data: dispatchResult, error: dispatchError } = await supabase
              .rpc('dispatch_job_to_providers', { p_job_id: insertedJob.id });
            
            if (dispatchError) {
              console.error("⚠️ Dispatch error:", dispatchError);
              // Don't fail the job creation, just log the error
              alert("Job posted! However, there was an issue notifying providers. Our team will follow up.");
            } else {
              console.log("✅ Dispatch result:", dispatchResult);
              
              if (dispatchResult && dispatchResult.length > 0) {
                const { total_providers_found, queue_created } = dispatchResult[0];
                
                if (total_providers_found === 0) {
                  alert("Job posted successfully! However, no providers are currently available in your area. We'll notify you when providers become available.");
                } else {
                  alert(`🎉 Job posted successfully! We're notifying ${total_providers_found} qualified providers in your area.`);
                }
              } else {
                alert("Job posted successfully!");
              }
            }
          } catch (dispatchErr) {
            console.error("⚠️ Dispatch exception:", dispatchErr);
            alert("Job posted! However, there was an issue with the dispatch system. Our team will follow up.");
          }
        }

        onSuccess();
      }
    } catch (err) {
      console.error("Full error:", err);
      setError(
        err.message || `Failed to ${isEditing ? 'update' : 'post'} job. Please check console for details.`
      );
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {isEditing ? "Edit Job" : "Post a Job"}
            </h2>
            <p className="text-sm text-slate-600">
              {isEditing ? "Update job details below" : "Fill out the details below"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Info */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b border-slate-200">
              Basic Information
            </h3>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) =>
                  setFormData({ ...formData, jobTitle: e.target.value })
                }
                placeholder="e.g., Fix broken sliding door"
                className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, category: cat.id })
                    }
                    className={`p-4 rounded-xl border-2 transition ${
                      formData.category === cat.id
                        ? "border-teal-600 bg-teal-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <cat.icon
                      size={28}
                      className={`mx-auto mb-2 ${
                        formData.category === cat.id
                          ? "text-teal-600"
                          : "text-slate-400"
                      }`}
                    />
                    <p className="text-sm font-medium text-slate-900">
                      {cat.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe what you need done. Be specific about the problem, what you'd like fixed, and any important details..."
                rows={5}
                className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
                required
              />
              <p className="text-xs text-slate-500 mt-2">
                💡 Tip: More details help pros give accurate quotes
              </p>
            </div>
          </div>

          {/* Photos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b border-slate-200">
              Photos (Optional)
            </h3>

            {/* Show existing photos if editing */}
            {existingPhotos.length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Current Photos:</p>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
                  {existingPhotos.map((photoUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photoUrl}
                        alt={`Existing ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingPhoto(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload new photos */}
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-teal-500 transition">
              <input
                type="file"
                id="photo-upload"
                accept="image/*,video/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <label
                htmlFor="photo-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <div className="bg-teal-100 p-3 rounded-full mb-3">
                  <Upload className="text-teal-600" size={24} />
                </div>
                <p className="font-semibold text-slate-900 mb-1">
                  Click to upload {isEditing ? "additional " : ""}photos (up to 5 total)
                </p>
                <p className="text-sm text-slate-500">
                  PNG, JPG, MP4 up to 10MB each
                </p>
              </label>
            </div>

            {/* Show newly uploaded photos */}
            {formData.photos.length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">New Photos:</p>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo.preview}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b border-slate-200">
              Location
            </h3>

            <label className="flex items-center gap-3 p-4 border-2 border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition">
              <input
                type="checkbox"
                checked={formData.useDefaultAddress}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    useDefaultAddress: e.target.checked,
                  })
                }
                className="w-5 h-5 text-teal-600 rounded"
              />
              <div className="flex-1">
                <p className="font-medium text-slate-900">
                  Use my saved address
                </p>
                <p className="text-sm text-slate-600">
                  Use the address from your profile
                </p>
              </div>
            </label>

            {!formData.useDefaultAddress && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="123 Main Street"
                    className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required={!formData.useDefaultAddress}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Unit / Apt (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    placeholder="Apt 4B"
                    className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder="San Francisco"
                      className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      required={!formData.useDefaultAddress}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      ZIP Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) =>
                        setFormData({ ...formData, zipCode: e.target.value })
                      }
                      placeholder="94102"
                      className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      required={!formData.useDefaultAddress}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scheduling */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b border-slate-200">
              Scheduling
            </h3>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 border-2 border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition">
                <input
                  type="radio"
                  name="scheduling"
                  checked={formData.schedulingType === "flexible"}
                  onChange={() =>
                    setFormData({ ...formData, schedulingType: "flexible" })
                  }
                  className="mt-1 w-5 h-5 text-teal-600"
                />
                <div>
                  <p className="font-medium text-slate-900">I'm flexible</p>
                  <p className="text-sm text-slate-600">
                    Work with the pro to find a good time
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition">
                <input
                  type="radio"
                  name="scheduling"
                  checked={formData.schedulingType === "asap"}
                  onChange={() =>
                    setFormData({ ...formData, schedulingType: "asap" })
                  }
                  className="mt-1 w-5 h-5 text-teal-600"
                />
                <div>
                  <p className="font-medium text-slate-900">
                    As soon as possible
                  </p>
                  <p className="text-sm text-slate-600">
                    Get the job done urgently
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition">
                <input
                  type="radio"
                  name="scheduling"
                  checked={formData.schedulingType === "specific"}
                  onChange={() =>
                    setFormData({ ...formData, schedulingType: "specific" })
                  }
                  className="mt-1 w-5 h-5 text-teal-600"
                />
                <div className="flex-1">
                  <p className="font-medium text-slate-900 mb-3">Pick a date</p>

                  {formData.schedulingType === "specific" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Preferred Date
                        </label>
                        <input
                          type="date"
                          value={formData.preferredDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              preferredDate: e.target.value,
                            })
                          }
                          className="w-full border-2 border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Backup Date (Optional)
                        </label>
                        <input
                          type="date"
                          value={formData.backupDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              backupDate: e.target.value,
                            })
                          }
                          className="w-full border-2 border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Special Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b border-slate-200">
              Preferences & Special Requirements
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex items-center gap-3 p-4 border-2 border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition">
                <input
                  type="checkbox"
                  checked={formData.allowMultiplePros}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      allowMultiplePros: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-teal-600 rounded"
                />
                <span className="text-sm font-medium text-slate-900">
                  Let multiple pros send quotes
                </span>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition">
                <input
                  type="checkbox"
                  checked={formData.needMaterials}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      needMaterials: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-teal-600 rounded"
                />
                <span className="text-sm font-medium text-slate-900">
                  Need materials included
                </span>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition">
                <input
                  type="checkbox"
                  checked={formData.mustBeLicensed}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mustBeLicensed: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-teal-600 rounded"
                />
                <span className="text-sm font-medium text-slate-900">
                  Must be licensed pro
                </span>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition">
                <input
                  type="checkbox"
                  checked={formData.weekendAvailability}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      weekendAvailability: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-teal-600 rounded"
                />
                <span className="text-sm font-medium text-slate-900">
                  Weekend availability
                </span>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition">
                <input
                  type="checkbox"
                  checked={formData.sameDayAvailability}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sameDayAvailability: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-teal-600 rounded"
                />
                <span className="text-sm font-medium text-slate-900">
                  Same-day service preferred
                </span>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition">
                <input
                  type="checkbox"
                  checked={formData.petsInHome}
                  onChange={(e) =>
                    setFormData({ ...formData, petsInHome: e.target.checked })
                  }
                  className="w-5 h-5 text-teal-600 rounded"
                />
                <span className="text-sm font-medium text-slate-900">
                  Pets in home
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Parking Info (Optional)
              </label>
              <input
                type="text"
                value={formData.parkingInfo}
                onChange={(e) =>
                  setFormData({ ...formData, parkingInfo: e.target.value })
                }
                placeholder="e.g., Street parking available, visitor spots in front"
                className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b border-slate-200">
              Notifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex items-center gap-3 p-4 border-2 border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition">
                <input
                  type="checkbox"
                  checked={formData.notifyViaSMS}
                  onChange={(e) =>
                    setFormData({ ...formData, notifyViaSMS: e.target.checked })
                  }
                  className="w-5 h-5 text-teal-600 rounded"
                />
                <span className="text-sm font-medium text-slate-900">
                  SMS notifications
                </span>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition">
                <input
                  type="checkbox"
                  checked={formData.notifyViaEmail}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notifyViaEmail: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-teal-600 rounded"
                />
                <span className="text-sm font-medium text-slate-900">
                  Email updates
                </span>
              </label>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex gap-3">
              <Info size={20} className="text-blue-600 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">✨ What happens next?</p>
                <ul className="text-blue-700 space-y-1">
                  <li>• Licensed professionals will review your job</li>
                  <li>• You'll receive quotes within 24 hours</li>
                  <li>• Compare quotes and choose the best fit</li>
                  <li>• Message pros directly to discuss details</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-slate-200 -mx-6 px-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-teal-700 hover:to-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-teal-500/30"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isEditing ? "Updating Job..." : "Posting Job..."}
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  {isEditing ? "Update Job" : "Post Job"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}