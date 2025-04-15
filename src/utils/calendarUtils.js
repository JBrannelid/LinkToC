// Import specific functions from date-fns
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isToday,
  parse,
  startOfToday,
  isSameMonth,
  startOfWeek,
  endOfWeek,
  parseISO as dateFnsParseISO,
} from "date-fns";

// Re-export date-fns functions directly
export {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isToday,
  parse,
  startOfToday,
  isSameMonth,
  startOfWeek,
  endOfWeek,
};

// Combines multiple CSS class names into a single string, filtering out falsy values
export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Convert ISO 8601-format (2025-03-26T14:00:00Z) to a JS Date object
export function parseISO(dateString) {
  return new Date(dateString);
}

// Format date for HTML local datetime with parseIso
export const formatDateForInput = (dateString) => {
  return format(parseISO(dateString), "yyyy-MM-dd'T'HH:mm");
};

// Format time to 24/h
export function formatTimeOnly(dateString) {
  return format(parseISO(dateString), "HH:mm");
}

// Format month and year
export function formatMonthYear(date, locale) {
  return format(date, "MMMM yyyy", { locale });
}

// Format month and year
export function formatYear(date, locale) {
  return format(date, "yyyy", { locale });
}

// Format month
export function formatMonth(date, locale) {
  return format(date, "MMMM", { locale });
}

// Format day number
export function formatDayNumber(date) {
  return format(date, "d");
}

// Format full day date
export function formatFullDayDate(date, locale) {
  return format(date, "EEEE d MMMM", { locale });
}

// Tailwind-CSS class names for positioning days in the calendar grid
export const colStartClasses = [
  "col-start-7", // Sunday (moved to end for European calendar format)
  "", // Monday (first column, no special class needed)
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
];

// Ordered Monday to Sunday following European convention (swe-conventions)
export const weekdayTitles = ["Må", "Ti", "On", "To", "Fr", "Lö", "Sö"];
