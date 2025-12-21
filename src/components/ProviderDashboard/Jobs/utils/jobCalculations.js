//levlpro-mvp\src\components\ProviderDashboard\Jobs\utils\jobCalculations.js

/**
 * Calculate total revenue from jobs
 */
export const calculateTotalRevenue = (jobs) => {
  return jobs
    .filter(j => j.status === "completed" || j.status === "paid")
    .reduce((sum, j) => sum + (j.total || 0), 0);
};

/**
 * Calculate pending revenue (scheduled but not completed)
 */
export const calculatePendingRevenue = (jobs) => {
  return jobs
    .filter(j => j.status === "scheduled" || j.status === "in_progress")
    .reduce((sum, j) => sum + (j.total || 0), 0);
};

/**
 * Calculate outstanding payments
 */
export const calculateOutstandingPayments = (jobs) => {
  return jobs
    .filter(j => j.status === "completed" && !j.paid)
    .reduce((sum, j) => sum + (j.total || 0), 0);
};

/**
 * Get jobs by status
 */
export const getJobsByStatus = (jobs, status) => {
  return jobs.filter(j => j.status === status);
};

/**
 * Get upcoming jobs (next 7 days)
 */
export const getUpcomingJobs = (jobs) => {
  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return jobs.filter(j => {
    const jobDate = new Date(j.scheduled_date);
    return jobDate >= now && jobDate <= weekFromNow && j.status !== "cancelled";
  }).sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date));
};

/**
 * Get overdue jobs
 */
export const getOverdueJobs = (jobs) => {
  const now = new Date();
  return jobs.filter(j => {
    const jobDate = new Date(j.scheduled_date);
    return jobDate < now && j.status === "scheduled";
  });
};

/**
 * Calculate average job value
 */
export const calculateAverageJobValue = (jobs) => {
  const completedJobs = jobs.filter(j => j.status === "completed" || j.status === "paid");
  if (completedJobs.length === 0) return 0;
  
  const total = completedJobs.reduce((sum, j) => sum + (j.total || 0), 0);
  return total / completedJobs.length;
};

/**
 * Calculate completion rate
 */
export const calculateCompletionRate = (jobs) => {
  const totalJobs = jobs.length;
  if (totalJobs === 0) return 0;
  
  const completedJobs = jobs.filter(j => 
    j.status === "completed" || j.status === "paid"
  ).length;
  
  return (completedJobs / totalJobs) * 100;
};

/**
 * Get revenue by month
 */
export const getRevenueByMonth = (jobs, months = 12) => {
  const data = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = month.toLocaleDateString("en-US", { month: "short" });

    const revenue = jobs
      .filter(j => {
        const jobDate = new Date(j.completed_at || j.scheduled_date);
        return (
          (j.status === "completed" || j.status === "paid") &&
          jobDate.getMonth() === month.getMonth() &&
          jobDate.getFullYear() === month.getFullYear()
        );
      })
      .reduce((sum, j) => sum + (j.total || 0), 0);

    data.push({ month: monthName, revenue, jobCount: jobs.filter(j => {
      const jobDate = new Date(j.completed_at || j.scheduled_date);
      return (
        (j.status === "completed" || j.status === "paid") &&
        jobDate.getMonth() === month.getMonth() &&
        jobDate.getFullYear() === month.getFullYear()
      );
    }).length });
  }

  return data;
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
 * Format date
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Format time
 */
export const formatTime = (timeString) => {
  if (!timeString) return "";
  
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  
  return `${displayHour}:${minutes} ${ampm}`;
};

/**
 * Get job duration (if has start and end time)
 */
export const getJobDuration = (job) => {
  if (!job.time_started || !job.time_completed) return null;
  
  const start = new Date(job.time_started);
  const end = new Date(job.time_completed);
  const diffMs = end - start;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${diffHours}h ${diffMinutes}m`;
};