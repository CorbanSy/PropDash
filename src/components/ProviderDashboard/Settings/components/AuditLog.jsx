// levlpro-mvp\src\components\ProviderDashboard\Settings\components\AuditLog.jsx
import { useState, useEffect } from "react";
import {
  Shield,
  Calendar,
  MapPin,
  User,
  Lock,
  FileText,
  Settings as SettingsIcon,
  Mail,
  Smartphone,
  Download,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Monitor,
  Clock,
  DollarSign,
  LogOut,
} from "lucide-react";
import { supabase } from "../../../../lib/supabaseClient";

export default function AuditLog({ providerData }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const logsPerPage = 20;

  useEffect(() => {
    if (providerData?.id) {
      fetchAuditLogs();
    }
  }, [providerData?.id, filter, currentPage]);

  const fetchAuditLogs = async () => {
    setLoading(true);

    try {
      // Build query with count
      let query = supabase
        .from("audit_logs")
        .select("*", { count: "exact" })
        .eq("provider_id", providerData.id)
        .order("created_at", { ascending: false });

      // Apply category filter
      if (filter !== "all") {
        const categoryEvents = getEventsByCategory(filter);
        query = query.in("event_type", categoryEvents);
      }

      // Pagination
      const from = (currentPage - 1) * logsPerPage;
      const to = from + logsPerPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      setLogs(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error("Error fetching audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const getEventsByCategory = (category) => {
    const categories = {
      security: [
        "password_changed",
        "email_updated",
        "phone_verified",
        "login",
        "logout",
        "login_failed",
        "two_factor_enabled",
        "two_factor_disabled",
      ],
      documents: [
        "document_uploaded",
        "document_approved",
        "document_rejected",
      ],
      profile: [
        "profile_updated",
        "availability_updated",
        "services_updated",
        "areas_updated",
        "ai_preferences_updated",
        "stripe_connected",
        "photo_uploaded",
      ],
      account: [
        "account_deactivated",
        "account_deletion_requested",
      ],
    };
    return categories[category] || [];
  };

  const exportLogs = async () => {
    try {
      // Fetch ALL logs for export
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .eq("provider_id", providerData.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Convert to CSV
      const headers = [
        "Event",
        "Description",
        "Date",
        "Time",
        "IP Address",
        "Browser",
      ];
      const rows = data.map((log) => [
        getEventLabel(log.event_type),
        log.description || "",
        new Date(log.created_at).toLocaleDateString(),
        new Date(log.created_at).toLocaleTimeString(),
        log.ip_address || "",
        getBrowserInfo(log.user_agent),
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      // Download
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `activity-log-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export logs. Please try again.");
    }
  };

  const getEventIcon = (eventType) => {
    const icons = {
      password_changed: Lock,
      email_updated: Mail,
      phone_verified: Smartphone,
      profile_updated: User,
      document_uploaded: FileText,
      document_approved: CheckCircle2,
      document_rejected: XCircle,
      availability_updated: Calendar,
      services_updated: SettingsIcon,
      areas_updated: MapPin,
      ai_preferences_updated: SettingsIcon,
      stripe_connected: DollarSign,
      login: CheckCircle2,
      login_failed: XCircle,
      logout: LogOut,
      two_factor_enabled: Shield,
      two_factor_disabled: Shield,
      photo_uploaded: User,
      account_deactivated: AlertTriangle,
      account_deletion_requested: AlertTriangle,
    };
    return icons[eventType] || Shield;
  };

  const getEventColor = (eventType) => {
    const colors = {
      password_changed: "text-red-600 bg-red-100",
      email_updated: "text-purple-600 bg-purple-100",
      phone_verified: "text-green-600 bg-green-100",
      profile_updated: "text-blue-600 bg-blue-100",
      document_uploaded: "text-amber-600 bg-amber-100",
      document_approved: "text-green-600 bg-green-100",
      document_rejected: "text-red-600 bg-red-100",
      availability_updated: "text-indigo-600 bg-indigo-100",
      services_updated: "text-purple-600 bg-purple-100",
      areas_updated: "text-blue-600 bg-blue-100",
      ai_preferences_updated: "text-purple-600 bg-purple-100",
      stripe_connected: "text-emerald-600 bg-emerald-100",
      login: "text-green-600 bg-green-100",
      login_failed: "text-red-600 bg-red-100",
      logout: "text-slate-600 bg-slate-100",
      two_factor_enabled: "text-green-600 bg-green-100",
      two_factor_disabled: "text-amber-600 bg-amber-100",
      photo_uploaded: "text-blue-600 bg-blue-100",
      account_deactivated: "text-orange-600 bg-orange-100",
      account_deletion_requested: "text-red-600 bg-red-100",
    };
    return colors[eventType] || "text-slate-600 bg-slate-100";
  };

  const getEventLabel = (eventType) => {
    const labels = {
      password_changed: "Password Changed",
      email_updated: "Email Updated",
      phone_verified: "Phone Verified",
      profile_updated: "Profile Updated",
      document_uploaded: "Document Uploaded",
      document_approved: "Document Approved",
      document_rejected: "Document Rejected",
      availability_updated: "Availability Updated",
      services_updated: "Services Updated",
      areas_updated: "Service Areas Updated",
      ai_preferences_updated: "AI Preferences Updated",
      stripe_connected: "Stripe Connected",
      login: "Logged In",
      login_failed: "Login Failed",
      logout: "Logged Out",
      two_factor_enabled: "2FA Enabled",
      two_factor_disabled: "2FA Disabled",
      photo_uploaded: "Photo Uploaded",
      account_deactivated: "Account Deactivated",
      account_deletion_requested: "Deletion Requested",
    };
    return labels[eventType] || eventType;
  };

  const getEventCategory = (eventType) => {
    const security = [
      "password_changed",
      "email_updated",
      "phone_verified",
      "login",
      "login_failed",
      "logout",
      "two_factor_enabled",
      "two_factor_disabled",
    ];
    const documents = [
      "document_uploaded",
      "document_approved",
      "document_rejected",
    ];
    const profile = [
      "profile_updated",
      "availability_updated",
      "services_updated",
      "areas_updated",
      "ai_preferences_updated",
      "stripe_connected",
      "photo_uploaded",
    ];
    const account = ["account_deactivated", "account_deletion_requested"];

    if (security.includes(eventType)) return "security";
    if (documents.includes(eventType)) return "documents";
    if (profile.includes(eventType)) return "profile";
    if (account.includes(eventType)) return "account";
    return "other";
  };

  const getDeviceIcon = (userAgent) => {
    if (!userAgent) return Monitor;
    if (userAgent.toLowerCase().includes("mobile")) return Smartphone;
    return Monitor;
  };

  // Client-side search filter
  const filteredLogs = logs.filter((log) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      getEventLabel(log.event_type).toLowerCase().includes(searchLower) ||
      log.description?.toLowerCase().includes(searchLower) ||
      log.ip_address?.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(totalCount / logsPerPage);

  // Calculate statistics
  const securityEvents = logs.filter(
    (l) => getEventCategory(l.event_type) === "security"
  ).length;
  const failedLogins = logs.filter((l) => l.event_type === "login_failed").length;

  if (loading && currentPage === 1) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-3 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 mt-4">Loading activity log...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2.5 rounded-lg">
              <Shield className="text-purple-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Account Activity Log
              </h3>
              <p className="text-sm text-slate-600">
                Track all changes and actions on your account
              </p>
            </div>
          </div>

          <button
            onClick={exportLogs}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>🔒 Security Feature:</strong> All account activity is logged
            for your security. Review this regularly to ensure no unauthorized
            changes.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={CheckCircle2}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          label="Total Events"
          value={totalCount}
        />
        <StatCard
          icon={Lock}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          label="Security Events"
          value={securityEvents}
        />
        <StatCard
          icon={AlertTriangle}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          label="Failed Logins"
          value={failedLogins}
        />
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search logs by event, description, or IP..."
            className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 overflow-x-auto">
          <FilterButton
            active={filter === "all"}
            onClick={() => {
              setFilter("all");
              setCurrentPage(1);
            }}
            label="All Activity"
          />
          <FilterButton
            active={filter === "security"}
            onClick={() => {
              setFilter("security");
              setCurrentPage(1);
            }}
            label="Security"
          />
          <FilterButton
            active={filter === "profile"}
            onClick={() => {
              setFilter("profile");
              setCurrentPage(1);
            }}
            label="Profile"
          />
          <FilterButton
            active={filter === "documents"}
            onClick={() => {
              setFilter("documents");
              setCurrentPage(1);
            }}
            label="Documents"
          />
          <FilterButton
            active={filter === "account"}
            onClick={() => {
              setFilter("account");
              setCurrentPage(1);
            }}
            label="Account"
          />
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
              Loading...
            </div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12 px-6">
            <div className="bg-slate-100 p-4 rounded-full w-fit mx-auto mb-4">
              <Clock size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No Activity Found
            </h3>
            <p className="text-slate-600">
              {searchTerm || filter !== "all"
                ? "No logs match your search or filter criteria."
                : "Your account activity will appear here."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredLogs.map((log) => {
              const Icon = getEventIcon(log.event_type);
              const colorClass = getEventColor(log.event_type);
              const label = getEventLabel(log.event_type);
              const DeviceIcon = getDeviceIcon(log.user_agent);

              return (
                <div
                  key={log.id}
                  className="p-6 hover:bg-slate-50 transition"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-2.5 rounded-lg ${colorClass} flex-shrink-0`}>
                      <Icon size={18} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{label}</p>
                          {log.description && (
                            <p className="text-sm text-slate-600 mt-0.5">
                              {log.description}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>

                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(log.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        {log.ip_address && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {log.ip_address}
                          </span>
                        )}
                        {log.user_agent && (
                          <span className="flex items-center gap-1">
                            <DeviceIcon size={12} />
                            {getBrowserInfo(log.user_agent)}
                          </span>
                        )}
                      </div>

                      {/* Metadata Expandable */}
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <details className="mt-3">
                          <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-700 font-medium">
                            View Details
                          </summary>
                          <div className="mt-2 bg-slate-50 rounded-lg p-3">
                            <pre className="text-xs text-slate-700 overflow-x-auto">
                              {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                          </div>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="border-t border-slate-200 p-4 flex items-center justify-between bg-slate-50">
            <div className="text-sm text-slate-600">
              Page {currentPage} of {totalPages} ({totalCount} total events)
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border-2 border-slate-300 rounded-lg hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft size={18} />
                <span className="hidden sm:inline">Previous</span>
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border-2 border-slate-300 rounded-lg hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Data Retention Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <p className="text-sm text-blue-900">
          <strong>📊 Data Retention:</strong> Activity logs are retained for 90
          days. Critical security events (password changes, login attempts) are
          retained indefinitely for account protection. Export regularly to
          maintain longer records.
        </p>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon: Icon, iconBg, iconColor, label, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className={`${iconBg} p-2 rounded-lg`}>
          <Icon className={iconColor} size={18} />
        </div>
        <span className="text-sm font-medium text-slate-600">{label}</span>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

// Filter Button Component
function FilterButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
        active
          ? "bg-blue-600 text-white"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {label}
    </button>
  );
}

// Browser Info Helper
function getBrowserInfo(userAgent) {
  if (!userAgent) return "Unknown";

  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari")) return "Safari";
  if (userAgent.includes("Edge")) return "Edge";

  return "Browser";
}