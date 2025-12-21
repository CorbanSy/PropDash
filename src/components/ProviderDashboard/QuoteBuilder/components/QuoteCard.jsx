//levlpro-mvp\src\components\ProviderDashboard\QuoteBuilder\components\QuoteCard.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Edit2,
  Copy,
  Trash2,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  MoreVertical,
  ExternalLink,
} from "lucide-react";
import { theme } from "../../../../styles/theme";
import { formatCurrency } from "../utils/quoteCalculations";

export default function QuoteCard({ quote, onUpdate }) {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusBadge = (status) => {
    switch (status) {
      case "draft":
        return { badge: theme.badge.neutral, icon: <Edit2 size={14} />, text: "Draft" };
      case "sent":
        return { badge: theme.badge.warning, icon: <Clock size={14} />, text: "Sent" };
      case "viewed":
        return { badge: theme.badge.info, icon: <Eye size={14} />, text: "Viewed" };
      case "approved":
        return { badge: theme.badge.success, icon: <CheckCircle2 size={14} />, text: "Approved" };
      case "declined":
        return { badge: theme.badge.error, icon: <XCircle size={14} />, text: "Declined" };
      default:
        return { badge: theme.badge.neutral, icon: <FileText size={14} />, text: status };
    }
  };

  const handleDuplicate = async () => {
    // TODO: Implement duplicate functionality
    console.log("Duplicate quote:", quote.id);
    setShowMenu(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this quote?")) {
      // TODO: Implement delete
      console.log("Delete quote:", quote.id);
      setShowMenu(false);
      onUpdate();
    }
  };

  const handleSend = async () => {
    // TODO: Implement send quote
    console.log("Send quote:", quote.id);
    setShowMenu(false);
  };

  const status = getStatusBadge(quote.status);
  const total = quote.total ? formatCurrency(quote.total / 100) : "$0.00";
  const createdDate = new Date(quote.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className={`${theme.card.base} ${theme.card.padding} ${theme.card.hover} relative`}>
      <div className="flex items-start justify-between gap-4">
        {/* Left Side - Quote Info */}
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-slate-100 text-slate-600 p-3 rounded-lg">
              <FileText size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-slate-900 text-lg">
                  {quote.service_name || "Untitled Quote"}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full font-medium border ${status.badge}`}>
                  <span className="flex items-center gap-1">
                    {status.icon}
                    {status.text}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span>Quote #{quote.quote_number || quote.id.slice(0, 8)}</span>
                <span>•</span>
                <span>{quote.client_name || "No client"}</span>
                <span>•</span>
                <span>{createdDate}</span>
              </div>
            </div>
          </div>

          {/* Quote Details */}
          {quote.description && (
            <p className="text-sm text-slate-600 mb-3 line-clamp-2">{quote.description}</p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-slate-500">Items:</span>{" "}
              <span className="font-semibold text-slate-900">
                {quote.line_items?.length || 0}
              </span>
            </div>
            {quote.viewed_at && (
              <div>
                <span className="text-slate-500">Viewed:</span>{" "}
                <span className="font-semibold text-slate-900">
                  {new Date(quote.viewed_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            )}
            {quote.version && quote.version > 1 && (
              <div>
                <span className="text-slate-500">Version:</span>{" "}
                <span className="font-semibold text-slate-900">{quote.version}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Price & Actions */}
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-900 mb-2">{total}</p>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Link
              to={`/provider/quotes/${quote.id}`}
              className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
              title="View/Edit"
            >
              <Edit2 size={16} className="text-slate-600" />
            </Link>

            {quote.status === "draft" && (
              <button
                onClick={handleSend}
                className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition"
                title="Send Quote"
              >
                <Send size={16} className="text-blue-600" />
              </button>
            )}

            {(quote.status === "sent" || quote.status === "approved") && (
              <a
                href={`/quotes/${quote.id}/view`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-purple-100 rounded-lg hover:bg-purple-200 transition"
                title="View Client Link"
              >
                <ExternalLink size={16} className="text-purple-600" />
              </a>
            )}

            {/* More Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
              >
                <MoreVertical size={16} className="text-slate-600" />
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-20">
                    <button
                      onClick={handleDuplicate}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                    >
                      <Copy size={16} />
                      Duplicate
                    </button>
                    <button
                      onClick={() => {
                        // TODO: View version history
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                    >
                      <Clock size={16} />
                      Version History
                    </button>
                    <div className="border-t border-slate-200 my-1"></div>
                    <button
                      onClick={handleDelete}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}