import { useState, useRef, useEffect } from "react";
import { Camera, Upload, X, User } from "lucide-react";
import { supabase } from "../../../../lib/supabaseClient";
import { uploadFile, deleteFile } from "../utils/settingsHelpers";
import { theme } from "../../../../styles/theme";

export default function ProfilePhotoUpload({ currentPhoto, userId, onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentPhoto);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setPreview(currentPhoto);
  }, [currentPhoto]);
  
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      // Delete old photo if exists
      if (currentPhoto) {
        const oldPath = currentPhoto.split("/").slice(-3).join("/");
        await deleteFile("provider-photos", oldPath).catch(() => {});
      }

      // Upload new photo
      const { url, path } = await uploadFile(file, "provider-photos", "profiles", userId);

      // Update database
      const { error } = await supabase
        .from("providers")
        .update({ profile_photo: url, profile_photo_path: path })
        .eq("id", userId);

      if (error) throw error;

      setPreview(url);
      onUploadSuccess();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload photo. Please try again.");
    }

    setUploading(false);
  };

  const handleRemove = async () => {
    if (!confirm("Remove profile photo?")) return;

    setUploading(true);

    try {
      // Delete from storage
      if (currentPhoto) {
        const oldPath = currentPhoto.split("/").slice(-3).join("/");
        await deleteFile("provider-photos", oldPath);
      }

      // Update database
      const { error } = await supabase
        .from("providers")
        .update({ profile_photo: null, profile_photo_path: null })
        .eq("id", userId);

      if (error) throw error;

      setPreview(null);
      onUploadSuccess();
    } catch (error) {
      console.error("Remove error:", error);
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
        <div>
          <h3 className={theme.text.h4}>Profile Photo</h3>
          <p className={`${theme.text.muted} text-sm`}>
            Upload a professional photo or business logo
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Photo Preview */}
        <div className="relative">
          <div className="w-32 h-32 rounded-2xl bg-slate-100 border-2 border-slate-300 overflow-hidden">
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="text-secondary-400" size={48} />
              </div>
            )}
          </div>

          {preview && !uploading && (
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-error-600 text-white p-1.5 rounded-full hover:bg-error-700 transition shadow-lg"
            >
              <X size={16} />
            </button>
          )}

          {uploading && (
            <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={`${theme.button.primary} w-full py-3 disabled:opacity-50 justify-center`}
          >
            <Upload size={18} />
            {preview ? "Change Photo" : "Upload Photo"}
          </button>
          <p className={`${theme.text.caption} mt-2`}>
            JPG, PNG or HEIC. Max size 5MB. Recommended: 400x400px
          </p>

          {/* Trust Building Info */}
          <div className="mt-4 bg-success-50 border border-success-200 rounded-lg p-3">
            <p className="text-xs text-success-800 font-medium">
              ⭐ Providers with photos get 30% more bookings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}