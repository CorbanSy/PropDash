// src/components/ProviderDashboard/Jobs/components/JobPhotos.jsx
import { useState, useEffect } from "react";
import { Upload, X, Image as ImageIcon, Trash2 } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { supabase } from "../../../../lib/supabaseClient";

export default function JobPhotos({ job, onRefresh }) {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    fetchPhotos();
  }, [job.id]);

  const fetchPhotos = async () => {
    const { data } = await supabase
      .from("job_photos")
      .select("*")
      .eq("job_id", job.id)
      .order("created_at", { ascending: false });

    if (data) setPhotos(data);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);

    for (const file of files) {
      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${job.id}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("job-photos")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        continue;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("job-photos")
        .getPublicUrl(fileName);

      // Save to database
      await supabase.from("job_photos").insert({
        job_id: job.id,
        photo_url: urlData.publicUrl,
        file_path: fileName,
      });
    }

    setUploading(false);
    fetchPhotos();
  };

  const handleDelete = async (photo) => {
    if (!confirm("Delete this photo?")) return;

    // Delete from storage
    await supabase.storage
      .from("job-photos")
      .remove([photo.file_path]);

    // Delete from database
    await supabase
      .from("job_photos")
      .delete()
      .eq("id", photo.id);

    fetchPhotos();
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <h3 className={`${theme.text.h4} mb-3`}>Upload Photos</h3>
        <p className="text-sm text-slate-600 mb-4">
          Document before/after photos, issues, or completed work
        </p>

        <label className="block">
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition cursor-pointer">
            <Upload className="mx-auto text-slate-400 mb-2" size={32} />
            <p className="text-sm font-medium text-slate-700 mb-1">
              {uploading ? "Uploading..." : "Click to upload photos"}
            </p>
            <p className="text-xs text-slate-500">
              PNG, JPG, or HEIC up to 10MB
            </p>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Photos Grid */}
      {photos.length === 0 ? (
        <div className={`${theme.card.base} ${theme.card.padding} text-center py-8`}>
          <ImageIcon className="text-slate-400 mx-auto mb-3" size={32} />
          <p className="text-slate-600">No photos yet</p>
          <p className="text-sm text-slate-500 mt-1">Upload photos to document your work</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative group aspect-square rounded-lg overflow-hidden bg-slate-100 cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={photo.photo_url}
                alt="Job photo"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(photo);
                  }}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Viewer Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition"
          >
            <X size={24} />
          </button>
          <img
            src={selectedPhoto.photo_url}
            alt="Job photo"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}