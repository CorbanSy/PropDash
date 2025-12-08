// src/components/ProviderDashboard/Network/JobMatchmaking.jsx
import { useState } from "react";
import {
  Briefcase,
  Users,
  MapPin,
  DollarSign,
  Clock,
  Send,
  Star,
  Zap,
  CheckCircle2,
  AlertCircle,
  Search,
} from "lucide-react";
import { theme } from "../../../styles/theme";
import JobReferralFlow from "./components/JobReferralFlow";
import { findBestMatches } from "./utils/matchmakingAlgorithm";

export default function JobMatchmaking({ partners, userId, onRefresh }) {
  const [showReferralFlow, setShowReferralFlow] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobType, setJobType] = useState("");

  // Sample recent job requests (would come from database)
  const recentJobRequests = [
    {
      id: 1,
      clientName: "Mrs. Johnson",
      serviceName: "Lawn Mowing",
      requiredTrade: "Landscaping",
      scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedPrice: 15000, // $150
      location: { lat: 40.7128, lng: -74.0060 },
      notes: "Large backyard, bi-weekly service",
      status: "new",
    },
    {
      id: 2,
      clientName: "Kevin Smith",
      serviceName: "Carpet Cleaning",
      requiredTrade: "Cleaning",
      scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedPrice: 25000, // $250
      location: { lat: 40.7128, lng: -74.0060 },
      notes: "3 bedrooms + living room",
      status: "new",
    },
  ];

  const handleReferJob = (job) => {
    setSelectedJob(job);
    setShowReferralFlow(true);
  };

  const handleCreateNewReferral = () => {
    setSelectedJob(null);
    setShowReferralFlow(true);
  };

  return (
    <div className="space-y-6">
      {/* Header with CTA */}
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <Zap size={28} />
            <h2 className="text-2xl font-bold">Smart Job Matching</h2>
          </div>
          <p className="text-blue-100 mb-6 max-w-2xl">
            Can't take a job? Refer it to the perfect partner in your network and earn 5-10% commission automatically.
          </p>
          <button
            onClick={handleCreateNewReferral}
            className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center gap-2"
          >
            <Send size={18} />
            Refer a New Job
          </button>
        </div>
      </div>

      {/* How It Works */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <h3 className={`${theme.text.h3} mb-4`}>How Job Referrals Work</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="bg-blue-100 text-blue-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold">1</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 mb-1">Enter Job Details</p>
            <p className="text-xs text-slate-600">Client info, service needed, timing</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 text-purple-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold">2</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 mb-1">AI Finds Matches</p>
            <p className="text-xs text-slate-600">Best partners based on rating, location, trade</p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 text-indigo-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold">3</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 mb-1">Send to Partner</p>
            <p className="text-xs text-slate-600">Partner accepts and completes job</p>
          </div>
          <div className="text-center">
            <div className="bg-emerald-100 text-emerald-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold">4</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 mb-1">Earn Commission</p>
            <p className="text-xs text-slate-600">5-10% of job total, paid automatically</p>
          </div>
        </div>
      </div>

      {/* Recent Job Requests */}
      <div className={`${theme.card.base} ${theme.card.padding}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`${theme.text.h3}`}>Jobs You Can Refer</h3>
          <span className="text-sm text-slate-600">
            {recentJobRequests.length} pending
          </span>
        </div>

        {recentJobRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="text-slate-400" size={32} />
            </div>
            <p className={`${theme.text.h4} mb-2`}>No Pending Job Requests</p>
            <p className={theme.text.body}>
              Jobs you can't take will appear here for easy referral
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentJobRequests.map((job) => {
              const matches = findBestMatches(
                job,
                partners,
                { lat: 40.7128, lng: -74.0060 }, // User location
                3
              );

              return (
                <div
                  key={job.id}
                  className="border-2 border-slate-200 rounded-lg p-5 hover:border-blue-300 transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-slate-900 text-lg">
                          {job.serviceName}
                        </h4>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">
                          {job.requiredTrade}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-slate-600">
                        <p className="flex items-center gap-2">
                          <Users size={14} />
                          {job.clientName}
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock size={14} />
                          {new Date(job.scheduledDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="flex items-center gap-2">
                          <DollarSign size={14} />
                          Estimated: ${(job.estimatedPrice / 100).toFixed(0)}
                        </p>
                      </div>
                      {job.notes && (
                        <p className="text-sm text-slate-500 mt-2 italic">"{job.notes}"</p>
                      )}
                    </div>

                    <div className="text-right ml-4">
                      <p className="text-sm text-slate-600 mb-2">Potential Commission</p>
                      <p className="text-2xl font-bold text-emerald-600">
                        ${((job.estimatedPrice * 0.05) / 100).toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-500">at 5% rate</p>
                    </div>
                  </div>

                  {/* Top Matches */}
                  {matches.length > 0 && (
                    <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="text-purple-600" size={16} />
                        <p className="text-sm font-semibold text-purple-900">
                          Top {matches.length} Matches
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {matches.map((match, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-sm bg-white p-2 rounded"
                          >
                            <img
                              src={match.partner.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${match.partner.id}`}
                              alt={match.partner.business_name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900 truncate text-xs">
                                {match.partner.business_name}
                              </p>
                              <div className="flex items-center gap-1">
                                <Star size={10} className="text-yellow-500 fill-yellow-500" />
                                <span className="text-xs text-slate-600">{match.partner.rating}</span>
                                <span className="text-xs text-purple-600 ml-1">
                                  {match.score}% match
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleReferJob(job)}
                    className={`w-full ${theme.button.provider} justify-center`}
                  >
                    <Send size={18} />
                    Refer This Job
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700 mb-1">Jobs Referred</p>
          <p className="text-2xl font-bold text-blue-900">0</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-700 mb-1">Pending</p>
          <p className="text-2xl font-bold text-amber-900">0</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p className="text-sm text-emerald-700 mb-1">Completed</p>
          <p className="text-2xl font-bold text-emerald-900">0</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-700 mb-1">Success Rate</p>
          <p className="text-2xl font-bold text-purple-900">0%</p>
        </div>
      </div>

      {/* Job Referral Flow Modal */}
      {showReferralFlow && (
        <JobReferralFlow
          job={selectedJob}
          partners={partners}
          userId={userId}
          onClose={() => setShowReferralFlow(false)}
          onSuccess={() => {
            setShowReferralFlow(false);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}