// src/components/ProviderDashboard/Network/Overview.jsx
import { DollarSign, TrendingUp, Users, Zap, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { theme } from "../../../styles/theme";
import ActivityFeed from "./components/ActivityFeed";
import { formatCurrency } from "./utils/networkCalculations";

export default function Overview({ stats, partners, referredJobs, activityFeed, onRefresh }) {
  const recentEarnings = referredJobs
    .filter((j) => j.status === "completed" && j.commission > 0)
    .slice(0, 5);

  const topPartners = partners
    .sort((a, b) => (b.jobsReferred || 0) - (a.jobsReferred || 0))
    .slice(0, 3);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Recent Earnings */}
        <div className={`${theme.card.base} ${theme.card.padding}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={theme.text.h3}>Recent Commissions</h2>
            <Link to="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View All
            </Link>
          </div>

          {recentEarnings.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="text-slate-400" size={32} />
              </div>
              <p className={`${theme.text.h4} mb-2`}>No Commissions Yet</p>
              <p className={theme.text.body}>
                Start referring jobs to earn your first commission
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEarnings.map((job) => (
                <div
                  key={job.id}
                  className="flex items-start justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg">
                      <DollarSign size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{job.clientName}</h4>
                      <p className="text-sm text-slate-600 mt-1">
                        {job.serviceName} • {job.partnerName}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(job.completedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-600">
                      +{formatCurrency(job.commission)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {job.commissionRate * 100}% commission
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Partners */}
        <div className={`${theme.card.base} ${theme.card.padding}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={theme.text.h3}>Top Partners This Month</h2>
          </div>

          {topPartners.length === 0 ? (
            <div className="text-center py-8">
              <Users className="text-slate-400 mx-auto mb-3" size={32} />
              <p className={theme.text.body}>No partner data yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topPartners.map((partner, index) => (
                <div
                  key={partner.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={partner.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.id}`}
                        alt={partner.business_name}
                        className="w-12 h-12 rounded-full bg-slate-200"
                      />
                      {index < 3 && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{partner.business_name}</p>
                      <p className="text-sm text-slate-600">{partner.trade}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">{partner.jobsReferred || 0}</p>
                    <p className="text-xs text-slate-500">jobs referred</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className={`${theme.card.base} ${theme.card.padding}`}>
          <h3 className={`${theme.text.h4} mb-4`}>Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition text-left">
              <Zap className="text-blue-600 mb-2" size={24} />
              <p className="font-semibold text-slate-900 text-sm">Refer a Job</p>
              <p className="text-xs text-slate-600 mt-1">Send lead to partner</p>
            </button>
            <button className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100 transition text-left">
              <Users className="text-purple-600 mb-2" size={24} />
              <p className="font-semibold text-slate-900 text-sm">Invite Partner</p>
              <p className="text-xs text-slate-600 mt-1">Grow your network</p>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Earnings Chart Placeholder */}
        <div className={`${theme.card.base} ${theme.card.padding}`}>
          <h3 className={`${theme.text.h4} mb-4`}>Earnings This Month</h3>
          <div className="h-48 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg flex items-center justify-center border-2 border-slate-200">
            <div className="text-center">
              <TrendingUp className="text-emerald-600 mx-auto mb-2" size={32} />
              <p className="text-sm text-slate-600">Chart coming soon</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
            <p className="text-2xl font-bold text-emerald-700 mb-1">
              {formatCurrency(stats.thisMonth)}
            </p>
            <p className="text-xs text-emerald-600">
              {stats.thisMonth > 0 ? "↗" : ""} This month
            </p>
          </div>
        </div>

        {/* Activity Feed */}
        <ActivityFeed activities={activityFeed} />

        {/* Network Tips */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="text-blue-600" size={20} />
            <h4 className="font-semibold text-blue-900">Pro Tips</h4>
          </div>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span>💡</span>
              <span>Partners with higher ratings get more referrals</span>
            </li>
            <li className="flex items-start gap-2">
              <span>🚀</span>
              <span>VIP partners earn 10% instead of 5%</span>
            </li>
            <li className="flex items-start gap-2">
              <span>⭐</span>
              <span>Respond fast to keep clients happy</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}