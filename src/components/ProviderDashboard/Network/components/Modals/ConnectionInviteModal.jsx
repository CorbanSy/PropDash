//levlpro-mvp\src\components\ProviderDashboard\Network\components\Modals\ConnectionInviteModal.jsx
import { useState } from "react";
import { UserPlus, X, Send } from "lucide-react";

export default function ConnectionInviteModal({ professional, onSend, onClose, loading }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    onSend(message);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2.5 rounded-full">
              <UserPlus className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Send Connection Invite
              </h3>
              <p className="text-sm text-slate-600">To: {professional.business_name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Add a message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi! I'd like to connect and explore collaboration opportunities..."
              rows={4}
              className="w-full border-2 border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
            <p className="text-xs text-slate-500 mt-1">
              Let them know why you'd like to connect
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </>
            ) : (
              <>
                <Send size={16} />
                Send Invite
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}