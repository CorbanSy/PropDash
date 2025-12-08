// src/components/ProviderDashboard/QuoteBuilder/components/VersionHistory.jsx
import { X, Clock, Eye, FileText, ChevronRight } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { formatCurrency } from "../utils/quoteCalculations";

export default function VersionHistory({ quote, onClose, onRestore }) {
  // Mock version history - in production, fetch from database
  const versions = [
    {
      version: 3,
      created_at: new Date().toISOString(),
      created_by: "You",
      changes: "Updated pricing and added travel fee",
      total: quote.total,
      status: "draft",
      isCurrent: true,
    },
    {
      version: 2,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: "You",
      changes: "Added paint touch-up line item",
      total: quote.total - 7500,
      status: "viewed",
      isCurrent: false,
    },
    {
      version: 1,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: "You",
      changes: "Initial quote created",
      total: quote.total - 15000,
      status: "sent",
      isCurrent: false,
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "draft":
        return "bg-slate-100 text-slate-700";
      case "sent":
        return "bg-blue-100 text-blue-700";
      case "viewed":
        return "bg-purple-100 text-purple-700";
      case "approved":
        return "bg-green-100 text-green-700";
      case "declined":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-slate-200 p-6 flex items-start justify-between">
          <div>
            <h2 className={theme.text.h2}>Version History</h2>
            <p className={theme.text.caption}>
              View and restore previous versions of this quote
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X size={24} />
          </button>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-slate-200"></div>

            <div className="space-y-6">
              {versions.map((version, index) => (
                <div key={version.version} className="relative pl-12">
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      version.isCurrent
                        ? "bg-blue-100 border-4 border-blue-600"
                        : "bg-white border-4 border-slate-300"
                    }`}
                  >
                    {version.isCurrent ? (
                      <FileText size={16} className="text-blue-600" />
                    ) : (
                      <Clock size={16} className="text-slate-400" />
                    )}
                  </div>

                  {/* Version Card */}
                  <div
                    className={`border-2 rounded-lg p-4 ${
                      version.isCurrent
                        ? "border-blue-300 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900">
                            Version {version.version}
                          </h3>
                          {version.isCurrent && (
                            <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded font-medium">
                              Current
                            </span>
                          )}
                          <span
                            className={`text-xs px-2 py-1 rounded font-medium ${getStatusBadge(
                              version.status
                            )}`}
                          >
                            {version.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{formatDate(version.created_at)}</p>
                      </div>
                      <p className="text-lg font-bold text-slate-900">
                        {formatCurrency(version.total / 100)}
                      </p>
                    </div>

                    <p className="text-sm text-slate-700 mb-3">{version.changes}</p>

                    <div className="flex items-center gap-2">
                      {!version.isCurrent && (
                        <>
                          <button
                            onClick={() => onRestore(version.version)}
                            className="text-sm px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-medium"
                          >
                            Restore This Version
                          </button>
                          <button className="text-sm px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium">
                            <Eye size={14} className="inline mr-1" />
                            Preview
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 bg-slate-50">
          <div className={theme.alert.info}>
            <Clock className="flex-shrink-0" size={20} />
            <div className="text-xs">
              <p className="font-semibold mb-1">Version History Notes</p>
              <ul className="space-y-1">
                <li>• Versions are automatically saved when significant changes are made</li>
                <li>• Restoring a version creates a new version (doesn't delete history)</li>
                <li>• Client-viewed versions are marked accordingly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}