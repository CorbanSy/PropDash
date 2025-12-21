//levlpro-mvp\src\components\ProviderDashboard\Network\utils\networkApi.js
import { supabase } from "../../../../lib/supabaseClient";

/**
 * Fetch all network data for a user
 */
export async function fetchNetworkData(userId) {
  const [connections, pendingInvites, sentInvites, allProfessionals] = await Promise.all([
    fetchConnections(userId),
    fetchPendingInvites(userId),
    fetchSentInvites(userId),
    fetchAllProfessionals(userId),
  ]);

  return {
    connections,
    pendingInvites,
    sentInvites,
    allProfessionals,
  };
}

/**
 * Fetch accepted connections
 */
async function fetchConnections(userId) {
  // Fetch connections where I'm the provider (I sent the invite)
  const { data: connectionsAsSender, error: error1 } = await supabase
    .from("professional_network")
    .select(`
      *,
      connected_provider:providers!professional_network_connected_provider_id_fkey (
        id,
        business_name,
        profile_photo,
        phone,
        phone_verified,
        services_offered,
        service_categories,
        base_rate,
        verification_status,
        is_online,
        is_available,
        service_areas
      )
    `)
    .eq("provider_id", userId)
    .eq("status", "accepted")
    .order("connected_at", { ascending: false });

  if (error1) {
    console.error("Error fetching connections (as sender):", error1);
  }

  // Fetch connections where I'm the connected_provider (they sent me the invite)
  const { data: connectionsAsReceiver, error: error2 } = await supabase
    .from("professional_network")
    .select(`
      *,
      connected_provider:providers!professional_network_provider_id_fkey (
        id,
        business_name,
        profile_photo,
        phone,
        phone_verified,
        services_offered,
        service_categories,
        base_rate,
        verification_status,
        is_online,
        is_available,
        service_areas
      )
    `)
    .eq("connected_provider_id", userId)
    .eq("status", "accepted")
    .order("connected_at", { ascending: false });

  if (error2) {
    console.error("Error fetching connections (as receiver):", error2);
  }

  // Combine both arrays
  const allConnections = [
    ...(connectionsAsSender || []),
    ...(connectionsAsReceiver || []),
  ];

  // Sort by connected_at
  allConnections.sort((a, b) => 
    new Date(b.connected_at) - new Date(a.connected_at)
  );

  console.log("✅ Total connections (both directions):", allConnections.length);
  console.log("  - As sender:", connectionsAsSender?.length || 0);
  console.log("  - As receiver:", connectionsAsReceiver?.length || 0);

  return allConnections;
}

/**
 * Fetch pending invites received
 */
async function fetchPendingInvites(userId) {
  const { data, error } = await supabase
    .from("professional_network")
    .select(`
      *,
      sender:providers!professional_network_provider_id_fkey (
        id,
        business_name,
        profile_photo,
        phone,
        services_offered,
        service_categories,
        base_rate,
        verification_status
      )
    `)
    .eq("connected_provider_id", userId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching pending invites:", error);
    return [];
  }

  return data || [];
}

/**
 * Fetch sent invites
 */
async function fetchSentInvites(userId) {
  const { data, error } = await supabase
    .from("professional_network")
    .select(`
      *,
      recipient:providers!professional_network_connected_provider_id_fkey (
        id,
        business_name,
        profile_photo,
        services_offered,
        service_categories
      )
    `)
    .eq("provider_id", userId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching sent invites:", error);
    return [];
  }

  return data || [];
}

/**
 * Fetch all professionals
 */
async function fetchAllProfessionals(userId) {
  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .neq("id", userId)
    .order("business_name", { ascending: true });

  if (error) {
    console.error("Error fetching all professionals:", error);
    return [];
  }

  return data || [];
}

/**
 * Send connection invite
 */
export async function sendInvite(senderId, recipientId, message = "") {
  const { error } = await supabase.from("professional_network").insert({
    provider_id: senderId,
    connected_provider_id: recipientId,
    connection_type: "colleague",
    status: "pending",
    notes: message,
  });

  if (error) throw error;
}

/**
 * Accept connection invite
 */
export async function acceptInvite(inviteId) {
  console.log("🔄 Accepting invite:", inviteId);
  
  const { data, error } = await supabase
    .from("professional_network")
    .update({
      status: "accepted",
      connected_at: new Date().toISOString(),
    })
    .eq("id", inviteId)
    .select(); // ✅ ADD .select() to return the updated row

  if (error) {
    console.error("❌ Error accepting invite:", error);
    throw error;
  }
  
  console.log("✅ Invite accepted successfully:", data);
}

/**
 * Decline connection invite
 */
export async function declineInvite(inviteId) {
  const { error } = await supabase
    .from("professional_network")
    .delete()
    .eq("id", inviteId);

  if (error) throw error;
}

/**
 * Cancel sent invite
 */
export async function cancelInvite(inviteId) {
  const { error } = await supabase
    .from("professional_network")
    .delete()
    .eq("id", inviteId);

  if (error) throw error;
}

/**
 * Remove connection
 */
export async function removeConnection(connectionId) {
  const { error } = await supabase
    .from("professional_network")
    .delete()
    .eq("id", connectionId);

  if (error) throw error;
}

/**
 * Check connection status between two providers
 */
export async function getConnectionStatus(userId, professionalId) {
  // Check if connected
  const { data: connection } = await supabase
    .from("professional_network")
    .select("id, status")
    .or(`and(provider_id.eq.${userId},connected_provider_id.eq.${professionalId}),and(provider_id.eq.${professionalId},connected_provider_id.eq.${userId})`)
    .maybeSingle();

  if (connection) {
    return connection.status === "accepted" ? "connected" : "pending";
  }

  return "not_connected";
}