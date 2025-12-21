//levlpro-mvp\src\components\ProviderDashboard\Network\utils\connectionTransformers.js

/**
 * Transform a single connection to partner format
 */
export function transformConnectionToPartner(connection) {
  const provider = connection.connected_provider;
  
  if (!provider) {
    console.warn('Connection missing provider data:', connection);
    return null;
  }

  return {
    // Core IDs
    id: connection.id,
    connectionId: connection.id,
    providerId: provider.id,

    // Basic Info
    business_name: provider.business_name || "Professional",
    avatar_url: provider.profile_photo || null,
    trade: getPrimaryTrade(provider),
    
    // Verification
    verified: provider.verification_status === "verified",
    verification_status: provider.verification_status,
    
    // Ratings & Reviews (can be enhanced with actual data)
    rating: calculateRating(provider),
    reviewCount: provider.review_count || 0,
    
    // Job Stats (can be enhanced with actual queries)
    jobsCompleted: provider.jobs_completed || 0,
    jobsReferred: connection.referrals_sent || 0,
    
    // Location
    location: {
      city: getLocationCity(provider),
      areas: provider.service_areas || [],
    },
    
    // Performance
    avgResponseTime: provider.avg_response_time || 2,
    completionRate: provider.completion_rate || 95,
    responseRate: provider.response_rate || 98,
    
    // Services
    specialties: getSpecialties(provider),
    service_categories: provider.service_categories || [],
    services_offered: provider.services_offered || [],
    
    // Status
    status: connection.status === "accepted" ? "active" : "inactive",
    is_online: provider.is_online || false,
    is_available: provider.is_available || false,
    
    // Contact
    phone: provider.phone || null,
    phone_verified: provider.phone_verified || false,
    email: provider.email || null,
    
    // Business Details
    bio: provider.bio || null,
    base_rate: provider.base_rate || 0,
    
    // Connection Details
    connected_at: connection.connected_at,
    connection_type: connection.connection_type || "colleague",
    notes: connection.notes || null,
    
    // Financial (can be enhanced with actual commission data)
    commissionsEarned: connection.commissions_earned || 0,
    totalRevenue: connection.total_revenue || 0,
    
    // Metadata
    created_at: connection.created_at,
    updated_at: provider.updated_at,
  };
}

/**
 * Transform multiple connections to partner format
 */
export function transformConnections(connections) {
  return connections
    .map(transformConnectionToPartner)
    .filter(partner => partner !== null); // Remove any null results
}

/**
 * Transform partner back to connection update format
 */
export function transformPartnerToConnectionUpdate(partner) {
  return {
    connection_type: partner.connection_type,
    notes: partner.notes,
    status: partner.status === "active" ? "accepted" : "pending",
  };
}

/**
 * Get primary trade/service category
 */
function getPrimaryTrade(provider) {
  if (provider.service_categories && provider.service_categories.length > 0) {
    return formatServiceName(provider.service_categories[0]);
  }
  if (provider.services_offered && provider.services_offered.length > 0) {
    return formatServiceName(provider.services_offered[0]);
  }
  return "Professional";
}

/**
 * Get location city
 */
function getLocationCity(provider) {
  if (provider.service_areas && provider.service_areas.length > 0) {
    return provider.service_areas[0];
  }
  return "Not specified";
}

/**
 * Get all specialties
 */
function getSpecialties(provider) {
  const specialties = new Set();
  
  if (provider.service_categories) {
    provider.service_categories.forEach(cat => specialties.add(cat));
  }
  
  if (provider.services_offered) {
    provider.services_offered.forEach(service => specialties.add(service));
  }
  
  return Array.from(specialties);
}

/**
 * Calculate rating (placeholder - replace with actual calculation)
 */
function calculateRating(provider) {
  // If you have a ratings table, calculate actual rating
  // For now, return a default or stored value
  return provider.average_rating || 4.8;
}

/**
 * Format service name for display
 */
