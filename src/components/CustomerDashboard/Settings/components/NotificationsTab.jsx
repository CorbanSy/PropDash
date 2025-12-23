//levlpro-mvp\src\components\CustomerDashboard\Settings\components\NotificationsTab.jsx
import { Mail, Smartphone, Bell, CheckCircle2 } from "lucide-react";
import NotificationToggle from "./NotificationToggle";

export default function NotificationsTab({ notifications, setNotifications }) {
  const toggleNotification = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications - PRIMARY ICON */}
      <div className="bg-white rounded-2xl shadow-card border-2 border-secondary-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary-100 p-3 rounded-xl">
            <Mail className="text-primary-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900">
            Email Notifications
          </h3>
        </div>

        <div className="space-y-4">
          <NotificationToggle
            label="Quote Responses"
            description="Get notified when pros respond to your job requests"
            checked={notifications.email_quotes}
            onChange={() => toggleNotification("email_quotes")}
            icon={<Mail size={18} />}
          />
          <NotificationToggle
            label="Booking Confirmations"
            description="Receive updates when bookings are confirmed"
            checked={notifications.email_bookings}
            onChange={() => toggleNotification("email_bookings")}
            icon={<CheckCircle2 size={18} />}
          />
          <NotificationToggle
            label="Service Updates"
            description="Stay informed about your active jobs"
            checked={notifications.email_updates}
            onChange={() => toggleNotification("email_updates")}
            icon={<Bell size={18} />}
          />
        </div>
      </div>

      {/* SMS Notifications - PRIMARY ICON */}
      <div className="bg-white rounded-2xl shadow-card border-2 border-secondary-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary-100 p-3 rounded-xl">
            <Smartphone className="text-primary-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900">
            SMS Notifications
          </h3>
        </div>

        <div className="space-y-4">
          <NotificationToggle
            label="Appointment Reminders"
            description="Get SMS reminders 1 hour before appointments"
            checked={notifications.sms_reminders}
            onChange={() => toggleNotification("sms_reminders")}
            icon={<Bell size={18} />}
          />
          <NotificationToggle
            label="Job Updates"
            description="Instant SMS for important job updates"
            checked={notifications.sms_updates}
            onChange={() => toggleNotification("sms_updates")}
            icon={<Smartphone size={18} />}
          />
        </div>
      </div>
    </div>
  );
}

