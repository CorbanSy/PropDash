// src/components/ProviderDashboard/Network/utils/matchmakingAlgorithm.js

/**
 * Calculate match score between job and partner (0-100)
 */
export const calculateMatchScore = (job, partner, userLocation) => {
  let score = 0;

  // Trade match (30 points)
  if (partner.trade === job.requiredTrade) {
    score += 30;
  }

  // Rating (20 points)
  const ratingPoints = ((partner.rating || 0) / 5) * 20;
  score += ratingPoints;

  // Availability (20 points)
  if (partner.availability?.includes(job.scheduledDate)) {
    score += 20;
  } else if (partner.generallyAvailable) {
    score += 10;
  }

  // Distance (15 points) - closer is better
  const distance = calculateDistance(userLocation, partner.location);
  if (distance < 5) score += 15;
  else if (distance < 10) score += 10;
  else if (distance < 20) score += 5;

  // Response time (10 points)
  if (partner.avgResponseTime < 1) score += 10; // < 1 hour
  else if (partner.avgResponseTime < 4) score += 7; // < 4 hours
  else if (partner.avgResponseTime < 24) score += 4; // < 24 hours

  // Completion rate (5 points)
  const completionRate = partner.completionRate || 0;
  score += completionRate * 5;

  return Math.round(score);
};

/**
 * Find best matching partners for a job
 */
export const findBestMatches = (job, partners, userLocation, limit = 5) => {
  const matches = partners
    .filter((p) => p.status === "active" && p.verified)
    .map((partner) => ({
      partner,
      score: calculateMatchScore(job, partner, userLocation),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return matches;
};

/**
 * Calculate distance between two locations (simplified)
 */
function calculateDistance(loc1, loc2) {
  if (!loc1 || !loc2) return 999;

  // Simplified distance calculation
  // In production, use proper geolocation library
  const lat1 = loc1.lat || 0;
  const lon1 = loc1.lng || 0;
  const lat2 = loc2.lat || 0;
  const lon2 = loc2.lng || 0;

  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal
};

/**
 * Filter partners by criteria
 */
export const filterPartners = (partners, filters) => {
  let filtered = [...partners];

  // Trade filter
  if (filters.trade && filters.trade !== "all") {
    filtered = filtered.filter((p) => p.trade === filters.trade);
  }

  // Rating filter
  if (filters.minRating) {
    filtered = filtered.filter((p) => (p.rating || 0) >= filters.minRating);
  }

  // Availability filter
  if (filters.availableNow) {
    filtered = filtered.filter((p) => p.generallyAvailable);
  }

  // Verified filter
  if (filters.verifiedOnly) {
    filtered = filtered.filter((p) => p.verified);
  }

  // Distance filter (miles)
  if (filters.maxDistance && filters.userLocation) {
    filtered = filtered.filter(
      (p) => calculateDistance(filters.userLocation, p.location) <= filters.maxDistance
    );
  }

  return filtered;
};

/**
 * Sort partners by criteria
 */
export const sortPartners = (partners, sortBy) => {
  const sorted = [...partners];

  switch (sortBy) {
    case "rating":
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case "responseTime":
      return sorted.sort((a, b) => (a.avgResponseTime || 999) - (b.avgResponseTime || 999));
    case "jobsCompleted":
      return sorted.sort((a, b) => (b.jobsCompleted || 0) - (a.jobsCompleted || 0));
    case "distance":
      // Would need user location
      return sorted;
    case "newest":
      return sorted.sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt));
    default:
      return sorted;
  }
};