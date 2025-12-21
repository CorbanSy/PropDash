//levlpro-mvp\src\components\ProviderDashboard\Jobs\utils\jobHelpers.js

/**
 * Get status badge configuration
 */
export const getStatusBadge = (status) => {
  const badges = {
    scheduled: {
      color: "bg-blue-100 text-blue-700 border-blue-200",
      icon: "📅",
      label: "Scheduled",
    },
    in_progress: {
      color: "bg-purple-100 text-purple-700 border-purple-200",
      icon: "🔨",
      label: "In Progress",
    },
    completed: {
      color: "bg-green-100 text-green-700 border-green-200",
      icon: "✅",
      label: "Completed",
    },
    paid: {
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: "💰",
      label: "Paid",
    },
    cancelled: {
      color: "bg-red-100 text-red-700 border-red-200",
      icon: "❌",
      label: "Cancelled",
    },
    pending: {
      color: "bg-amber-100 text-amber-700 border-amber-200",
      icon: "⏳",
      label: "Pending",
    },
  };

  return badges[status] || badges.pending;
};

/**
 * Get priority badge
 */
export const getPriorityBadge = (priority) => {
  const badges = {
    high: {
      color: "bg-red-100 text-red-700 border-red-200",
      label: "High Priority",
    },
    medium: {
      color: "bg-amber-100 text-amber-700 border-amber-200",
      label: "Medium Priority",
    },
    low: {
      color: "bg-slate-100 text-slate-700 border-slate-200",
      label: "Low Priority",
    },
  };

  return badges[priority] || badges.low;
};

/**
 * Get next available statuses for transition
 */
export const getAvailableStatuses = (currentStatus) => {
  const transitions = {
    scheduled: ["in_progress", "cancelled"],
    in_progress: ["completed", "cancelled"],
    completed: ["paid"],
    paid: [],
    cancelled: ["scheduled"],
    pending: ["scheduled", "cancelled"],
  };

  return transitions[currentStatus] || [];
};

/**
 * Validate job data
 */
export const validateJob = (jobData) => {
  const errors = [];

  if (!jobData.service_name?.trim()) {
    errors.push("Service name is required");
  }

  if (!jobData.scheduled_date) {
    errors.push("Scheduled date is required");
  }

  if (!jobData.customer_id && !jobData.client_name) {
    errors.push("Customer information is required");
  }

  if (jobData.total && jobData.total < 0) {
    errors.push("Total amount cannot be negative");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Calculate estimated completion time
 */
export const calculateEstimatedCompletion = (scheduledDate, scheduledTime, estimatedHours) => {
  if (!scheduledDate || !estimatedHours) return null;

  const date = new Date(scheduledDate);
  
  if (scheduledTime) {
    const [hours, minutes] = scheduledTime.split(":");
    date.setHours(parseInt(hours), parseInt(minutes));
  }

  date.setHours(date.getHours() + parseFloat(estimatedHours));

  return date;
};

/**
 * Check if job is overdue
 */
export const isJobOverdue = (job) => {
  if (job.status !== "scheduled") return false;
  
  const now = new Date();
  const jobDate = new Date(job.scheduled_date);
  
  if (job.scheduled_time) {
    const [hours, minutes] = job.scheduled_time.split(":");
    jobDate.setHours(parseInt(hours), parseInt(minutes));
  }
  
  return jobDate < now;
};

/**
 * Get time until job
 */
export const getTimeUntilJob = (scheduledDate, scheduledTime) => {
  const now = new Date();
  const jobDate = new Date(scheduledDate);
  
  if (scheduledTime) {
    const [hours, minutes] = scheduledTime.split(":");
    jobDate.setHours(parseInt(hours), parseInt(minutes));
  }
  
  const diffMs = jobDate - now;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  } else if (diffMs > 0) {
    return "Less than 1 hour";
  } else {
    return "Overdue";
  }
};