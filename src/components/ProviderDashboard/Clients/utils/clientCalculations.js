// src/components/ProviderDashboard/Clients/utils/clientCalculations.js

/**
 * Calculate Client Lifetime Value
 */
export const calculateCLV = (client, jobs) => {
  const totalSpent = jobs
    .filter(j => j.status === "completed")
    .reduce((sum, j) => sum + (j.total || 0), 0);

  const firstJobDate = jobs.length > 0 
    ? new Date(jobs[0].created_at)
    : new Date();
  
  const yearsAsClient = Math.max(
    (Date.now() - firstJobDate.getTime()) / (1000 * 60 * 60 * 24 * 365),
    0.1 // minimum 0.1 years
  );

  return totalSpent / yearsAsClient;
};

/**
 * Calculate average jobs per year
 */
export const calculateFrequency = (jobs) => {
  if (jobs.length === 0) return 0;

  const firstJobDate = new Date(jobs[0].created_at);
  const yearsAsClient = Math.max(
    (Date.now() - firstJobDate.getTime()) / (1000 * 60 * 60 * 24 * 365),
    0.1
  );

  return jobs.length / yearsAsClient;
};

/**
 * Get days since last job
 */
export const getDaysSinceLastJob = (jobs) => {
  if (jobs.length === 0) return null;

  const sortedJobs = [...jobs].sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  );

  const lastJobDate = new Date(sortedJobs[0].created_at);
  const daysSince = Math.floor((Date.now() - lastJobDate.getTime()) / (1000 * 60 * 60 * 24));

  return daysSince;
};

/**
 * Get client status based on last activity
 */
export const getClientStatus = (jobs) => {
  const daysSince = getDaysSinceLastJob(jobs);

  if (daysSince === null) {
    return { status: "New", color: "blue", description: "No jobs yet" };
  }

  if (daysSince <= 90) {
    return { status: "Active", color: "green", description: "Recently booked" };
  }

  if (daysSince <= 180) {
    return { status: "Dormant", color: "amber", description: "Follow up recommended" };
  }

  return { status: "Lost", color: "red", description: "Re-engagement needed" };
};

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Calculate revenue by month for a client
 */
export const getRevenueByMonth = (jobs, months = 12) => {
  const data = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = month.toLocaleDateString("en-US", { month: "short" });

    const revenue = jobs
      .filter(j => {
        const jobDate = new Date(j.created_at);
        return (
          j.status === "completed" &&
          jobDate.getMonth() === month.getMonth() &&
          jobDate.getFullYear() === month.getFullYear()
        );
      })
      .reduce((sum, j) => sum + (j.total || 0), 0);

    data.push({ month: monthName, revenue });
  }

  return data;
};

/**
 * Get client risk score (0-100)
 */
export const getClientRiskScore = (client, jobs) => {
  let risk = 0;

  // Days since last job
  const daysSince = getDaysSinceLastJob(jobs);
  if (daysSince > 180) risk += 40;
  else if (daysSince > 90) risk += 20;

  // Job frequency declining
  const recentJobs = jobs.filter(j => {
    const jobDate = new Date(j.created_at);
    return (Date.now() - jobDate.getTime()) < (180 * 24 * 60 * 60 * 1000);
  }).length;

  const olderJobs = jobs.filter(j => {
    const jobDate = new Date(j.created_at);
    const timeSince = Date.now() - jobDate.getTime();
    return timeSince >= (180 * 24 * 60 * 60 * 1000) && timeSince < (360 * 24 * 60 * 60 * 1000);
  }).length;

  if (olderJobs > recentJobs) risk += 30;

  // Low rating
  if (client.internalRating && client.internalRating < 3) risk += 20;

  // Payment issues
  if (client.paymentIssues) risk += 10;

  return Math.min(risk, 100);
};