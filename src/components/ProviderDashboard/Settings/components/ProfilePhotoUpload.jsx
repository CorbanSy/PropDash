// src/components/ProviderDashboard/Settings/components/ProfilePhotoUpload.jsx
import { useState, useRef } from "react";
import { Camera, Upload, X, User } from "lucide-react";
import { supabase } from "../../../../lib/supabaseClient";
import { uploadFile, deleteFile } from "../utils/settingsHelpers";

export default function ProfilePhotoUpload({ currentPhoto, userId, onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentPhoto);
  const fileInputRef = useRef(null);

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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-100 p-2.5 rounded-lg">
          <Camera className="text-purple-600" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Profile Photo</h3>
          <p className="text-sm text-slate-600">
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
                <User className="text-slate-400" size={48} />
              </div>
            )}
          </div>

          {preview && !uploading && (
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition shadow-lg"
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
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Upload size={18} />
            {preview ? "Change Photo" : "Upload Photo"}
          </button>
          <p className="text-xs text-slate-500 mt-2">
            JPG, PNG or HEIC. Max size 5MB. Recommended: 400x400px
          </p>

          {/* Trust Building Info */}
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs text-green-800 font-medium">
              ⭐ Providers with photos get 30% more bookings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}