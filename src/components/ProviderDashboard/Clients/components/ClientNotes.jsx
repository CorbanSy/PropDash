//levlpro-mvp\src\components\ProviderDashboard\Clients\components\ClientNotes.jsx
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { supabase } from "../../../../lib/supabaseClient";
import useAuth from "../../../../hooks/useAuth";

export default function ClientNotes({ client, onRefresh }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [client.id]);

  const fetchNotes = async () => {
    const { data } = await supabase
      .from("client_notes")
      .select("*")
      .eq("client_id", client.id)
      .eq("provider_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setNotes(data);
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    setLoading(true);
    const { error } = await supabase.from("client_notes").insert({
      provider_id: user.id,
      client_id: client.id,
      note: newNote.trim(),
    });

    if (!error) {
      setNewNote("");
      fetchNotes();
    } else {
      alert("Error adding note");
    }
    setLoading(false);
  };

  const handleUpdateNote = async (id) => {
    if (!editText.trim()) return;

    const { error } = await supabase
      .from("client_notes")
      .update({ note: editText.trim() })
      .eq("id", id);

    if (!error) {
      setEditingId(null);
      setEditText("");
      fetchNotes();
    } else {
      alert("Error updating note");
    }
  };

  const handleDeleteNote = async (id) => {
    if (!confirm("Delete this note?")) return;

    const { error } = await supabase
      .from("client_notes")
      .delete()
      .eq("id", id);

    if (!error) {
      fetchNotes();
    } else {
      alert("Error deleting note");
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Note */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <h3 className={`${theme.text.h4} mb-3`}>Add Internal Note</h3>
        <p className="text-sm text-slate-600 mb-4">
          Notes are only visible to you and help track important client details
        </p>
        <div className="flex gap-2">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className={`${theme.input.base} ${theme.input.provider} flex-1`}
            rows={3}
            placeholder="e.g., Client prefers morning appointments, has a dog that needs to be secured..."
          />
          <button
            onClick={handleAddNote}
            disabled={loading || !newNote.trim()}
            className={`${theme.button.provider} self-start ${
              loading || !newNote.trim() ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        {notes.length === 0 ? (
          <div className={`${theme.card.base} ${theme.card.padding} text-center py-8`}>
            <p className="text-slate-600">No notes yet</p>
            <p className="text-sm text-slate-500 mt-1">Add notes to track important client information</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className={`${theme.card.base} ${theme.card.padding}`}>
              {editingId === note.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className={`${theme.input.base} ${theme.input.provider}`}
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateNote(note.id)}
                      className={`${theme.button.provider} flex items-center gap-2`}
                    >
                      <Save size={16} />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditText("");
                      }}
                      className={`${theme.button.secondary} flex items-center gap-2`}
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm text-slate-700">{note.note}</p>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingId(note.id);
                          setEditText(note.note);
                        }}
                        className="p-1 hover:bg-slate-100 rounded transition"
                      >
                        <Edit2 size={14} className="text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 size={14} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    {new Date(note.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}