// src/components/ProviderDashboard/Clients/components/ClientRating.jsx
import { useState } from "react";
import { Star, Save } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { supabase } from "../../../../lib/supabaseClient";

export default function ClientRating({ client, onRefresh }) {
  const [rating, setRating] = useState(client.internal_rating || 0);
  const [hover, setHover] = useState(0);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    const { error } = await supabase
      .from("customers")
      .update({ internal_rating: rating })
      .eq("id", client.id);

    if (!error) {
      onRefresh();
    } else {
      alert("Error saving rating");
    }

    setSaving(false);
  };

  const ratingDescriptions = {
    1: "Difficult - Proceed with caution",
    2: "Below Average - Some issues",
    3: "Average - Normal client",
    4: "Good - Pleasure to work with",
    5: "Excellent - Dream client",
  };

  return (
    <div className={`${theme.card.base} ${theme.card.padding}`}>
      <div className="flex items-center gap-2 mb-4">
        <Star className="text-yellow-500 fill-yellow-500" size={20} />
        <h4 className={theme.text.h4}>Internal Rating</h4>
      </div>

      <p className="text-sm text-slate-600 mb-4">
        Rate this client for your internal reference (not visible to client)
      </p>

      {/* Star Rating */}
      <div className="flex items-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              size={32}
              className={
                star <= (hover || rating)
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-slate-300"
              }
            />
          </button>
        ))}
      </div>

      {/* Rating Description */}
      {(rating > 0 || hover > 0) && (
        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
          <p className="text-sm font-medium text-slate-900">
            {ratingDescriptions[hover || rating]}
          </p>
        </div>
      )}

      {/* Save Button */}
      {rating !== (client.internal_rating || 0) && (
        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full ${theme.button.provider} justify-center ${
            saving ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Rating"}
        </button>
      )}

      {rating === (client.internal_rating || 0) && rating > 0 && (
        <div className="text-center text-sm text-slate-600">
          Rating saved
        </div>
      )}
    </div>
  );
}