//levlpro-mvp\src\components\ProviderDashboard\Clients\ClientProfile.jsx
import { useState } from "react";
import {
  X,
  User,
  Briefcase,
  MessageSquare,
  FileText,
  Calendar,
  TrendingUp,
  Settings,
} from "lucide-react";
import { theme } from "../../../styles/theme";
import ClientMetrics from "./components/ClientMetrics";
import ClientJobHistory from "./components/ClientJobHistory";
import ClientQuoteHistory from "./components/ClientQuoteHistory";
import ClientCommunication from "./components/ClientCommunication";
import ClientNotes from "./components/ClientNotes";
import QuickActions from "./components/QuickActions";
import UpcomingAppointments from "./components/UpcomingAppointments";
import ClientTags from "./components/ClientTags";
import ClientRating from "./components/ClientRating";

export default function ClientProfile({ client, jobs, onClose, onRefresh }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-start justify-between z-10">
          <div className="flex items-center gap-4 text-white">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold">
              {(client.full_name || "?").charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{client.full_name || "Unknown Client"}</h2>
              <p className="text-blue-100">{client.email || "No email"}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <QuickActions client={client} onRefresh={onRefresh} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200 px-6 overflow-x-auto">
          <TabButton
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            icon={<TrendingUp size={18} />}
            label="Overview"
          />
          <TabButton
            active={activeTab === "jobs"}
            onClick={() => setActiveTab("jobs")}
            icon={<Briefcase size={18} />}
            label={`Jobs (${jobs.length})`}
          />
          <TabButton
            active={activeTab === "quotes"}
            onClick={() => setActiveTab("quotes")}
            icon={<FileText size={18} />}
            label="Quotes"
          />
          <TabButton
            active={activeTab === "communication"}
            onClick={() => setActiveTab("communication")}
            icon={<MessageSquare size={18} />}
            label="Communication"
          />
          <TabButton
            active={activeTab === "notes"}
            onClick={() => setActiveTab("notes")}
            icon={<User size={18} />}
            label="Notes"
          />
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Metrics */}
              <ClientMetrics client={client} jobs={jobs} />

              {/* Tags & Rating */}
              <div className="grid md:grid-cols-2 gap-6">
                <ClientTags client={client} onRefresh={onRefresh} />
                <ClientRating client={client} onRefresh={onRefresh} />
              </div>

              {/* Upcoming Appointments */}
              <UpcomingAppointments client={client} jobs={jobs} />
            </div>
          )}

          {activeTab === "jobs" && (
            <ClientJobHistory client={client} jobs={jobs} onRefresh={onRefresh} />
          )}

          {activeTab === "quotes" && (
            <ClientQuoteHistory client={client} />
          )}

          {activeTab === "communication" && (
            <ClientCommunication client={client} onRefresh={onRefresh} />
          )}

          {activeTab === "notes" && (
            <ClientNotes client={client} onRefresh={onRefresh} />
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 font-semibold transition relative whitespace-nowrap ${
        active ? "text-blue-700" : "text-slate-600 hover:text-slate-900"
      }`}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>}
    </button>
  );
}