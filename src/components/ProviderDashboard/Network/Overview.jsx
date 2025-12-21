//levlpro-mvp\src\components\ProviderDashboard\Network\Overview.jsx
import {
  DollarSign,
  TrendingUp,
  Users,
  Zap,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import ActivityFeed from "./components/ActivityFeed";
import { formatCurrency } from "./utils/networkCalculations";

export default function Overview({
  stats,
  partners,
  referredJobs,
  activityFeed,
  onRefresh,
}) {
  const recentEarnings = referredJobs
    .filter((j) => j.status === "completed" && j.commission > 0)
    .slice(0, 5);

  const topPartners = [...partners]
    .sort((a, b) => (b.jobsReferred || 0) - (a.jobsReferred || 0))
    .slice(0, 3);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* MAIN */}
      <div className="lg:col-span-2 space-y-6">
        {/* Recent Commissions */}
        <Card>
          <Header
            title="Recent Commissions"
            action={
              <Link
                to="#"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                View all
              </Link>
            }
          />

          {recentEarnings.length === 0 ? (
            <EmptyState
              icon={<DollarSign size={32} />}
              title="No commissions yet"
              description="Start referring jobs to earn your first commission."
            />
          ) : (
            <div className="space-y-3">
              {recentEarnings.map((job) => (
                <div
                  key={job.id}
                  className="flex items-start justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 hover:bg-slate-100 transition"
                >
                  <div className="flex gap-3">
                    <IconBadge>
                      <DollarSign size={18} />
                    </IconBadge>

                    <div>
                      <p className="font-semibold text-slate-900">
                        {job.clientName}
                      </p>
                      <p className="text-sm text-slate-600 mt-0.5">
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
        </Card>

        {/* Top Partners */}
        <Card>
          <Header title="Top Partners This Month" />

          {topPartners.length === 0 ? (
            <EmptyState
              icon={<Users size={32} />}
              description="No partner data yet."
            />
          ) : (
            <div className="space-y-3">
              {topPartners.map((partner, index) => (
                <div
                  key={partner.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={
                          partner.avatar_url ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.id}`
                        }
                        alt={partner.business_name}
                        className="w-12 h-12 rounded-full bg-slate-200"
                      />
                      {index < 3 && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">
                        {partner.business_name}
                      </p>
                      <p className="text-sm text-slate-600">
                        {partner.trade}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-slate-900">
                      {partner.jobsReferred || 0}
                    </p>
                    <p className="text-xs text-slate-500">
                      jobs referred
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Quick actions
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <QuickAction
              icon={<Zap size={20} />}
              title="Refer a job"
              description="Send a lead to a partner"
            />
            <QuickAction
              icon={<Users size={20} />}
              title="Invite partner"
              description="Grow your network"
            />
          </div>
        </Card>
      </div>

      {/* SIDEBAR */}
      <div className="space-y-6">
        {/* Earnings */}
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Earnings this month
          </h3>

          <div className="h-48 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center">
            <div className="text-center">
              <TrendingUp
                className="text-slate-500 mx-auto mb-2"
                size={32}
              />
              <p className="text-sm text-slate-600">
                Chart coming soon
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-2xl font-bold text-emerald-700">
              {formatCurrency(stats.thisMonth)}
            </p>
            <p className="text-xs text-emerald-600 mt-1">
              {stats.thisMonth > 0 && "↗"} This month
            </p>
          </div>
        </Card>

        {/* Activity */}
        <ActivityFeed activities={activityFeed} />

        {/* Tips */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="text-primary-600" size={18} />
            <h4 className="font-semibold text-slate-900">
              Pro tips
            </h4>
          </div>

          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Higher-rated partners receive more referrals</li>
            <li>• VIP partners earn higher commission</li>
            <li>• Fast responses increase repeat clients</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

/* ---------- Small shared UI helpers ---------- */

function Card({ children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {children}
    </div>
  );
}

function Header({ title, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-slate-900">
        {title}
      </h2>
      {action}
    </div>
  );
}

function IconBadge({ children }) {
  return (
    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
      {children}
    </div>
  );
}

function EmptyState({ icon, title, description }) {
  return (
    <div className="py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
        {icon}
      </div>
      {title && (
        <p className="text-lg font-semibold text-slate-900 mb-1">
          {title}
        </p>
      )}
      <p className="text-sm text-slate-600">
        {description}
      </p>
    </div>
  );
}

function QuickAction({ icon, title, description }) {
  return (
    <button className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left hover:bg-slate-100 transition">
      <div className="mb-2 text-primary-600">{icon}</div>
      <p className="font-semibold text-slate-900 text-sm">
        {title}
      </p>
      <p className="text-xs text-slate-600 mt-1">
        {description}
      </p>
    </button>
  );
}
