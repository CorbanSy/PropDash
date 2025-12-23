//levlpro-mvp\src\components\CustomerDashboard\Settings\components\ProfilePhotoUpload.jsx
import { useState, useRef, useEffect } from "react";
import { Camera, Upload, X, User } from "lucide-react";
import { supabase } from "../../../../lib/supabaseClient";
import { theme } from "../../../../styles/theme";

export default function ProfilePhotoUpload({
  currentPhoto,
  userId,
  onUploadSuccess,
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentPhoto);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setPreview(currentPhoto);
  }, [currentPhoto]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `avatar-${Date.now()}.${fileExt}`;
      const path = `${userId}/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("customer-photos")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from("customer-photos")
        .getPublicUrl(path);

      // Update database - only update profile_photo column (not profile_photo_path)
      const { error: dbError } = await supabase
        .from("customers")
        .update({
          profile_photo: data.publicUrl,
        })
        .eq("id", userId);

      if (dbError) throw dbError;

      setPreview(data.publicUrl);
      
      // Dispatch event to update dashboard in real-time
      window.dispatchEvent(new Event("profileUpdated"));
      
      onUploadSuccess?.();
      alert("Profile photo updated successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload photo. Please try again.");
    }

    setUploading(false);
  };

  const handleRemove = async () => {
    if (!confirm("Remove profile photo?")) return;

    setUploading(true);

    try {
      // Remove from storage if exists
      if (currentPhoto) {
        const pathParts = currentPhoto.split("/");
        const path = `${pathParts[pathParts.length - 2]}/${pathParts[pathParts.length - 1]}`;
        await supabase.storage.from("customer-photos").remove([path]);
      }

      // Update database - only update profile_photo column (not profile_photo_path)
      const { error: dbError } = await supabase
        .from("customers")
        .update({ profile_photo: null })
        .eq("id", userId);

      if (dbError) throw dbError;

      setPreview(null);
      
      // Dispatch event to update dashboard in real-time
      window.dispatchEvent(new Event("profileUpdated"));
      
      onUploadSuccess?.();
      alert("Profile photo removed successfully!");
    } catch (err) {
      console.error("Remove error:", err);
      alert("Failed to remove photo. Please try again.");
    }

    setUploading(false);
  };

  return (
    <div className={`${theme.card.base} ${theme.card.padding}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-100 p-2.5 rounded-lg">
          <Camera className="text-purple-600" size={20} />
        </div>
        <h3 className={theme.text.h4}>Profile Photo</h3>
      </div>

      <div className="flex items-center gap-6">
        {/* Profile Photo Preview */}
        <div className="relative">
          <div className="w-28 h-28 rounded-xl bg-slate-100 border-2 border-slate-300 overflow-hidden">
            {preview ? (
              <img src={preview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="text-secondary-400" size={40} />
              </div>
            )}
          </div>

          {/* Remove Button */}
          {preview && !uploading && (
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-error-600 text-white p-1.5 rounded-full hover:bg-error-700 transition shadow-lg"
              title="Remove photo"
            >
              <X size={14} />
            </button>
          )}

          {/* Loading Overlay */}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileSelect}
            disabled={uploading}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={`w-full ${theme.button.primary} justify-center ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload size={18} />
                {preview ? "Change Photo" : "Upload Photo"}
              </>
            )}
          </button>
          <p className={`${theme.text.caption} mt-2 text-center`}>
            Max file size: 5MB. Formats: JPG, PNG, GIF
          </p>
        </div>
      </div>
    </div>
  );
}