import { useState, useEffect } from "react";
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Download, 
  Trash2,
  AlertTriangle,
  Eye 
} from "lucide-react";
import { supabase } from "../../../../lib/supabaseClient";
import { uploadFile, deleteFile, createSignedUrl } from "../utils/settingsHelpers";
import { theme } from "../../../../styles/theme";

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
    id: "government_id",
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
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (providerData?.id) {
      fetchDocuments();
    }
  }, [providerData?.id]);

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
      "image/jpg",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload PDF, JPG, PNG, or HEIC files only");
      setTimeout(() => setError(""), 5000);
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      setTimeout(() => setError(""), 5000);
      return;
    }

    setUploading(documentType);
    setError("");

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
      const { data, error: dbError } = await supabase
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

      if (dbError) throw dbError;

      // Update local state
      setDocuments({ ...documents, [documentType]: data });
      
      // Show success message
      const docName = DOCUMENT_TYPES.find(d => d.id === documentType)?.name;
      setSuccess(`${docName} uploaded successfully!`);
      setTimeout(() => setSuccess(""), 3000);
      
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload document. Please try again.");
      setTimeout(() => setError(""), 5000);
    } finally {
      setUploading(null);
    }
  };

  const handleDownload = async (doc) => {
    try {
      const signedUrl = await createSignedUrl("provider-documents", doc.file_path, 60);
      window.open(signedUrl, "_blank");
    } catch (err) {
      console.error("Download error:", err);
      setError("Failed to download document");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDelete = async (documentType) => {
    if (!confirm("Delete this document? This action cannot be undone.")) return;

    const doc = documents[documentType];
    if (!doc) return;

    try {
      // Delete from storage
      await deleteFile("provider-documents", doc.file_path);

      // Delete from database
      const { error: dbError } = await supabase
        .from("provider_documents")
        .delete()
        .eq("id", doc.id);

      if (dbError) throw dbError;

      // Update local state
      const newDocs = { ...documents };
      delete newDocs[documentType];
      setDocuments(newDocs);
      
      setSuccess("Document deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
      
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete document. Please try again.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      approved: {
        icon: <CheckCircle2 size={16} />,
        text: "Approved",
        color: "bg-success-100 text-success-700 border-success-200",
      },
      pending: {
        icon: <Clock size={16} />,
        text: "Pending Review",
        color: "bg-warning-100 text-warning-700 border-warning-200",
      },
      rejected: {
        icon: <XCircle size={16} />,
        text: "Rejected",
        color: "bg-error-100 text-error-700 border-error-200",
      },
    };

    return badges[status] || badges.pending;
  };

  // Calculate progress
  const requiredDocs = DOCUMENT_TYPES.filter(d => d.required);
  const uploadedRequired = requiredDocs.filter(d => documents[d.id]).length;
  const approvedRequired = requiredDocs.filter(d => documents[d.id]?.status === "approved").length;
  const progressPercentage = (uploadedRequired / requiredDocs.length) * 100;

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {success && (
        <div className={`${theme.alert.success} flex items-center gap-3`}>
          <CheckCircle2 size={20} />
          <span className="font-medium">{success}</span>
        </div>
      )}
      {error && (
        <div className={`${theme.alert.error} flex items-center gap-3`}>
          <AlertTriangle size={20} />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Header */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-success-100 p-2.5 rounded-lg">
            <FileText className="text-success-600" size={20} />
          </div>
          <div>
            <h3 className={theme.text.h4}>
              Document Center
            </h3>
            <p className={`${theme.text.muted} text-sm`}>
              Upload and manage verification documents
            </p>
          </div>
        </div>

        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <p className="text-sm text-primary-900">
            <strong>🔒 Secure & Private:</strong> All documents are encrypted and only reviewed by our verification team. We never share your documents.
          </p>
        </div>
      </div>

      {/* Verification Progress */}
      <div className="bg-gradient-to-br from-success-50 to-emerald-50 border-2 border-success-200 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className={`${theme.text.h4} mb-1`}>
              Verification Progress
            </h4>
            <p className={`${theme.text.caption}`}>
              {approvedRequired === requiredDocs.length 
                ? "✅ All required documents verified!" 
                : `${uploadedRequired} of ${requiredDocs.length} required documents uploaded`}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-success-600">
              {Math.round(progressPercentage)}%
            </div>
            <div className={`${theme.text.caption}`}>Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
          <div
            className="bg-gradient-to-r from-success-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Document Checklist */}
        <div className="space-y-2">
          {requiredDocs.map((docType) => {
            const doc = documents[docType.id];
            const uploaded = !!doc;
            const approved = doc?.status === "approved";
            const pending = doc?.status === "pending";
            const rejected = doc?.status === "rejected";

            return (
              <div
                key={docType.id}
                className="flex items-center justify-between text-sm bg-white rounded-lg p-3 border border-slate-200"
              >
                <span className="text-secondary-700 font-medium">{docType.name}</span>
                <span
                  className={`font-semibold flex items-center gap-1 ${
                    approved
                      ? "text-success-600"
                      : rejected
                      ? "text-error-600"
                      : pending
                      ? "text-warning-600"
                      : "text-secondary-400"
                  }`}
                >
                  {approved && <CheckCircle2 size={16} />}
                  {pending && <Clock size={16} />}
                  {rejected && <XCircle size={16} />}
                  {approved ? "Verified" : rejected ? "Rejected" : pending ? "Under Review" : "Not Uploaded"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Document Upload Cards */}
      <div>
        <h4 className={`${theme.text.h4} mb-4`}>Upload Documents</h4>
        <div className="space-y-4">
          {DOCUMENT_TYPES.map((docType) => {
            const doc = documents[docType.id];
            const status = doc ? getStatusBadge(doc.status) : null;

            return (
              <div
                key={docType.id}
                className={`${theme.card.base} ${theme.card.padding}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`${theme.text.h5}`}>
                        {docType.name}
                      </h4>
                      {docType.required && (
                        <span className="text-xs px-2 py-0.5 bg-error-100 text-error-700 rounded font-semibold">
                          Required
                        </span>
                      )}
                    </div>
                    <p className={`${theme.text.caption}`}>{docType.description}</p>
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
                          <p className="text-sm font-medium text-secondary-900 mb-1">
                            {doc.file_path.split("/").pop()}
                          </p>
                          <p className={`${theme.text.caption}`}>
                            Uploaded{" "}
                            {new Date(doc.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownload(doc)}
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition"
                            title="View document"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(docType.id)}
                            className="p-2 text-error-600 hover:bg-error-50 rounded-lg transition"
                            title="Delete document"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {doc.status === "rejected" && doc.rejection_reason && (
                      <div className="bg-error-50 border border-error-200 rounded-lg p-3">
                        <p className="text-sm font-semibold text-error-900 mb-1">
                          Rejection Reason:
                        </p>
                        <p className="text-sm text-error-800">
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
                      <span className={`${theme.button.secondaryOutline} inline-block w-full text-center disabled:opacity-50 ${
                        uploading === docType.id ? "cursor-not-allowed" : "cursor-pointer"
                      }`}>
                        {uploading === docType.id ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-secondary-400 border-t-transparent rounded-full animate-spin"></div>
                            Uploading...
                          </span>
                        ) : (
                          "Replace Document"
                        )}
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
                    <span className={`${theme.button.primary} inline-flex w-full justify-center disabled:opacity-50 ${
                      uploading === docType.id ? "cursor-not-allowed" : "cursor-pointer"
                    }`}>
                      {uploading === docType.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload size={18} />
                          Upload Document
                        </>
                      )}
                    </span>
                  </label>
                )}

                <p className={`${theme.text.caption} mt-2`}>
                  Accepted formats: PDF, JPG, PNG, HEIC (max 10MB)
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}