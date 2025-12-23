//levlpro-mvp\src\components\CustomerDashboard\Settings\components\NotificationToggle.jsx

export default function NotificationToggle({ label, description, checked, onChange, icon }) {
  return (
    <div className="flex items-start justify-between py-3 border-b-2 border-secondary-200 last:border-0">
      <div className="flex items-start gap-3 flex-1">
        <div className="text-secondary-600 mt-1">{icon}</div>
        <div>
          <p className="font-semibold text-secondary-900">{label}</p>
          <p className="text-sm text-secondary-600 mt-0.5">{description}</p>
        </div>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
          checked ? "bg-success-600" : "bg-secondary-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
