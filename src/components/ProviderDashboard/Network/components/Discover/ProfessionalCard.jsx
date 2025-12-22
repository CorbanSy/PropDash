import { useState } from "react";
import {
  UserPlus,
  Clock,
  Bell,
  UserCheck,
  MessageSquare,
  Send,
  CheckCircle,
  Shield,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../../../lib/supabaseClient";
import { theme } from "../../../../../styles/theme";

export default function ProfessionalCard({
  professional,
  connectionStatus,
  onSendInvite,
  currentUserId,
  connections,
}) {
  const navigate = useNavigate();
  const isVerified = professional.verification_status === "verified";

  const serviceIcons = {
    handyman: "🔧",
    plumbing: "🚰",
    electrical: "⚡",
    hvac: "❄️",
    carpentry: "🪚",
    painting: "🎨",
    landscaping: "🌳",
    cleaning: "🧹",
    assembly: "📦",
  };

  const primaryService =
    professional.service_categories?.[0] ||
    professional.services_offered?.[0] ||
    "Service Provider";

  const handleMessage = async () => {
    if (connectionStatus !== "connected") {
      alert("You must be connected with this professional to send messages.");
      return;
    }

    try {
      // Check for existing conversation
      const { data: existingConv1 } = await supabase
        .from("provider_conversations")
        .select("id")
        .eq("provider1_id", currentUserId)
        .eq("provider2_id", professional.id)
        .maybeSingle();

      const { data: existingConv2 } = await supabase
        .from("provider_conversations")
        .select("id")
        .eq("provider1_id", professional.id)
        .eq("provider2_id", currentUserId)
        .maybeSingle();

      let conversationId;
      const existingConv = existingConv1 || existingConv2;

      if (existingConv) {
        conversationId = existingConv.id;
      } else {
        const { data: newConv, error: convError } = await supabase
          .from("provider_conversations")
          .insert({
            provider1_id: currentUserId,
            provider2_id: professional.id,
            last_message_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (convError) throw convError;
        conversationId = newConv.id;
      }

      navigate("/provider/messages", {
        state: {
          professionalId: professional.id,
          conversationId: conversationId,
          openTab: "professionals",
        },
      });
    } catch (error) {
      console.error("Error creating conversation:", error);
      alert("Failed to open conversation. Please try again.");
    }
  };

  const handleReferral = () => {
    if (connectionStatus !== "connected") {
      alert(
        "You must be connected with this professional to send referrals. Send them a connection invite first!"
      );
      return;
    }

    const connection = connections.find(
      (c) => c.connected_provider?.id === professional.id
    );

    if (connection) {
      navigate("/provider/network", {
        state: {
          openReferral: true,
          professionalId: professional.id,
          connectionId: connection.id,
        },
      });
    }
  };

  const getConnectionButton = () => {
    switch (connectionStatus) {
      case "connected":
        return (
          <div className="flex items-center gap-1 px-3 py-2 bg-success-50 text-success-700 rounded-lg font-semibold text-sm">
            <UserCheck size={14} />
            Connected
          </div>
        );
      case "pending_sent":
        return (
          <div className="flex items-center gap-1 px-3 py-2 bg-warning-50 text-warning-700 rounded-lg font-semibold text-sm">
            <Clock size={14} />
            Invite Sent
          </div>
        );
      case "pending_received":
        return (
          <div className="flex items-center gap-1 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg font-semibold text-sm">
            <Bell size={14} />
            Invited You
          </div>
        );
      default:
        return (
          <button
            onClick={() => onSendInvite(professional)}
            className={`${theme.button.primary} text-sm`}
          >
            <UserPlus size={14} />
            Connect
          </button>
        );
    }
  };

  return (
    <div className={`${theme.card.base} ${theme.card.padding} ${theme.card.hover}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          {/* Profile Photo */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
            {professional.profile_photo ? (
              <img
                src={professional.profile_photo}
                alt={professional.business_name}
                className="w-full h-full object-cover"
              />
            ) : (
              professional.business_name?.charAt(0).toUpperCase() || "P"
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`${theme.text.h5} truncate`}>
                {professional.business_name || "Professional"}
              </h3>
              {isVerified && (
                <CheckCircle className="text-success-600 flex-shrink-0" size={14} />
              )}
            </div>
            <p className={`${theme.text.caption} capitalize truncate`}>
              {primaryService}
            </p>
          </div>
        </div>

        {professional.is_online && (
          <div className="flex items-center gap-1 text-xs flex-shrink-0">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
            <span className="text-success-700 font-medium">Online</span>
          </div>
        )}
      </div>

      {/* Services */}
      {(professional.service_categories || professional.services_offered) && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            {(professional.service_categories || professional.services_offered)
              ?.slice(0, 3)
              .map((service, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs font-medium"
                >
                  <span>{serviceIcons[service] || "🔨"}</span>
                  <span className="capitalize">{service}</span>
                </div>
              ))}
            {(professional.service_categories || professional.services_offered)
              ?.length > 3 && (
              <div className="bg-slate-100 text-secondary-600 px-2 py-1 rounded text-xs font-medium">
                +
                {(professional.service_categories || professional.services_offered)
                  .length - 3}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Info */}
      <div className={`space-y-1.5 ${theme.text.caption} mb-4`}>
        {professional.base_rate && (
          <div className="flex items-center gap-2">
            <TrendingUp size={12} />
            <span>${(professional.base_rate / 100).toFixed(0)}/hr</span>
          </div>
        )}
        {professional.verification_status && (
          <div className="flex items-center gap-2">
            <Shield
              size={12}
              className={
                professional.verification_status === "verified"
                  ? "text-success-600"
                  : "text-secondary-400"
              }
            />
            <span className="capitalize">{professional.verification_status}</span>
          </div>
        )}
      </div>

      {/* Connection Status */}
      <div className="mb-3">{getConnectionButton()}</div>

      {/* Actions */}
      {connectionStatus === "connected" && (
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleMessage}
            className={`${theme.button.primary} text-sm justify-center`}
          >
            <MessageSquare size={14} />
            Message
          </button>
          <button
            onClick={handleReferral}
            className={`${theme.button.primaryOutline} text-sm justify-center`}
          >
            <Send size={14} />
            Refer
          </button>
        </div>
      )}
    </div>
  );
}