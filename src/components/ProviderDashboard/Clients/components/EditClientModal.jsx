//levlpro-mvp\src\components\ProviderDashboard\Clients\components\EditClientModal.jsx
import { useState } from "react";
import { X, User, Mail, Phone, MapPin, Save } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { supabase } from "../../../../lib/supabaseClient";
import useAuth from "../../../../hooks/useAuth";

export default function EditClientModal({ client, onClose, onSuccess }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: client?.full_name || "",
    email: client?.email || "",
    phone: client?.phone || "",
    address: client?.address || "",
    lead_source: client?.lead_source || "",
    notes: client?.notes || "",
  });

  const isNewClient = !client;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isNewClient) {
      // Create new client
      const { error } = await supabase.from("customers").insert({
        ...formData,
        provider_id: user.id,
      });

      if (error) {
        alert("Error creating client");
        console.error(error);
      } else {
        onSuccess();
      }
    } else {
      // Update existing client
      const { error } = await supabase
        .from("customers")
        .update(formData)
        .eq("id", client.id);

      if (error) {
        alert("Error updating client");
        console.error(error);
      } else {
        onSuccess();
      }
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between z-10">
          <div>
            <h2 className={theme.text.h2}>
              {isNewClient ? "Add New Client" : "Edit Client"}
            </h2>
            <p className={theme.text.caption}>
              {isNewClient ? "Add a client to your database" : "Update client information"}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Full Name */}
          <div>
            <label className={theme.text.label}>Full Name *</label>
            <div className="relative mt-2">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className={`${theme.input.base} ${theme.input.provider} pl-10`}
                placeholder="John Smith"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={theme.text.label}>Email</label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`${theme.input.base} ${theme.input.provider} pl-10`}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className={theme.text.label}>Phone</label>
              <div className="relative mt-2">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`${theme.input.base} ${theme.input.provider} pl-10`}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className={theme.text.label}>Address</label>
            <div className="relative mt-2">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={`${theme.input.base} ${theme.input.provider} pl-10`}
                placeholder="123 Main St, City, State 12345"
              />
            </div>
          </div>

          {/* Lead Source */}
          <div>
            <label className={theme.text.label}>Lead Source</label>
            <select
              value={formData.lead_source}
              onChange={(e) => setFormData({ ...formData, lead_source: e.target.value })}
              className={`${theme.input.base} ${theme.input.provider} mt-2`}
            >
              <option value="">Select source...</option>
              <option value="Referral">Referral</option>
              <option value="Website">Website</option>
              <option value="Facebook">Facebook</option>
              <option value="Google">Google</option>
              <option value="Yelp">Yelp</option>
              <option value="Network Partner">Network Partner</option>
              <option value="Repeat Customer">Repeat Customer</option>
              <option value="Walk-in">Walk-in</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className={theme.text.label}>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className={`${theme.input.base} ${theme.input.provider} mt-2`}
              rows={3}
              placeholder="Any additional information about this client..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 ${theme.button.secondary} justify-center`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 ${theme.button.provider} justify-center ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Save size={18} />
              {loading ? "Saving..." : isNewClient ? "Add Client" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}