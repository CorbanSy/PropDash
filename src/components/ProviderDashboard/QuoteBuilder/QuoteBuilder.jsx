// src/components/ProviderDashboard/QuoteBuilder/QuoteBuilder.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Edit2,
  Copy,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import useAuth from "../../../hooks/useAuth";
import { theme } from "../../../styles/theme";
import QuoteCard from "./components/QuoteCard";

export default function QuoteBuilder() {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewQuoteModal, setShowNewQuoteModal] = useState(false);

  useEffect(() => {
        if (user) {
        fetchQuotes();
      }
    }, [user]);

  const fetchQuotes = async () => {
    // ✅ Guard clause - return early if no user
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .eq("provider_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching quotes:", error);
      } else if (data) {
        setQuotes(data);
      }
    } catch (err) {
      console.error("Exception fetching quotes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter quotes
  const filteredQuotes = quotes.filter((quote) => {
    // Status filter
    if (statusFilter !== "all" && quote.status !== statusFilter) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      return (
        quote.client_name?.toLowerCase().includes(search) ||
        quote.service_name?.toLowerCase().includes(search) ||
        quote.quote_number?.toLowerCase().includes(search)
      );
    }

    return true;
  });

  // Calculate stats
  const stats = {
    total: quotes.length,
    draft: quotes.filter((q) => q.status === "draft").length,
    sent: quotes.filter((q) => q.status === "sent").length,
    approved: quotes.filter((q) => q.status === "approved").length,
    declined: quotes.filter((q) => q.status === "declined").length,
    totalValue: quotes
      .filter((q) => q.status === "approved")
      .reduce((sum, q) => sum + (q.total || 0), 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={theme.text.body}>Loading quotes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className={theme.text.h1}>Quotes</h1>
          <p className={`${theme.text.body} mt-1`}>
            Create, manage, and track your quotes
          </p>
        </div>
        <Link
          to="/provider/quotes/new"
          className={`${theme.button.provider} flex items-center gap-2`}
        >
          <Plus size={18} />
          New Quote
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          label="Total Quotes"
          value={stats.total}
          icon={<FileText size={20} />}
          color="blue"
        />
        <StatCard
          label="Drafts"
          value={stats.draft}
          icon={<Edit2 size={20} />}
          color="slate"
        />
        <StatCard
          label="Sent/Pending"
          value={stats.sent}
          icon={<Clock size={20} />}
          color="amber"
        />
        <StatCard
          label="Approved"
          value={stats.approved}
          icon={<CheckCircle2 size={20} />}
          color="green"
        />
        <StatCard
          label="Total Value"
          value={`$${(stats.totalValue / 100).toFixed(0)}`}
          icon={<TrendingUp size={20} />}
          color="emerald"
        />
      </div>

      {/* Filters & Search */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by client, service, or quote number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${theme.input.base} ${theme.input.provider} pl-10`}
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`${theme.input.base} ${theme.input.provider}`}
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="viewed">Viewed</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quotes List */}
      {filteredQuotes.length === 0 ? (
        <div className={`${theme.card.base} ${theme.card.padding} text-center py-12`}>
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-slate-400" size={32} />
          </div>
          <p className={`${theme.text.h4} mb-2`}>
            {searchQuery || statusFilter !== "all"
              ? "No quotes match your search"
              : "No Quotes Yet"}
          </p>
          <p className={theme.text.body}>
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Create your first quote to get started"}
          </p>
          {!searchQuery && statusFilter === "all" && (
            <Link
              to="/provider/quotes/new"
              className={`${theme.button.provider} inline-flex items-center gap-2 mt-4`}
            >
              <Plus size={18} />
              Create Quote
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuotes.map((quote) => (
            <QuoteCard key={quote.id} quote={quote} onUpdate={fetchQuotes} />
          ))}
        </div>
      )}

      {/* Quick Actions Footer */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/provider/quotes/settings"
            className="flex items-center gap-3 p-4 rounded-lg border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition"
          >
            <div className="bg-blue-100 text-blue-700 p-3 rounded-lg">
              <FileText size={20} />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Pricing Library</p>
              <p className="text-sm text-slate-600">Manage saved services</p>
            </div>
          </Link>

          <Link
            to="/provider/quotes/settings"
            className="flex items-center gap-3 p-4 rounded-lg border-2 border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition"
          >
            <div className="bg-purple-100 text-purple-700 p-3 rounded-lg">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Pricing Settings</p>
              <p className="text-sm text-slate-600">Markup, fees, & minimums</p>
            </div>
          </Link>

          <Link
            to="/provider/quotes/analytics"
            className="flex items-center gap-3 p-4 rounded-lg border-2 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition"
          >
            <div className="bg-emerald-100 text-emerald-700 p-3 rounded-lg">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Quote Analytics</p>
              <p className="text-sm text-slate-600">Win rate & insights</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, icon, color }) {
  const colors = {
    blue: theme.statCard.blue,
    slate: theme.statCard.slate,
    amber: "bg-amber-50 border-amber-200",
    green: theme.statCard.green,
    emerald: "bg-emerald-50 border-emerald-200",
  };

  return (
    <div className={`${colors[color]} border rounded-xl p-4 text-center`}>
      <div className="flex items-center justify-center mb-2 text-current opacity-70">
        {icon}
      </div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-xs font-semibold opacity-80">{label}</p>
    </div>
  );
}