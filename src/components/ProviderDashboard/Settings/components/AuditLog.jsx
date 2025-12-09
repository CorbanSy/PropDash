// src/components/ProviderDashboard/Settings/components/AuditLog.jsx
import { useState, useEffect } from "react";
import { Shield, Calendar, MapPin, User, Lock, FileText, Settings as SettingsIcon, Mail, Smartphone } from "lucide-react";
import { supabase } from "../../../../lib/supabaseClient";

export default function AuditLog({ providerData }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, security, profile, documents

  useEffect(() => {
    fetchAuditLogs();
  }, [providerData.id]);

  const fetchAuditLogs = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("provider_id", providerData.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (data) setLogs(data);
    setLoading(false);
  };

  const getEventIcon = (eventType) => {
    const icons = {
      password_changed: Lock,
      email_updated: Mail,
      phone_verified: Smartphone,
      profile_updated: User,
      document_uploaded: FileText,
      document_approved: FileText,
      document_rejected: FileText,
      availability_updated: Calendar,
      services_updated: SettingsIcon,
      areas_updated: MapPin,
      ai_preferences_updated: SettingsIcon,
      stripe_connected: SettingsIcon,
      login: Shield,
      logout: Shield,
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
      logout: "text-slate-600 bg-slate-100",
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
      logout: "Logged Out",
    };

    return labels[eventType] || eventType;
  };

  const getEventCategory = (eventType) => {
    const security = ["password_changed", "email_updated", "phone_verified", "login", "logout"];
    const documents = ["document_uploaded", "document_approved", "document_rejected"];
    const profile = ["profile_updated", "availability_updated", "services_updated", "areas_updated", "ai_preferences_updated", "stripe_connected"];

    if (security.includes(eventType)) return "security";
    if (documents.includes(eventType)) return "documents";
    if (profile.includes(eventType)) return "profile";
    return "other";
  };

  const filteredLogs = logs.filter((log) => {
    if (filter === "all") return true;
    return getEventCategory(log.event_type) === filter;
  });

  if (loading) {
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
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-slate-100 p-2.5 rounded-lg">
            <Shield className="text-slate-600" size={20} />
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

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>🔒 Security Feature:</strong> All account activity is logged for your security. Review this regularly to ensure no unauthorized changes.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex gap-2 overflow-x-auto">
          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="All Activity"
            count={logs.length}
          />
          <FilterButton
            active={filter === "security"}
            onClick={() => setFilter("security")}
            label="Security"
            count={logs.filter(l => getEventCategory(l.event_type) === "security").length}
          />
          <FilterButton
            active={filter === "profile"}
            onClick={() => setFilter("profile")}
            label="Profile"
            count={logs.filter(l => getEventCategory(l.event_type) === "profile").length}
          />
          <FilterButton
            active={filter === "documents"}
            onClick={() => setFilter("documents")}
            label="Documents"
            count={logs.filter(l => getEventCategory(l.event_type) === "documents").length}
          />
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="text-slate-400 mx-auto mb-3" size={48} />
            <p className="text-slate-600 font-medium">No activity in this category</p>
            <p className="text-sm text-slate-500 mt-1">
              Account actions will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((log, index) => {
              const Icon = getEventIcon(log.event_type);
              const colorClass = getEventColor(log.event_type);
              const label = getEventLabel(log.event_type);

              return (
                <div
                  key={log.id}
                  className={`flex items-start gap-4 pb-4 ${
                    index !== filteredLogs.length - 1 ? "border-b border-slate-200" : ""
                  }`}
                >
                  {/* Icon */}
                  <div className={`p-2.5 rounded-lg ${colorClass} flex-shrink-0`}>
                    <Icon size={18} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{label}</p>
                        {log.description && (
                          <p className="text-sm text-slate-600 mt-0.5">
                            {log.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(log.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span>
                            {new Date(log.created_at).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </span>
                          {log.ip_address && (
                            <span className="flex items-center gap-1">
                              <MapPin size={12} />
                              {log.ip_address}
                            </span>
                          )}
                          {log.user_agent && (
                            <span className="truncate max-w-[200px]" title={log.user_agent}>
                              {getBrowserInfo(log.user_agent)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Additional Info Badge */}
                      {log.metadata && (
                        <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded font-medium whitespace-nowrap">
                          Details
                        </span>
                      )}
                    </div>

                    {/* Metadata Expandable */}
                    {log.metadata && (
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
              );
            })}
          </div>
        )}
      </div>

      {/* Export Options */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-900">Export Activity Log</p>
            <p className="text-sm text-slate-600 mt-0.5">
              Download your complete account history
            </p>
          </div>
          <button className="px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-white transition font-semibold">
            Export CSV
          </button>
        </div>
      </div>

      {/* Data Retention Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <p className="text-sm text-blue-900">
          <strong>📊 Data Retention:</strong> Activity logs are retained for 90 days. Critical security events (password changes, login attempts) are retained indefinitely for account protection.
        </p>
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
        active
          ? "bg-blue-600 text-white"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {label} {count > 0 && `(${count})`}
    </button>
  );
}

function getBrowserInfo(userAgent) {
  if (!userAgent) return "Unknown";
  
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari")) return "Safari";
  if (userAgent.includes("Edge")) return "Edge";
  
  return "Browser";
}