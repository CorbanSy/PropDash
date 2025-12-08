// src/components/ProviderDashboard/Schedule/utils/holidayData.js

/**
 * Get US Federal Holidays for a given year
 */
export const getUSHolidays = (year) => {
  return [
    { name: "New Year's Day", date: `${year}-01-01`, type: "federal" },
    { name: "Martin Luther King Jr. Day", date: getNthWeekdayOfMonth(year, 0, 1, 3), type: "federal" },
    { name: "Presidents' Day", date: getNthWeekdayOfMonth(year, 1, 1, 3), type: "federal" },
    { name: "Memorial Day", date: getLastWeekdayOfMonth(year, 4, 1), type: "federal" },
    { name: "Juneteenth", date: `${year}-06-19`, type: "federal" },
    { name: "Independence Day", date: `${year}-07-04`, type: "federal" },
    { name: "Labor Day", date: getNthWeekdayOfMonth(year, 8, 1, 1), type: "federal" },
    { name: "Columbus Day", date: getNthWeekdayOfMonth(year, 9, 1, 2), type: "federal" },
    { name: "Veterans Day", date: `${year}-11-11`, type: "federal" },
    { name: "Thanksgiving", date: getNthWeekdayOfMonth(year, 10, 4, 4), type: "federal" },
    { name: "Christmas Day", date: `${year}-12-25`, type: "federal" },
  ];
};

/**
 * Get popular non-federal holidays
 */
export const getPopularHolidays = (year) => {
  return [
    { name: "Valentine's Day", date: `${year}-02-14`, type: "popular" },
    { name: "St. Patrick's Day", date: `${year}-03-17`, type: "popular" },
    { name: "Easter Sunday", date: getEasterDate(year), type: "popular" },
    { name: "Mother's Day", date: getNthWeekdayOfMonth(year, 4, 0, 2), type: "popular" },
    { name: "Father's Day", date: getNthWeekdayOfMonth(year, 5, 0, 3), type: "popular" },
    { name: "Halloween", date: `${year}-10-31`, type: "popular" },
    { name: "Black Friday", date: getDayAfter(getNthWeekdayOfMonth(year, 10, 4, 4)), type: "popular" },
    { name: "Christmas Eve", date: `${year}-12-24`, type: "popular" },
    { name: "New Year's Eve", date: `${year}-12-31`, type: "popular" },
  ];
};

/**
 * Helper: Get the nth occurrence of a weekday in a month
 * @param {number} year
 * @param {number} month - 0-11
 * @param {number} weekday - 0-6 (Sunday-Saturday)
 * @param {number} n - Which occurrence (1-5)
 */
function getNthWeekdayOfMonth(year, month, weekday, n) {
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  
  let daysToAdd = (weekday - firstWeekday + 7) % 7;
  daysToAdd += (n - 1) * 7;
  
  const date = new Date(year, month, 1 + daysToAdd);
  return formatDate(date);
}

/**
 * Helper: Get the last occurrence of a weekday in a month
 */
function getLastWeekdayOfMonth(year, month, weekday) {
  const lastDay = new Date(year, month + 1, 0);
  const lastDate = lastDay.getDate();
  const lastWeekday = lastDay.getDay();
  
  let daysToSubtract = (lastWeekday - weekday + 7) % 7;
  const date = new Date(year, month, lastDate - daysToSubtract);
  return formatDate(date);
}

/**
 * Helper: Calculate Easter date (using Computus algorithm)
 */
function getEasterDate(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return formatDate(new Date(year, month, day));
}

/**
 * Helper: Get the day after a date
 */
function getDayAfter(dateStr) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 1);
  return formatDate(date);
}

/**
 * Helper: Format date as YYYY-MM-DD
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Get all holidays for a year
 */
export const getAllHolidays = (year) => {
  return [...getUSHolidays(year), ...getPopularHolidays(year)];
};

/**
 * Check if a date is a holiday
 */
export const isHoliday = (dateStr, holidays) => {
  return holidays.some((h) => h.date === dateStr);
};

/**
 * Get holiday for a specific date
 */
export const getHolidayForDate = (dateStr, holidays) => {
  return holidays.find((h) => h.date === dateStr);
};