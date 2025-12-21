//levlpro-mvp\src\components\ProviderDashboard\QuoteBuilder\components\AttachmentUploader.jsx
import { useState } from "react";
import { Upload, X, Image, FileText, Video, Paperclip } from "lucide-react";
import { theme } from "../../../../styles/theme";

export default function AttachmentUploader({ attachments, onChange }) {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);

    // Simulate upload - in production, upload to Supabase Storage
    const newAttachments = files.map((file, i) => ({
      id: Date.now() + i,
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file), // Temporary URL
      uploadedAt: new Date().toISOString(),
    }));

    setTimeout(() => {
      onChange([...attachments, ...newAttachments]);
      setUploading(false);
    }, 1000);
  };

  const handleRemove = (idOrUrl) => {
    onChange(attachments.filter((a) => {
      // Handle both objects with ids and plain URL strings
      const itemId = a.id || a;
      return itemId !== idOrUrl;
    }));
  };

  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return <Image size={20} />;
    if (type.startsWith("video/")) return <Video size={20} />;
    if (type.includes("pdf")) return <FileText size={20} />;
    return <Paperclip size={20} />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <label className="block">
        <input
          type="file"
          multiple
          accept="image/*,video/*,.pdf"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
            uploading
              ? "border-blue-300 bg-blue-50"
              : "border-slate-300 hover:border-blue-400 hover:bg-blue-50"
          }`}
        >
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className={uploading ? "text-blue-600 animate-pulse" : "text-slate-400"} size={32} />
          </div>
          <p className="font-semibold text-slate-900 mb-1">
            {uploading ? "Uploading..." : "Click to upload files"}
          </p>
          <p className="text-sm text-slate-600">
            Photos, videos, or PDFs up to 10MB each
          </p>
        </div>
      </label>

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <p className={`${theme.text.label} mb-2`}>
            Attachments ({attachments.length})
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {attachments.map((file, index) => (
              <AttachmentCard 
                key={file.id || file || index} 
                file={file} 
                onRemove={() => handleRemove(file.id || file)} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AttachmentCard({ file, onRemove }) {
  // Handle both file objects and simple URL strings
  const fileType = file.type || '';
  const fileName = file.name || 'Attachment';
  const fileUrl = file.url || file;
  const fileSize = file.size || 0;
  
  const isImage = fileType.startsWith("image/") || (!fileType && typeof fileUrl === 'string');

  return (
    <div className="border-2 border-slate-200 rounded-lg overflow-hidden hover:border-blue-300 transition">
      {isImage ? (
        <div className="relative h-32 bg-slate-100">
          <img src={fileUrl} alt={fileName} className="w-full h-full object-cover" />
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="p-4 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="bg-slate-200 text-slate-600 p-3 rounded-lg">
              {fileType.includes("pdf") ? <FileText size={20} /> : <Paperclip size={20} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 truncate text-sm">{fileName}</p>
              {fileSize > 0 && <p className="text-xs text-slate-500">{formatFileSize(fileSize)}</p>}
            </div>
            <button
              onClick={onRemove}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}