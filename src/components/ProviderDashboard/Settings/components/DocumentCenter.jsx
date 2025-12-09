// src/components/ProviderDashboard/Settings/components/DocumentCenter.jsx
import { useState, useEffect } from "react";
import { FileText, Upload, CheckCircle2, Clock, XCircle, Download, Trash2 } from "lucide-react";
import { supabase } from "../../../../lib/supabaseClient";
import { uploadFile, deleteFile } from "../utils/settingsHelpers";

const DOCUMENT_TYPES = [
  {
    id: "license",
    name: "Professional License",
    description: "Upload your contractor license (C-class, B license, etc.)",
    required: true,
  },
  {
    id: "insurance",
    name: "Insurance Certificate",
    description: "General liability insurance certificate",
    required: true,
  },
  {
    id: "w9",
    name: "W-9 Tax Form",
    description: "For tax reporting and 1099 generation",
    required: false,
  },
  {
    id: "id",
    name: "Government ID",
    description: "Driver's license or state ID for verification",
    required: true,
  },
  {
    id: "certification",
    name: "Certifications",
    description: "EPA, OSHA, or specialty certifications",
    required: false,
  },
];

export default function DocumentCenter({ providerData, onUpdate }) {
  const [documents, setDocuments] = useState({});
  const [uploading, setUploading] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, [providerData.id]);

  const fetchDocuments = async () => {
    const { data } = await supabase
      .from("provider_documents")
      .select("*")
      .eq("provider_id", providerData.id);

    if (data) {
      const docsMap = {};
      data.forEach((doc) => {
        docsMap[doc.document_type] = doc;
      });
      setDocuments(docsMap);
    }
  };

  const handleUpload = async (documentType, file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/heic",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload PDF, JPG, PNG, or HEIC files only");
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setUploading(documentType);

    try {
      // Delete old document if exists
      if (documents[documentType]?.file_path) {
        await deleteFile("provider-documents", documents[documentType].file_path).catch(() => {});
      }

      // Upload new document
      const { url, path } = await uploadFile(
        file,
        "provider-documents",
        documentType,
        providerData.id
      );

      // Save to database
      const { data, error } = await supabase
        .from("provider_documents")
        .upsert({
          provider_id: providerData.id,
          document_type: documentType,
          file_url: url,
          file_path: path,
          status: "pending",
          uploaded_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setDocuments({ ...documents, [documentType]: data });
      onUpdate();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload document. Please try again.");
    }

    setUploading(null);
  };

  const handleDelete = async (documentType) => {
    if (!confirm("Delete this document?")) return;

    const doc = documents[documentType];
    if (!doc) return;

    try {
      // Delete from storage
      await deleteFile("provider-documents", doc.file_path);

      // Delete from database
      await supabase
        .from("provider_documents")
        .delete()
        .eq("id", doc.id);

      // Update local state
      const newDocs = { ...documents };
      delete newDocs[documentType];
      setDocuments(newDocs);
      onUpdate();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete document. Please try again.");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      approved: {
        icon: <CheckCircle2 size={16} />,
        text: "Approved",
        color: "bg-green-100 text-green-700 border-green-200",
      },
      pending: {
        icon: <Clock size={16} />,
        text: "Pending Review",
        color: "bg-amber-100 text-amber-700 border-amber-200",
      },
      rejected: {
        icon: <XCircle size={16} />,
        text: "Rejected",
        color: "bg-red-100 text-red-700 border-red-200",
      },
    };

    return badges[status] || badges.pending;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-100 p-2.5 rounded-lg">
            <FileText className="text-green-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Document Center
            </h3>
            <p className="text-sm text-slate-600">
              Upload and manage verification documents
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>🔒 Secure & Private:</strong> All documents are encrypted and only reviewed by our verification team. We never share your documents.
          </p>
        </div>
      </div>

      {/* Document Upload Cards */}
      <div className="space-y-4">
        {DOCUMENT_TYPES.map((docType) => {
          const doc = documents[docType.id];
          const status = doc ? getStatusBadge(doc.status) : null;

          return (
            <div
              key={docType.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-slate-900">
                      {docType.name}
                    </h4>
                    {docType.required && (
                      <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded font-semibold">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">{docType.description}</p>
                </div>

                {doc && status && (
                  <span
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border ${status.color}`}
                  >
                    {status.icon}
                    {status.text}
                  </span>
                )}
              </div>

              {/* Document Info */}
              {doc ? (
                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900 mb-1">
                          {doc.file_path.split("/").pop()}
                        </p>
                        <p className="text-xs text-slate-600">
                          Uploaded{" "}
                          {new Date(doc.uploaded_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Download size={18} />
                        </a>
                        <button
                          onClick={() => handleDelete(docType.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {doc.status === "rejected" && doc.rejection_reason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm font-semibold text-red-900 mb-1">
                        Rejection Reason:
                      </p>
                      <p className="text-sm text-red-800">
                        {doc.rejection_reason}
                      </p>
                    </div>
                  )}

                  {/* Replace Button */}
                  <label className="block">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.heic"
                      onChange={(e) =>
                        handleUpload(docType.id, e.target.files[0])
                      }
                      disabled={uploading === docType.id}
                      className="hidden"
                    />
                    <span className="inline-block w-full text-center px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition cursor-pointer font-medium">
                      {uploading === docType.id
                        ? "Uploading..."
                        : "Replace Document"}
                    </span>
                  </label>
                </div>
              ) : (
                // Upload Button
                <label className="block">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.heic"
                    onChange={(e) => handleUpload(docType.id, e.target.files[0])}
                    disabled={uploading === docType.id}
                    className="hidden"
                  />
                  <span className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer font-semibold">
                    <Upload size={18} />
                    {uploading === docType.id
                      ? "Uploading..."
                      : "Upload Document"}
                  </span>
                </label>
              )}

              <p className="text-xs text-slate-500 mt-2">
                Accepted formats: PDF, JPG, PNG, HEIC (max 10MB)
              </p>
            </div>
          );
        })}
      </div>

      {/* Verification Status */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <h4 className="font-semibold text-slate-900 mb-3">
          Verification Progress
        </h4>
        <div className="space-y-2">
          {DOCUMENT_TYPES.filter((d) => d.required).map((docType) => {
            const doc = documents[docType.id];
            const uploaded = !!doc;
            const approved = doc?.status === "approved";

            return (
              <div
                key={docType.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-slate-700">{docType.name}</span>
                <span
                  className={`font-medium ${
                    approved
                      ? "text-green-600"
                      : uploaded
                      ? "text-amber-600"
                      : "text-slate-400"
                  }`}
                >
                  {approved ? "✓ Verified" : uploaded ? "⏳ Pending" : "Not Uploaded"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}