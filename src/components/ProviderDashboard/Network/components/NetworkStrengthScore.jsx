// src/components/ProviderDashboard/Network/components/NetworkStrengthScore.jsx
import { TrendingUp, Target, Users, Star, Zap } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { getNetworkLevel, getMissingTrades } from "../utils/networkCalculations";

export default function NetworkStrengthScore({ score, partners, referrals }) {
  const level = getNetworkLevel(score);
  const missingTrades = getMissingTrades(partners);
  
  const levelColors = {
    purple: "from-purple-600 to-indigo-600",
    blue: "from-blue-600 to-indigo-600",
    green: "from-green-600 to-emerald-600",
    amber: "from-amber-600 to-orange-600",
    slate: "from-slate-600 to-slate-700",
  };

  const progressPercentage = (score / 100) * 100;

  return (
    <div className={`${theme.card.base} ${theme.card.padding}`}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="text-amber-500" size={24} />
            <h3 className={theme.text.h3}>Network Strength Score</h3>
          </div>
          <p className={theme.text.body}>
            Measure of your network quality and coverage
          </p>
        </div>
        <div className="text-right">
          <div className={`text-4xl font-bold bg-gradient-to-r ${levelColors[level.color]} bg-clip-text text-transparent`}>
            {score}
          </div>
          <p className="text-sm font-semibold text-slate-600">out of 100</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">
            {level.icon} {level.level} Network
          </span>
          <span className="text-sm font-medium text-slate-600">{score}%</span>
        </div>
        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${levelColors[level.color]} transition-all duration-500`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <ScoreMetric
          icon={<Users size={16} />}
          label="Partners"
          value={partners.length}
          max={10}
        />
        <ScoreMetric
          icon={<Target size={16} />}
          label="Trades"
          value={new Set(partners.map(p => p.trade)).size}
          max={8}
        />
        <ScoreMetric
          icon={<TrendingUp size={16} />}
          label="Active"
          value={referrals.filter(r => r.status === "joined").length}
          max={5}
        />
        <ScoreMetric
          icon={<Star size={16} />}
          label="Avg Rating"
          value={partners.length > 0 
            ? (partners.reduce((sum, p) => sum + (p.rating || 0), 0) / partners.length).toFixed(1)
            : "0.0"}
          max={5}
        />
      </div>

      {/* Recommendations */}
      {missingTrades.length > 0 && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="text-blue-600" size={18} />
            <h4 className="font-semibold text-blue-900">Grow Your Network</h4>
          </div>
          <p className="text-sm text-blue-800 mb-3">
            Add partners in these trades to reach the next level:
          </p>
          <div className="flex flex-wrap gap-2">
            {missingTrades.slice(0, 5).map((trade) => (
              <span
                key={trade}
                className="text-xs px-3 py-1.5 bg-white text-blue-700 rounded-full font-medium border border-blue-200"
              >
                {trade}
              </span>
            ))}
            {missingTrades.length > 5 && (
              <span className="text-xs px-3 py-1.5 bg-white text-blue-700 rounded-full font-medium border border-blue-200">
                +{missingTrades.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Level Benefits */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <h4 className="font-semibold text-slate-900 mb-3">Your Level Benefits</h4>
        <div className="space-y-2 text-sm">
          {score >= 80 && (
            <div className="flex items-center gap-2 text-purple-700">
              <Zap size={14} />
              <span>Elite status badge on profile</span>
            </div>
          )}
          {score >= 60 && (
            <div className="flex items-center gap-2 text-blue-700">
              <Zap size={14} />
              <span>Priority in partner search results</span>
            </div>
          )}
          {score >= 40 && (
            <div className="flex items-center gap-2 text-green-700">
              <Zap size={14} />
              <span>Access to network analytics</span>
            </div>
          )}
          {score < 40 && (
            <p className="text-slate-600">
              Build your network to unlock exclusive benefits
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ScoreMetric({ icon, label, value, max }) {
  const percentage = typeof value === 'number' && max ? (value / max) * 100 : 100;
  
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2 text-slate-600">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-lg font-bold text-slate-900">{value}</p>
      {max && (
        <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}