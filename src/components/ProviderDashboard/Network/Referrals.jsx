//levlpro-mvp\src\components\ProviderDashboard\Network\Referrals.jsx
import { useState } from "react";
import { Send, Clock, CheckCircle2, XCircle, Mail, Phone, Search, Filter } from "lucide-react";
import { theme } from "../../../styles/theme";
import ReferralCard from "./components/ReferralCard";

export default function Referrals({ referrals, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredReferrals = referrals.filter((referral) => {
    const matchesSearch = 
      referral.referred_business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.referred_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.trade?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || referral.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: referrals.length,
    pending: referrals.filter(r => r.status === "pending").length,
    joined: referrals.filter(r => r.status === "joined").length,
    declined: referrals.filter(r => r.status === "declined").length,
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name, email, or trade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${theme.input.base} ${theme.input.provider} pl-10`}
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`${theme.input.base} ${theme.input.provider}`}
            >
              <option value="all">All Status ({statusCounts.all})</option>
              <option value="pending">Pending ({statusCounts.pending})</option>
              <option value="joined">Joined ({statusCounts.joined})</option>
              <option value="declined">Declined ({statusCounts.declined})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Referrals List */}
      {filteredReferrals.length === 0 ? (
        <div className={`${theme.card.base} ${theme.card.padding} text-center py-12`}>
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="text-slate-400" size={32} />
          </div>
          <p className={`${theme.text.h4} mb-2`}>
            {searchQuery || statusFilter !== "all" ? "No referrals match your filters" : "No Referrals Yet"}
          </p>
          <p className={theme.text.body}>
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Start inviting trusted pros to join your network"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReferrals.map((referral) => (
            <ReferralCard
              key={referral.id}
              referral={referral}
              onRefresh={onRefresh}
            />
          ))}
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700 mb-1">Total Invites</p>
          <p className="text-2xl font-bold text-blue-900">{statusCounts.all}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-700 mb-1">Pending</p>
          <p className="text-2xl font-bold text-amber-900">{statusCounts.pending}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p className="text-sm text-emerald-700 mb-1">Joined</p>
          <p className="text-2xl font-bold text-emerald-900">{statusCounts.joined}</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <p className="text-sm text-slate-700 mb-1">Conversion Rate</p>
          <p className="text-2xl font-bold text-slate-900">
            {statusCounts.all > 0
              ? Math.round((statusCounts.joined / statusCounts.all) * 100)
              : 0}%
          </p>
        </div>
      </div>
    </div>
  );
}