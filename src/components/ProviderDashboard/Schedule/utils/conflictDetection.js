//levlpro-mvp\src\components\ProviderDashboard\Schedule\utils\conflictDetection.js
import { timeToMinutes, isSameDay, getDateString } from "./timeUtils";

/**
 * Check if time blocks overlap on the same day
 */
export const checkTimeBlockOverlap = (blocks) => {
  const conflicts = [];
  
  for (let i = 0; i < blocks.length; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      const block1 = blocks[i];
      const block2 = blocks[j];
      
      const start1 = timeToMinutes(block1.start);
      const end1 = timeToMinutes(block1.end);
      const start2 = timeToMinutes(block2.start);
      const end2 = timeToMinutes(block2.end);
      
      if (start1 < end2 && start2 < end1) {
        conflicts.push({
          block1: i,
          block2: j,
          message: `Time blocks ${i + 1} and ${j + 1} overlap`,
        });
      }
    }
  }
  
  return conflicts;
};

/**
 * Check if blocking a date will affect existing bookings
 */
export const checkBlockingConflicts = (date, jobs) => {
  const dateStr = getDateString(date);
  const affectedJobs = jobs.filter((job) => {
    const jobDate = new Date(job.scheduled_date);
    return getDateString(jobDate) === dateStr && job.status !== "cancelled";
  });
  
  return affectedJobs;
};

/**
 * Check if custom hours conflict with existing bookings
 */
export const checkCustomHoursConflicts = (date, start, end, jobs) => {
  const dateStr = getDateString(date);
  const customStart = timeToMinutes(start);
  const customEnd = timeToMinutes(end);
  
  const conflicts = jobs.filter((job) => {
    const jobDate = new Date(job.scheduled_date);
    if (getDateString(jobDate) !== dateStr) return false;
    
    const jobTime = jobDate.toLocaleTimeString("en-US", { 
      hour12: false, 
      hour: "2-digit", 
      minute: "2-digit" 
    });
    const jobMinutes = timeToMinutes(jobTime);
    
    // Assuming 1 hour job duration if not specified
    const jobDuration = job.duration || 60;
    const jobEnd = jobMinutes + jobDuration;
    
    // Job is outside new custom hours
    return jobMinutes < customStart || jobEnd > customEnd;
  });
  
  return conflicts;
};

/**
 * Check if travel time causes conflicts with adjacent bookings
 */
export const checkTravelTimeConflicts = (job, travelTime, allJobs) => {
  const jobDate = new Date(job.scheduled_date);
  const jobTime = jobDate.toLocaleTimeString("en-US", { 
    hour12: false, 
    hour: "2-digit", 
    minute: "2-digit" 
  });
  const jobMinutes = timeToMinutes(jobTime);
  const jobDuration = job.duration || 60;
  
  // Calculate time blocks needed
  const requiredStart = jobMinutes - travelTime;
  const requiredEnd = jobMinutes + jobDuration + travelTime;
  
  const conflicts = allJobs.filter((otherJob) => {
    if (otherJob.id === job.id) return false;
    
    const otherDate = new Date(otherJob.scheduled_date);
    if (!isSameDay(jobDate, otherDate)) return false;
    
    const otherTime = otherDate.toLocaleTimeString("en-US", { 
      hour12: false, 
      hour: "2-digit", 
      minute: "2-digit" 
    });
    const otherMinutes = timeToMinutes(otherTime);
    const otherDuration = otherJob.duration || 60;
    const otherEnd = otherMinutes + otherDuration;
    
    // Check if blocks overlap
    return requiredStart < otherEnd && otherMinutes < requiredEnd;
  });
  
  return conflicts;
};

/**
 * Validate time block (start before end, reasonable duration, etc.)
 */
export const validateTimeBlock = (start, end) => {
  const errors = [];
  
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  
  if (startMinutes >= endMinutes) {
    errors.push("End time must be after start time");
  }
  
  const duration = endMinutes - startMinutes;
  if (duration < 30) {
    errors.push("Time block must be at least 30 minutes");
  }
  
  if (duration > 720) { // 12 hours
    errors.push("Time block cannot exceed 12 hours");
  }
  
  return errors;
};