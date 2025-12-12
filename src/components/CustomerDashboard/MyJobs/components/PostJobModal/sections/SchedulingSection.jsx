// src/components/CustomerDashboard/MyJobs/components/PostJobModal/sections/SchedulingSection.jsx

export default function SchedulingSection({ formData, updateFormData }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b border-slate-200">
        Scheduling
      </h3>

      <div className="space-y-3">
        <label className="flex items-start gap-3 p-4 border-2 border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition">
          <input
            type="radio"
            name="scheduling"
            checked={formData.schedulingType === "flexible"}
            onChange={() => updateFormData({ schedulingType: "flexible" })}
            className="mt-1 w-5 h-5 text-teal-600"
          />
          <div>
            <p className="font-medium text-slate-900">I'm flexible</p>
            <p className="text-sm text-slate-600">
              Work with the pro to find a good time
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 p-4 border-2 border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition">
          <input
            type="radio"
            name="scheduling"
            checked={formData.schedulingType === "asap"}
            onChange={() => updateFormData({ schedulingType: "asap" })}
            className="mt-1 w-5 h-5 text-teal-600"
          />
          <div>
            <p className="font-medium text-slate-900">As soon as possible</p>
            <p className="text-sm text-slate-600">Get the job done urgently</p>
          </div>
        </label>

        <label className="flex items-start gap-3 p-4 border-2 border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition">
          <input
            type="radio"
            name="scheduling"
            checked={formData.schedulingType === "specific"}
            onChange={() => updateFormData({ schedulingType: "specific" })}
            className="mt-1 w-5 h-5 text-teal-600"
          />
          <div className="flex-1">
            <p className="font-medium text-slate-900 mb-3">Pick a date</p>

            {formData.schedulingType === "specific" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) =>
                      updateFormData({ preferredDate: e.target.value })
                    }
                    className="w-full border-2 border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Backup Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.backupDate}
                    onChange={(e) =>
                      updateFormData({ backupDate: e.target.value })
                    }
                    className="w-full border-2 border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </label>
      </div>
    </div>
  );
}