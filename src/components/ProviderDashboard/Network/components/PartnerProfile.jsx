// src/components/ProviderDashboard/Network/components/PartnerProfile.jsx
import { useState } from "react";
import {
  X,
  Star,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Clock,
  ShieldCheck,
  Send,
  MessageSquare,
  FileText,
  TrendingUp,
  Award,
} from "lucide-react";
import { theme } from "../../../../styles/theme";

export default function PartnerProfile({ partner, userId, onClose, onRefresh }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with Cover */}
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row gap-6 -mt-16 mb-6">
            <img
              src={partner.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.id}`}
              alt={partner.business_name}
              className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-xl"
            />
            <div className="flex-1 mt-16 md:mt-12">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className={theme.text.h2}>{partner.business_name}</h2>
                    {partner.verified && (
                      <ShieldCheck className="text-blue-600" size={24} />
                    )}
                  </div>
                  <p className="text-lg text-slate-600 mb-2">{partner.trade}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star size={18} className="text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-slate-900">{partner.rating?.toFixed(1)}</span>
                      <span className="text-slate-600 text-sm">({partner.reviewCount || 0} reviews)</span>
                    </div>
                    <span className="text-slate-600 text-sm">
                      {partner.jobsCompleted || 0} jobs completed
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <button className={`${theme.button.provider} flex items-center gap-2`}>
                  <Send size={18} />
                  Refer Job
                </button>
                <button className={`${theme.button.secondary} flex items-center gap-2`}>
                  <MessageSquare size={18} />
                  Message
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-slate-200 mb-6">
            <TabButton
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
              label="Overview"
            />
            <TabButton
              active={activeTab === "portfolio"}
              onClick={() => setActiveTab("portfolio")}
              label="Portfolio"
            />
            <TabButton
              active={activeTab === "reviews"}
              onClick={() => setActiveTab("reviews")}
              label="Reviews"
            />
            <TabButton
              active={activeTab === "stats"}
              onClick={() => setActiveTab("stats")}
              label="Stats"
            />
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Contact Info */}
              <div>
                <h3 className={`${theme.text.h4} mb-4`}>Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {partner.email && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Mail className="text-slate-600" size={20} />
                      <div>
                        <p className="text-xs text-slate-600">Email</p>
                        <p className="font-medium text-slate-900">{partner.email}</p>
                      </div>
                    </div>
                  )}
                  {partner.phone && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Phone className="text-slate-600" size={20} />
                      <div>
                        <p className="text-xs text-slate-600">Phone</p>
                        <p className="font-medium text-slate-900">{partner.phone}</p>
                      </div>
                    </div>
                  )}
                  {partner.location && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <MapPin className="text-slate-600" size={20} />
                      <div>
                        <p className="text-xs text-slate-600">Service Area</p>
                        <p className="font-medium text-slate-900">
                          {partner.location.city || "Not specified"}
                        </p>
                      </div>
                    </div>
                  )}
                  {partner.avgResponseTime && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Clock className="text-slate-600" size={20} />
                      <div>
                        <p className="text-xs text-slate-600">Response Time</p>
                        <p className="font-medium text-slate-900">~{partner.avgResponseTime}h</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* About */}
              {partner.bio && (
                <div>
                  <h3 className={`${theme.text.h4} mb-3`}>About</h3>
                  <p className={theme.text.body}>{partner.bio}</p>
                </div>
              )}

              {/* Specialties */}
              {partner.specialties && partner.specialties.length > 0 && (
                <div>
                  <h3 className={`${theme.text.h4} mb-3`}>Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {partner.specialties.map((specialty, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {partner.verified && (
                <div>
                  <h3 className={`${theme.text.h4} mb-3`}>Verified Credentials</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <ShieldCheck className="text-green-600" size={16} />
                      <span>Licensed & Insured</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <ShieldCheck className="text-green-600" size={16} />
                      <span>Background Checked</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <ShieldCheck className="text-green-600" size={16} />
                      <span>Insurance Verified</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "portfolio" && (
            <div>
              <h3 className={`${theme.text.h4} mb-4`}>Work Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Placeholder for portfolio images */}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-slate-200 rounded-lg flex items-center justify-center"
                  >
                    <Briefcase className="text-slate-400" size={32} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <h3 className={`${theme.text.h4} mb-4`}>Client Reviews</h3>
              <div className="space-y-4">
                {/* Sample review */}
                <div className="border-2 border-slate-200 rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="bg-slate-200 w-10 h-10 rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-slate-900">John D.</p>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className="text-yellow-500 fill-yellow-500"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">
                        Excellent work! Very professional and completed the job on time.
                      </p>
                      <p className="text-xs text-slate-500">2 weeks ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="space-y-6">
              <h3 className={`${theme.text.h4} mb-4`}>Performance Stats</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <TrendingUp className="text-blue-600 mx-auto mb-2" size={24} />
                  <p className="text-2xl font-bold text-blue-900">{partner.jobsCompleted || 0}</p>
                  <p className="text-xs text-blue-700">Jobs Completed</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
                  <Award className="text-emerald-600 mx-auto mb-2" size={24} />
                  <p className="text-2xl font-bold text-emerald-900">{partner.rating?.toFixed(1) || "0.0"}</p>
                  <p className="text-xs text-emerald-700">Average Rating</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <Clock className="text-purple-600 mx-auto mb-2" size={24} />
                  <p className="text-2xl font-bold text-purple-900">{partner.completionRate || 95}%</p>
                  <p className="text-xs text-purple-700">Completion Rate</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                  <Star className="text-amber-600 mx-auto mb-2" size={24} />
                  <p className="text-2xl font-bold text-amber-900">{partner.responseRate || 98}%</p>
                  <p className="text-xs text-amber-700">Response Rate</p>
                </div>
              </div>

              {/* Referral Stats */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Your Referral History</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-600 mb-1">Jobs Referred</p>
                    <p className="text-2xl font-bold text-slate-900">{partner.jobsReferred || 0}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-600 mb-1">Jobs Completed</p>
                    <p className="text-2xl font-bold text-slate-900">{partner.jobsCompleted || 0}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-600 mb-1">Total Earned</p>
                    <p className="text-2xl font-bold text-slate-900">
                      ${(partner.commissionsEarned || 0).toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 font-semibold transition relative ${
        active ? "text-blue-700" : "text-slate-600 hover:text-slate-900"
      }`}
    >
      {label}
      {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>}
    </button>
  );
}