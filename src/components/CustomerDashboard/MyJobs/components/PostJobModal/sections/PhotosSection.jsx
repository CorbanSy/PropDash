//levlpro-mvp\src\components\CustomerDashboard\MyJobs\components\PostJobModal\sections\PhotosSection.jsx
import { Upload, X } from "lucide-react";
import { MAX_PHOTOS } from "../utils/constants";

export default function PhotosSection({
  formData,
  updateFormData,
  existingPhotos,
  setExistingPhotos,
  isEditing,
  setError,
}) {
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalPhotos = formData.photos.length + existingPhotos.length;

    if (totalPhotos + files.length > MAX_PHOTOS) {
      setError(`Maximum ${MAX_PHOTOS} photos allowed`);
      setTimeout(() => setError(""), 3000);
      return;
    }

    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    updateFormData({ photos: [...formData.photos, ...newPhotos] });
  };

  const removePhoto = (index) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    updateFormData({ photos: newPhotos });
  };

  const removeExistingPhoto = (index) => {
    const newExistingPhotos = existingPhotos.filter((_, i) => i !== index);
    setExistingPhotos(newExistingPhotos);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b border-slate-200">
        Photos (Optional)
      </h3>

      {existingPhotos.length > 0 && (
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">
            Current Photos:
          </p>
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
            Click to upload {isEditing ? "additional " : ""}photos (up to{" "}
            {MAX_PHOTOS} total)
          </p>
          <p className="text-sm text-slate-500">
            PNG, JPG, MP4 up to 10MB each
          </p>
        </label>
      </div>

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
  );
}