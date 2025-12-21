//levlpro-mvp\src\components\ProviderDashboard\Network\utils\commissionRules.js

/**
 * Default commission structure
 */
export const defaultCommissionRules = {
  standardRate: 0.05, // 5%
  vipRate: 0.10, // 10%
  minimumPayout: 25, // $25 minimum
  payoutSchedule: "monthly", // monthly, biweekly, weekly
  payoutDay: 15, // Day of month
};

/**
 * Calculate commission for a job
 */
export const calculateJobCommission = (jobPrice, partnerTier = "standard") => {
  const rate = partnerTier === "vip" ? defaultCommissionRules.vipRate : defaultCommissionRules.standardRate;
  return Math.round(jobPrice * rate * 100) / 100;
};

/**
 * Check if payout threshold is met
 */
export const canRequestPayout = (pendingAmount) => {
  return pendingAmount >= defaultCommissionRules.minimumPayout;
};

/**
 * Get partner agreement template
 */
export const getPartnerAgreement = (providerName, partnerName) => {
  return {
    agreementDate: new Date().toISOString(),
    version: "1.0",
    terms: `
PARTNER REFERRAL AGREEMENT

This Agreement is entered into between:
- ${providerName} ("Referring Provider")
- ${partnerName} ("Partner Provider")

1. REFERRAL TERMS
   - Referring Provider may refer clients to Partner Provider
   - Partner Provider agrees to provide quality service
   - Both parties maintain independent contractor status

2. COMMISSION STRUCTURE
   - Standard Rate: ${defaultCommissionRules.standardRate * 100}% of job total
   - VIP Rate: ${defaultCommissionRules.vipRate * 100}% of job total (negotiable)
   - Commission paid monthly on the ${defaultCommissionRules.payoutDay}th
   - Minimum payout threshold: $${defaultCommissionRules.minimumPayout}

3. PAYMENT TERMS
   - Commission calculated on completed jobs only
   - Payment via Stripe Connect
   - Partner responsible for service quality
   - Refunds may affect commission

4. RESPONSIBILITIES
   Partner Provider agrees to:
   - Respond to referrals within 24 hours
   - Maintain insurance and licensing
   - Provide quality service
   - Honor quoted prices
   - Update availability status

5. TERMINATION
   - Either party may terminate with 30 days notice
   - Pending commissions will be paid out
   - Client relationships remain with Partner

6. LIABILITY
   - Each party maintains own insurance
   - Partner responsible for work performed
   - Referring Provider not liable for Partner's work

By accepting, both parties agree to these terms.
    `.trim(),
  };
};

/**
 * Commission tier benefits
 */
export const commissionTiers = [
  {
    tier: "standard",
    rate: 0.05,
    benefits: ["5% commission", "Monthly payouts", "Standard support"],
    requirements: [],
  },
  {
    tier: "vip",
    rate: 0.10,
    benefits: [
      "10% commission",
      "Priority referrals",
      "Bi-weekly payouts",
      "Featured in search",
      "Premium support",
    ],
    requirements: [
      "50+ completed jobs",
      "4.8+ rating",
      "90%+ completion rate",
      "Verified license & insurance",
    ],
  },
];