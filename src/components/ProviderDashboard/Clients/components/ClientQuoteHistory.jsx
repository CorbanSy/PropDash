// src/components/ProviderDashboard/Clients/components/ClientQuoteHistory.jsx
import { useState, useEffect } from "react";
import { FileText, CheckCircle2, Clock, XCircle, Eye } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { supabase } from "../../../../lib/supabaseClient";
import useAuth from "../../../../hooks/useAuth";
import { formatCurrency } from "../utils/clientCalculations";

export default function ClientQuoteHistory({ client }) {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id && client?.id) {
      fetchQuotes();
    } else {
      setLoading(false);
    }
  }, [client?.id, user?.id]);

  const fetchQuotes = async () => {
    if (!user?.id || !client?.id) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("provider_id", user.id)
      .eq("customer_id", client.id) // ✅ FIXED: Changed from client_id to customer_id
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching quotes:", error);
      setLoading(false);
      return;
    }

    if (data) setQuotes(data);
    setLoading(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return {
          badge: theme.badge.success,
          icon: <CheckCircle2 size={14} />,
          text: "Approved",
        };
      case "sent":
        return {
          badge: theme.badge.info,
          icon: <Eye size={14} />,
          text: "Sent",
        };
      case "declined":
        return {
          badge: theme.badge.error,
          icon: <XCircle size={14} />,
          text: "Declined",
        };
      case "draft":
        return {
          badge: theme.badge.neutral,
          icon: <Clock size={14} />,
          text: "Draft",
        };
      default:
        return {
          badge: theme.badge.neutral,
          icon: <Clock size={14} />,
          text: status,
        };
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading quotes...</div>;
  }

  if (!user) {
    return <div className="text-center py-8 text-slate-600">Loading user data...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={theme.text.h3}>Quote History ({quotes.length})</h3>
      </div>

      {quotes.length === 0 ? (
        <div className={`${theme.card.base} ${theme.card.padding} text-center py-12`}>
          <FileText className="text-slate-400 mx-auto mb-3" size={32} />
          <p className="text-slate-600">No quotes yet</p>
          <p className="text-sm text-slate-500 mt-1">
            Create a quote for this client to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {quotes.map((quote) => {
            const status = getStatusBadge(quote.status);
            return (
              <div key={quote.id} className={`${theme.card.base} ${theme.card.padding}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-slate-900">
                        {quote.service_name || `Quote #${quote.id.slice(0, 8)}`}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold border flex items-center gap-1 ${status.badge}`}>
                        {status.icon}
                        {status.text}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">
                      {quote.description || "No description"}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Created {new Date(quote.created_at).toLocaleDateString()}</span>
                      {quote.line_items?.length > 0 && (
                        <span>• {quote.line_items.length} line item{quote.line_items.length > 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-900">
                      {formatCurrency(quote.total || 0)}
                    </p>
                    {quote.subtotal !== quote.total && (
                      <p className="text-xs text-slate-500">
                        Subtotal: {formatCurrency(quote.subtotal || 0)}
                      </p>
                    )}
                    <button className="text-sm text-blue-600 hover:text-blue-700 mt-2">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}