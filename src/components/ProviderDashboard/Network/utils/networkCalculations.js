//levlpro-mvp\src\components\ProviderDashboard\Network\utils\networkCalculations.js

/**
 * Calculate network strength score (0-100)
 */
export const calculateNetworkScore = (partners, referrals) => {
  let score = 0;

  // Partners count (max 30 points)
  const partnerPoints = Math.min((partners.length / 10) * 30, 30);
  score += partnerPoints;

  // Trade diversity (max 25 points)
  const uniqueTrades = new Set(partners.map((p) => p.trade)).size;
  const tradePoints = Math.min((uniqueTrades / 8) * 25, 25);
  score += tradePoints;

  // Active referrals (max 20 points)
  const activeReferrals = referrals.filter((r) => r.status === "joined").length;
  const referralPoints = Math.min((activeReferrals / 5) * 20, 20);
  score += referralPoints;

  // Average partner rating (max 15 points)
  const avgRating = partners.length > 0
    ? partners.reduce((sum, p) => sum + (p.rating || 0), 0) / partners.length
    : 0;
  const ratingPoints = (avgRating / 5) * 15;
  score += ratingPoints;

  // Response rate (max 10 points)
  const responseRate = partners.length > 0
    ? partners.filter((p) => p.responseTime && p.responseTime < 24).length / partners.length
    : 0;
  const responsePoints = responseRate * 10;
  score += responsePoints;

  return Math.round(score);
};

/**
 * Get network strength level
 */
export const getNetworkLevel = (score) => {
  if (score >= 80) return { level: "Elite", color: "purple", icon: "⭐" };
  if (score >= 60) return { level: "Strong", color: "blue", icon: "💪" };
  if (score >= 40) return { level: "Growing", color: "green", icon: "🌱" };
  if (score >= 20) return { level: "Starting", color: "amber", icon: "🔰" };
  return { level: "New", color: "slate", icon: "🆕" };
};

/**
 * Get missing trades for better network coverage
 */
export const getMissingTrades = (partners) => {
  const essentialTrades = [
    "Plumbing",
    "Electrical",
    "HVAC",
    "Landscaping",
    "Cleaning",
    "Painting",
    "Carpentry",
    "Roofing",
  ];

  const currentTrades = new Set(partners.map((p) => p.trade));
  return essentialTrades.filter((trade) => !currentTrades.has(trade));
};

/**
 * Calculate total commissions
 */
export const calculateCommissions = (jobs, commissionRate = 0.05) => {
  const total = jobs
    .filter((j) => j.status === "completed" && j.commissionPaid === false)
    .reduce((sum, j) => sum + (j.price || 0) * commissionRate, 0);

  const pending = jobs
    .filter((j) => j.status === "completed" && j.commissionPaid === false)
    .reduce((sum, j) => sum + (j.price || 0) * commissionRate, 0);

  const paid = jobs
    .filter((j) => j.commissionPaid === true)
    .reduce((sum, j) => sum + (j.price || 0) * commissionRate, 0);

  return { total, pending, paid };
};

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

/**
 * Calculate payout schedule
 */
export const getNextPayoutDate = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Payouts on the 15th of each month
  let payoutDate = new Date(currentYear, currentMonth, 15);

  // If past 15th, next payout is 15th of next month
  if (today.getDate() > 15) {
    payoutDate = new Date(currentYear, currentMonth + 1, 15);
  }

  return payoutDate;
};

/**
 * Get referral lifecycle status
 */
export const getReferralLifecycle = (referral) => {
  const statuses = [
    { key: "invited", label: "Invited", complete: true },
    { key: "viewed", label: "Viewed Invite", complete: referral.viewedAt !== null },
    { key: "joined", label: "Signed Up", complete: referral.status === "joined" },
    { key: "job_requested", label: "Job Requested", complete: referral.jobsReferred > 0 },
    { key: "job_completed", label: "Job Completed", complete: referral.jobsCompleted > 0 },
    {
      key: "commission_paid",
      label: "Commission Paid",
      complete: referral.commissionsEarned > 0,
    },
  ];

  return statuses;
};