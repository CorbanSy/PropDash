// src/components/ProviderDashboard/Clients/components/ClientTags.jsx
import { useState } from "react";
import { Plus, X, Tag } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { supabase } from "../../../../lib/supabaseClient";

export default function ClientTags({ client, onRefresh }) {
  const [newTag, setNewTag] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const currentTags = client.tags || [];

  const predefinedTags = [
    "VIP",
    "Residential",
    "Commercial",
    "High Value",
    "Repeat",
    "Discount",
    "Referral",
    "Slow Payer",
    "Fast Payer",
    "Difficult",
  ];

  const handleAddTag = async (tag) => {
    if (currentTags.includes(tag)) return;

    const updatedTags = [...currentTags, tag];

    const { error } = await supabase
      .from("customers")
      .update({ tags: updatedTags })
      .eq("id", client.id);

    if (!error) {
      setNewTag("");
      setIsAdding(false);
      onRefresh();
    } else {
      alert("Error adding tag");
    }
  };

  const handleRemoveTag = async (tag) => {
    const updatedTags = currentTags.filter(t => t !== tag);

    const { error } = await supabase
      .from("customers")
      .update({ tags: updatedTags })
      .eq("id", client.id);

    if (!error) {
      onRefresh();
    } else {
      alert("Error removing tag");
    }
  };

  return (
    <div className={`${theme.card.base} ${theme.card.padding}`}>
      <div className="flex items-center gap-2 mb-4">
        <Tag className="text-purple-600" size={20} />
        <h4 className={theme.text.h4}>Tags</h4>
      </div>

      {/* Current Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {currentTags.length === 0 ? (
          <p className="text-sm text-slate-500">No tags yet</p>
        ) : (
          currentTags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="hover:bg-purple-200 rounded-full p-0.5 transition"
              >
                <X size={14} />
              </button>
            </span>
          ))
        )}
      </div>

      {/* Add Tag */}
      {isAdding ? (
        <div className="space-y-3">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && newTag.trim()) {
                handleAddTag(newTag.trim());
              }
            }}
            className={`${theme.input.base} ${theme.input.provider}`}
            placeholder="Enter custom tag..."
            autoFocus
          />

          <div className="flex flex-wrap gap-2">
            <p className="text-xs text-slate-600 w-full mb-1">Or choose predefined:</p>
            {predefinedTags
              .filter(tag => !currentTags.includes(tag))
              .map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleAddTag(tag)}
                  className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition"
                >
                  {tag}
                </button>
              ))}
          </div>

          <button
            onClick={() => {
              setIsAdding(false);
              setNewTag("");
            }}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className={`${theme.button.secondary} flex items-center gap-2 w-full justify-center`}
        >
          <Plus size={16} />
          Add Tag
        </button>
      )}
    </div>
  );
}