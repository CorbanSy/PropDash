// src/components/ProviderDashboard/Clients/components/ClientCommunication.jsx
import { useState, useEffect } from "react";
import { Phone, Mail, MessageSquare, Plus } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { supabase } from "../../../../lib/supabaseClient";
import useAuth from "../../../../hooks/useAuth";

export default function ClientCommunication({ client, onRefresh }) {
  const { user } = useAuth();
  const [communications, setCommunications] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newComm, setNewComm] = useState({
    type: "call", // call, email, sms, meeting
    notes: "",
  });

  useEffect(() => {
    fetchCommunications();
  }, [client.id]);

  const fetchCommunications = async () => {
    const { data } = await supabase
      .from("client_communications")
      .select("*")
      .eq("client_id", client.id)
      .eq("provider_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setCommunications(data);
  };

  const handleAddCommunication = async () => {
    if (!newComm.notes.trim()) {
      alert("Please add notes about this communication");
      return;
    }

    const { error } = await supabase.from("client_communications").insert({
      provider_id: user.id,
      client_id: client.id,
      type: newComm.type,
      notes: newComm.notes,
    });

    if (!error) {
      setShowAddModal(false);
      setNewComm({ type: "call", notes: "" });
      fetchCommunications();
    } else {
      alert("Error logging communication");
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "call":
        return <Phone size={16} className="text-blue-600" />;
      case "email":
        return <Mail size={16} className="text-purple-600" />;
      case "sms":
        return <MessageSquare size={16} className="text-green-600" />;
      default:
        return <MessageSquare size={16} className="text-slate-600" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "call":
        return "bg-blue-100 text-blue-700";
      case "email":
        return "bg-purple-100 text-purple-700";
      case "sms":
        return "bg-green-100 text-green-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className={theme.text.h3}>Communication Log</h3>
          <p className="text-sm text-slate-600 mt-1">
            Track all interactions with this client
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className={`${theme.button.provider} flex items-center gap-2`}
        >
          <Plus size={18} />
          Log Communication
        </button>
      </div>

      {/* Communications Timeline */}
      <div className="space-y-3">
        {communications.length === 0 ? (
          <div className={`${theme.card.base} ${theme.card.padding} text-center py-8`}>
            <MessageSquare className="text-slate-400 mx-auto mb-3" size={32} />
            <p className="text-slate-600">No communications logged</p>
            <p className="text-sm text-slate-500 mt-1">
              Start tracking your interactions with this client
            </p>
          </div>
        ) : (
          communications.map((comm) => (
            <div key={comm.id} className={`${theme.card.base} ${theme.card.padding}`}>
              <div className="flex items-start gap-3">
                <div className="bg-slate-100 p-2 rounded-lg">
                  {getIcon(comm.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded font-medium ${getTypeColor(comm.type)}`}>
                      {comm.type.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(comm.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">{comm.notes}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Communication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className={`${theme.text.h3} mb-4`}>Log Communication</h3>

            <div className="space-y-4">
              <div>
                <label className={theme.text.label}>Type</label>
                <select
                  value={newComm.type}
                  onChange={(e) => setNewComm({ ...newComm, type: e.target.value })}
                  className={`${theme.input.base} ${theme.input.provider} mt-2`}
                >
                  <option value="call">Phone Call</option>
                  <option value="email">Email</option>
                  <option value="sms">Text Message</option>
                  <option value="meeting">In-Person Meeting</option>
                </select>
              </div>

              <div>
                <label className={theme.text.label}>Notes</label>
                <textarea
                  value={newComm.notes}
                  onChange={(e) => setNewComm({ ...newComm, notes: e.target.value })}
                  className={`${theme.input.base} ${theme.input.provider} mt-2`}
                  rows={4}
                  placeholder="What was discussed? Any follow-ups needed?"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className={`flex-1 ${theme.button.secondary} justify-center`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddCommunication}
                className={`flex-1 ${theme.button.provider} justify-center`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}