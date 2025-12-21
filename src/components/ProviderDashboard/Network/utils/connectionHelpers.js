//levlpro-mvp\src\components\ProviderDashboard\Network\utils\connectionHelpers.js
import { supabase } from "../../../../lib/supabaseClient";

/**
 * Transform connections data to match PartnerCard expected format
 */
export function transformConnections(connections) {
  return connections.map((connection) => {
    const provider = connection.connected_provider;
    return {
      id: connection.id,
      connectionId: connection.id,
      providerId: provider.id,
      business_name: provider.business_name,
      avatar_url: provider.profile_photo,
      trade: provider.service_categories?.[0] || provider.services_offered?.[0] || "Professional",
      verified: provider.verification_status === "verified",
      rating: 4.8,
      reviewCount: 0,
      jobsCompleted: 0,
      jobsReferred: 0,
      location: {
        city: provider.service_areas?.[0] || "Not specified",
      },
      avgResponseTime: 2,
      specialties: provider.service_categories || provider.services_offered || [],
      status: connection.status === "accepted" ? "active" : "inactive",
      phone: provider.phone,
      email: null,
      bio: null,
      connected_at: connection.connected_at,
      connection_type: connection.connection_type,
      notes: connection.notes,
      commissionsEarned: 0,
      is_online: provider.is_online,
      base_rate: provider.base_rate,
    };
  });
}

/**
 * Filter connections based on search and status
 */
export function filterConnections(connections, searchQuery, filterStatus) {
  return connections.filter((partner) => {
    // Search filter
    if (searchQuery) {
      const matchesSearch =
        partner.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.trade?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.specialties?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filterStatus !== "all") {
      if (filterStatus === "active" && partner.status !== "active") return false;
      if (filterStatus === "verified" && !partner.verified) return false;
      if (filterStatus === "online" && !partner.is_online) return false;
    }

    return true;
  });
}

/**
 * Sort connections
 */
export function sortConnections(connections, sortBy) {
  return [...connections].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.connected_at) - new Date(a.connected_at);
      case "name":
        return (a.business_name || "").localeCompare(b.business_name || "");
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "jobs":
        return (b.jobsReferred || 0) - (a.jobsReferred || 0);
      default:
        return 0;
    }
  });
}

/**
 * Calculate connection statistics
 */
export function calculateStats(rawConnections, transformedConnections) {
  return {
    total: rawConnections.length,
    active: transformedConnections.filter((p) => p.status === "active").length,
    verified: transformedConnections.filter((p) => p.verified).length,
    totalReferrals: transformedConnections.reduce((sum, p) => sum + (p.jobsReferred || 0), 0),
    totalEarnings: transformedConnections.reduce((sum, p) => sum + (p.commissionsEarned || 0), 0),
  };
}

/**
 * Accept partner agreement
 */
export async function acceptPartnerAgreement(currentUserId, partner, agreement) {
  const { error } = await supabase.from("partner_agreements").insert({
    provider_id: currentUserId,
    partner_id: partner.providerId,
    connection_id: partner.connectionId,
    agreement_text: agreement.terms,
    commission_rate: 0.05,
    accepted_at: new Date().toISOString(),
  });

  if (error) throw error;
  alert("Partner agreement accepted!");
}

/**
 * Remove connection
 */
export async function removeConnection(connectionId) {
  const { error } = await supabase.from("professional_network").delete().eq("id", connectionId);

  if (error) throw error;
  alert("Connection removed");
}