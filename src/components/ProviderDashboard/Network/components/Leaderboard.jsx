// src/components/ProviderDashboard/Network/components/Leaderboard.jsx
import { useState, useEffect } from "react";
import { X, Trophy, TrendingUp, Star, DollarSign, Users, Zap, Award } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { supabase } from "../../../../lib/supabaseClient";

export default function Leaderboard({ currentUserId, onClose }) {
  const [timeframe, setTimeframe] = useState("month"); // month, quarter, all
  const [category, setCategory] = useState("referrals"); // referrals, commissions, response, rating
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe, category]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    
    // Mock data - replace with actual database query
    const mockLeaders = [
      {
        id: 1,
        name: "Mike's Plumbing",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
        trade: "Plumbing",
        referrals: 45,
        commissions: 2450,
        rating: 4.9,
        responseTime: 0.5,
        rank: 1,
      },
      {
        id: 2,
        name: "Sarah's Lawn Care",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        trade: "Landscaping",
        referrals: 38,
        commissions: 1980,
        rating: 5.0,
        responseTime: 1.2,
        rank: 2,
      },
      {
        id: 3,
        name: "Elite Electrical",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elite",
        trade: "Electrical",
        referrals: 32,
        commissions: 3200,
        rating: 4.8,
        responseTime: 0.8,
        rank: 3,
      },
      {
        id: currentUserId,
        name: "Your Business",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
        trade: "Handyman",
        referrals: 12,
        commissions: 650,
        rating: 4.7,
        responseTime: 2.5,
        rank: 8,
      },
    ];

    // Sort by category
    let sorted = [...mockLeaders];
    switch (category) {
      case "referrals":
        sorted = sorted.sort((a, b) => b.referrals - a.referrals);
        break;
      case "commissions":
        sorted = sorted.sort((a, b) => b.commissions - a.commissions);
        break;
      case "rating":
        sorted = sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "response":
        sorted = sorted.sort((a, b) => a.responseTime - b.responseTime);
        break;
    }

    // Update ranks
    sorted = sorted.map((leader, index) => ({ ...leader, rank: index + 1 }));

    setLeaders(sorted);
    setUserRank(sorted.find((l) => l.id === currentUserId));
    setLoading(false);
  };

  const getCategoryValue = (leader) => {
    switch (category) {
      case "referrals":
        return `${leader.referrals} referrals`;
      case "commissions":
        return `$${leader.commissions.toLocaleString()}`;
      case "rating":
        return `${leader.rating.toFixed(1)} ⭐`;
      case "response":
        return `${leader.responseTime}h response`;
      default:
        return "";
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return { emoji: "🥇", color: "from-yellow-400 to-yellow-600" };
    if (rank === 2) return { emoji: "🥈", color: "from-slate-300 to-slate-500" };
    if (rank === 3) return { emoji: "🥉", color: "from-amber-600 to-amber-800" };
    return { emoji: `#${rank}`, color: "from-slate-400 to-slate-600" };
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-start justify-between z-10">
          <div className="text-white">
            <div className="flex items-center gap-3 mb-2">
              <Trophy size={32} />
              <h2 className="text-2xl font-bold">Network Leaderboard</h2>
            </div>
            <p className="text-purple-100">See how you rank against top partners</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className={theme.text.label}>Time Period</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className={`${theme.input.base} ${theme.input.provider} mt-2`}
              >
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="all">All Time</option>
              </select>
            </div>
            <div className="flex-1">
              <label className={theme.text.label}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`${theme.input.base} ${theme.input.provider} mt-2`}
              >
                <option value="referrals">Most Referrals</option>
                <option value="commissions">Highest Earnings</option>
                <option value="rating">Top Rated</option>
                <option value="response">Fastest Response</option>
              </select>
            </div>
          </div>

          {/* Your Rank Card */}
          {userRank && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="text-blue-600" size={20} />
                <h3 className="font-semibold text-blue-900">Your Ranking</h3>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRankBadge(userRank.rank).color} flex items-center justify-center text-white font-bold text-lg`}>
                    {getRankBadge(userRank.rank).emoji}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">{userRank.name}</p>
                    <p className="text-sm text-slate-600">{getCategoryValue(userRank)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-700">#{userRank.rank}</p>
                  <p className="text-xs text-slate-600">of {leaders.length}</p>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard List */}
          <div className="space-y-3">
            {leaders.slice(0, 10).map((leader) => {
              const badge = getRankBadge(leader.rank);
              const isCurrentUser = leader.id === currentUserId;

              return (
                <div
                  key={leader.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 transition ${
                    isCurrentUser
                      ? "border-blue-400 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {/* Rank Badge */}
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                    {badge.emoji}
                  </div>

                  {/* Avatar & Info */}
                  <img
                    src={leader.avatar}
                    alt={leader.name}
                    className="w-12 h-12 rounded-full bg-slate-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-slate-900 truncate">
                        {leader.name}
                      </p>
                      {isCurrentUser && (
                        <span className="text-xs px-2 py-0.5 bg-blue-600 text-white rounded-full font-bold">
                          YOU
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{leader.trade}</p>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <p className="font-bold text-slate-900">{getCategoryValue(leader)}</p>
                    {category !== "rating" && (
                      <div className="flex items-center gap-1 justify-end mt-1">
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-xs text-slate-600">{leader.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Achievement Badges */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="text-purple-600" size={20} />
              <h3 className="font-semibold text-purple-900">Achievements</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">🌟</div>
                <p className="text-xs font-medium text-slate-700">Top 10</p>
                <p className="text-xs text-slate-500">Rank in top 10</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center opacity-50">
                <div className="text-2xl mb-1">🚀</div>
                <p className="text-xs font-medium text-slate-700">Rising Star</p>
                <p className="text-xs text-slate-500">+10 ranks this month</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center opacity-50">
                <div className="text-2xl mb-1">💎</div>
                <p className="text-xs font-medium text-slate-700">Diamond</p>
                <p className="text-xs text-slate-500">$5k+ earnings</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center opacity-50">
                <div className="text-2xl mb-1">⚡</div>
                <p className="text-xs font-medium text-slate-700">Speed Demon</p>
                <p className="text-xs text-slate-500">&lt;1h response</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}