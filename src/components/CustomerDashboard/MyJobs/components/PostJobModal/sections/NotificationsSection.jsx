// src/components/CustomerDashboard/MyJobs/components/PostJobModal/sections/NotificationsSection.jsx

export default function NotificationsSection({ formData, updateFormData }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b border-slate-200">
        Notifications
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="flex items-center gap-3 p-4 border-2 border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition">
          <input
            type="checkbox"
            checked={formData.notifyViaSMS}
            onChange={(e) => updateFormData({ notifyViaSMS: e.target.checked })}
            className="w-5 h-5 text-teal-600 rounded"
          />
          <span className="text-sm font-medium text-slate-900">
            SMS notifications
          </span>
        </label>

        <label className="flex items-center gap-3 p-4 border-2 border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition">
          <input
            type="checkbox"
            checked={formData.notifyViaEmail}
            onChange={(e) =>
              updateFormData({ notifyViaEmail: e.target.checked })
            }
            className="w-5 h-5 text-teal-600 rounded"
          />
          <span className="text-sm font-medium text-slate-900">
            Email updates
          </span>
        </label>
      </div>
    </div>
  );
}