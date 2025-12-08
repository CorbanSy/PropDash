// src/components/ProviderDashboard/Schedule/utils/timeUtils.js

/**
 * Format time from 24h to 12h format (e.g., "09:00" -> "9a")
 */
export const formatTime = (time) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "p" : "a";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}${ampm}`;
};

/**
 * Format time range (e.g., "09:00" to "17:00" -> "9a-5p")
 */
export const formatTimeRange = (start, end) => {
  return `${formatTime(start)}-${formatTime(end)}`;
};

/**
 * Convert time string to minutes since midnight
 */
export const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * Convert minutes since midnight to time string
 */
export const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

/**
 * Add minutes to a time string
 */
export const addMinutesToTime = (time, minutesToAdd) => {
  const totalMinutes = timeToMinutes(time) + minutesToAdd;
  return minutesToTime(totalMinutes);
};

/**
 * Check if two time ranges overlap
 */
export const timeRangesOverlap = (start1, end1, start2, end2) => {
  const s1 = timeToMinutes(start1);
  const e1 = timeToMinutes(end1);
  const s2 = timeToMinutes(start2);
  const e2 = timeToMinutes(end2);
  
  return s1 < e2 && s2 < e1;
};

/**
 * Calculate duration between two times in minutes
 */
export const calculateDuration = (start, end) => {
  return timeToMinutes(end) - timeToMinutes(start);
};

/**
 * Check if date is same day
 */
export const isSameDay = (date1, date2) => {
  return date1.toDateString() === date2.toDateString();
};

/**
 * Get date string for storage (YYYY-MM-DD)
 */
export const getDateString = (date) => {
  return date.toISOString().split("T")[0];
};