function formatServiceName(serviceName) {
  if (!serviceName) return "Service";
  
  return serviceName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Transform invite to partner format
 */
export function transformInviteToPartner(invite, isSent = false) {
  const provider = isSent ? invite.recipient : invite.sender;
  
  if (!provider) {
    console.warn('Invite missing provider data:', invite);
    return null;
  }

  return {
    // Core IDs
    id: invite.id,
    inviteId: invite.id,
    providerId: provider.id,

    // Basic Info
    business_name: provider.business_name || "Professional",
    avatar_url: provider.profile_photo || null,
    trade: getPrimaryTrade(provider),
    
    // Verification
    verified: provider.verification_status === "verified",
    
    // Services
    specialties: getSpecialties(provider),
    service_categories: provider.service_categories || [],
    
    // Invite Details
    status: invite.status,
    notes: invite.notes || null,
    connection_type: invite.connection_type || "colleague",
    created_at: invite.created_at,
    
    // Contact
    phone: provider.phone || null,
    base_rate: provider.base_rate || 0,
  };
}

/**
 * Transform multiple invites
 */
export function transformInvites(invites, isSent = false) {
  return invites
    .map(invite => transformInviteToPartner(invite, isSent))
    .filter(partner => partner !== null);
}

/**
 * Transform provider to discovery format (for All Professionals tab)
 */
export function transformProviderToDiscovery(provider) {
  return {
    // Core IDs
    id: provider.id,
    providerId: provider.id,

    // Basic Info
    business_name: provider.business_name || "Professional",
    avatar_url: provider.profile_photo || null,
    trade: getPrimaryTrade(provider),
    
    // Verification
    verified: provider.verification_status === "verified",
    verification_status: provider.verification_status,
    
    // Services
    specialties: getSpecialties(provider),
    service_categories: provider.service_categories || [],
    services_offered: provider.services_offered || [],
    
    // Status
    is_online: provider.is_online || false,
    is_available: provider.is_available || false,
    
    // Contact
    phone: provider.phone || null,
    phone_verified: provider.phone_verified || false,
    
    // Business Details
    base_rate: provider.base_rate || 0,
    
    // Location
    service_areas: provider.service_areas || [],
  };
}

/**
 * Transform multiple providers to discovery format
 */
export function transformProvidersToDiscovery(providers) {
  return providers.map(transformProviderToDiscovery);
}

/**
 * Enrich partner with additional statistics
 */
export async function enrichPartnerWithStats(partner, currentUserId) {
  // This is a placeholder for when you want to fetch real-time stats
  // You can call this function to get live data from the database
  
  try {
    // Example: Fetch actual job stats
    // const { data: jobStats } = await supabase
    //   .from('jobs')
    //   .select('status')
    //   .eq('provider_id', partner.providerId);
    
    // Example: Fetch actual referral stats
    // const { data: referralStats } = await supabase
    //   .from('referrals')
    //   .select('*')
    //   .eq('referring_provider_id', currentUserId)
    //   .eq('referred_provider_id', partner.providerId);
    
    return {
      ...partner,
      // jobsCompleted: jobStats?.filter(j => j.status === 'completed').length || 0,
      // jobsReferred: referralStats?.length || 0,
    };
  } catch (error) {
    console.error('Error enriching partner stats:', error);
    return partner;
  }
}

/**
 * Transform connection for display in different contexts
 */
export function transformConnectionForContext(connection, context = 'grid') {
  const basePartner = transformConnectionToPartner(connection);
  
  if (!basePartner) return null;
  
  switch (context) {
    case 'grid':
      // Full data for grid view
      return basePartner;
      
    case 'list':
      // Simplified for list view
      return {
        id: basePartner.id,
        business_name: basePartner.business_name,
        avatar_url: basePartner.avatar_url,
        trade: basePartner.trade,
        verified: basePartner.verified,
        is_online: basePartner.is_online,
      };
      
    case 'dropdown':
      // Minimal for dropdown selects
      return {
        id: basePartner.providerId,
        label: basePartner.business_name,
        value: basePartner.providerId,
      };
      
    case 'message':
      // For messaging UI
      return {
        id: basePartner.providerId,
        name: basePartner.business_name,
        avatar: basePartner.avatar_url,
        online: basePartner.is_online,
      };
      
    default:
      return basePartner;
  }
}

/**
 * Batch transform for different contexts
 */
export function transformConnectionsForContext(connections, context = 'grid') {
  return connections
    .map(conn => transformConnectionForContext(conn, context))
    .filter(item => item !== null);
}

/**
 * Sort transformed connections by various criteria
 */
export function sortTransformedConnections(connections, sortBy = 'recent') {
  const sorted = [...connections];
  
  switch (sortBy) {
    case 'recent':
      return sorted.sort((a, b) => 
        new Date(b.connected_at) - new Date(a.connected_at)
      );
      
    case 'name':
      return sorted.sort((a, b) => 
        (a.business_name || '').localeCompare(b.business_name || '')
      );
      
    case 'rating':
      return sorted.sort((a, b) => 
        (b.rating || 0) - (a.rating || 0)
      );
      
    case 'jobs':
      return sorted.sort((a, b) => 
        (b.jobsReferred || 0) - (a.jobsReferred || 0)
      );
      
    case 'earnings':
      return sorted.sort((a, b) => 
        (b.commissionsEarned || 0) - (a.commissionsEarned || 0)
      );
      
    case 'online':
      return sorted.sort((a, b) => {
        if (a.is_online && !b.is_online) return -1;
        if (!a.is_online && b.is_online) return 1;
        return 0;
      });
      
    default:
      return sorted;
  }
}

/**
 * Group connections by criteria
 */
export function groupConnectionsBy(connections, groupBy = 'trade') {
  const groups = {};
  
  connections.forEach(connection => {
    let key;
    
    switch (groupBy) {
      case 'trade':
        key = connection.trade;
        break;
      case 'status':
        key = connection.status;
        break;
      case 'verified':
        key = connection.verified ? 'Verified' : 'Unverified';
        break;
      case 'location':
        key = connection.location.city;
        break;
      case 'connection_type':
        key = connection.connection_type;
        break;
      default:
        key = 'Other';
    }
    
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(connection);
  });
  
  return groups;
}

/**
 * Calculate aggregate statistics for connections
 */
export function calculateConnectionStats(connections) {
  const stats = {
    total: connections.length,
    active: 0,
    verified: 0,
    online: 0,
    totalReferrals: 0,
    totalEarnings: 0,
    avgRating: 0,
    byTrade: {},
    byLocation: {},
  };
  
  let totalRating = 0;
  let ratedCount = 0;
  
  connections.forEach(conn => {
    // Count statuses
    if (conn.status === 'active') stats.active++;
    if (conn.verified) stats.verified++;
    if (conn.is_online) stats.online++;
    
    // Sum financials
    stats.totalReferrals += conn.jobsReferred || 0;
    stats.totalEarnings += conn.commissionsEarned || 0;
    
    // Average rating
    if (conn.rating) {
      totalRating += conn.rating;
      ratedCount++;
    }
    
    // Group by trade
    const trade = conn.trade;
    if (!stats.byTrade[trade]) {
      stats.byTrade[trade] = 0;
    }
    stats.byTrade[trade]++;
    
    // Group by location
    const location = conn.location.city;
    if (!stats.byLocation[location]) {
      stats.byLocation[location] = 0;
    }
    stats.byLocation[location]++;
  });
  
  // Calculate average rating
  stats.avgRating = ratedCount > 0 ? (totalRating / ratedCount).toFixed(1) : 0;
  
  return stats;
}

/**
 * Export connections to CSV format
 */
export function exportConnectionsToCSV(connections) {
  const headers = [
    'Business Name',
    'Trade',
    'Phone',
    'Verified',
    'Status',
    'Jobs Referred',
    'Commissions Earned',
    'Rating',
    'Connected Date',
  ];
  
  const rows = connections.map(conn => [
    conn.business_name,
    conn.trade,
    conn.phone || 'N/A',
    conn.verified ? 'Yes' : 'No',
    conn.status,
    conn.jobsReferred || 0,
    `$${(conn.commissionsEarned || 0).toFixed(2)}`,
    conn.rating || 'N/A',
    new Date(conn.connected_at).toLocaleDateString(),
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csvContent;
}

/**
 * Validate transformed partner data
 */
export function validatePartnerData(partner) {
  const errors = [];
  
  if (!partner.business_name || partner.business_name.trim() === '') {
    errors.push('Business name is required');
  }
  
  if (!partner.providerId) {
    errors.push('Provider ID is required');
  }
  
  if (partner.phone && !isValidPhone(partner.phone)) {
    errors.push('Invalid phone number format');
  }
  
  if (partner.rating && (partner.rating < 0 || partner.rating > 5)) {
    errors.push('Rating must be between 0 and 5');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Helper: Validate phone number
 */
function isValidPhone(phone) {
  // Basic phone validation - adjust regex as needed
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * Create a partner summary for quick display
 */
export function createPartnerSummary(partner) {
  return {
    id: partner.providerId,
    name: partner.business_name,
    trade: partner.trade,
    verified: partner.verified,
    online: partner.is_online,
    rating: partner.rating,
    stats: {
      jobsReferred: partner.jobsReferred,
      earnings: partner.commissionsEarned,
    },
  };
}

/**
 * Merge partner data with real-time updates
 */
export function mergePartnerUpdates(existingPartner, updates) {
  return {
    ...existingPartner,
    ...updates,
    // Preserve arrays if not in updates
    specialties: updates.specialties || existingPartner.specialties,
    service_categories: updates.service_categories || existingPartner.service_categories,
    services_offered: updates.services_offered || existingPartner.services_offered,
    // Update timestamp
    updated_at: new Date().toISOString(),
  };
}