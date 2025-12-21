//levlpro-mvp\src\components\ProviderDashboard\Network\components\ActivityFeed.jsx
import {
  UserPlus,
  CheckCircle2,
  DollarSign,
  Send,
  Star,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import { theme } from "../../../../styles/theme";

export default function ActivityFeed({ activities }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case "referral_joined":
        return <UserPlus size={16} className="text-green-600" />;
      case "job_completed":
        return <CheckCircle2 size={16} className="text-blue-600" />;
      case "commission_earned":
        return <DollarSign size={16} className="text-emerald-600" />;
      case "referral_sent":
        return <Send size={16} className="text-purple-600" />;
      case "job_referred":
        return <Briefcase size={16} className="text-amber-600" />;
      default:
        return <TrendingUp size={16} className="text-slate-600" />;
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Mock activities if none provided
  const displayActivities = activities.length > 0 ? activities : [
    {
      id: 1,
      type: "commission_earned",
      message: "$12.50 commission earned from Sarah's Lawn Care",
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      type: "job_completed",
      message: "Kevin completed a job from your referral",
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      type: "referral_joined",
      message: "Mike's Plumbing joined your network",
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  return (
    <div className={`${theme.card.base} ${theme.card.padding}`}>
      <h3 className={`${theme.text.h4} mb-4`}>Recent Activity</h3>

      {displayActivities.length === 0 ? (
        <div className="text-center py-8">
          <TrendingUp className="text-slate-400 mx-auto mb-3" size={32} />
          <p className={theme.text.body}>No activity yet</p>
          <p className="text-sm text-slate-500 mt-1">
            Your network activity will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayActivities.slice(0, 8).map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition"
            >
              <div className="bg-slate-100 p-2 rounded-lg">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-900 font-medium">
                  {activity.message}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {formatTimeAgo(activity.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {displayActivities.length > 8 && (
        <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All Activity
        </button>
      )}
    </div>
  );
}