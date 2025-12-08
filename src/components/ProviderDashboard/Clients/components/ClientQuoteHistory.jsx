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
    fetchQuotes();
  }, [client.id]);

  const fetchQuotes = async () => {
    const { data } = await supabase
      .from("quotes")
      .select("*")
      .eq("provider_id", user.id)
      .eq("client_id", client.id)
      .order("created_at", { ascending: false });

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
                        Quote #{quote.quote_number || quote.id.slice(0, 8)}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold border flex items-center gap-1 ${status.badge}`}>
                        {status.icon}
                        {status.text}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">
                      {quote.description || "No description"}
                    </p>
                    <p className="text-xs text-slate-500">
                      Created {new Date(quote.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-900">
                      {formatCurrency(quote.total || 0)}
                    </p>
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