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
  isYesterday,
  startOfYesterday,
  compareDesc as dateFnsCompareDesc,
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
  isYesterday,
  startOfYesterday,
  dateFnsCompareDesc,
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

// Last week date check
export function isLastWeek(date) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(todayStart);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return date >= sevenDaysAgo && date < todayStart;
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
  const monthString = format(date, "MMMM", { locale });
  return monthString.charAt(0).toUpperCase() + monthString.slice(1);
}

// Format day number
export function formatDayNumber(date) {
  return format(date, "d");
}

export function formatFullDayDate(date, locale, useEnglish = false) {
  // For English format (md screens and up): "Saturday, May 3"
  if (useEnglish) {
    return format(date, "EEEE, MMMM d");
  }
  // Default format with passed locale (Swedish): "Lördag 3 maj"
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
export const weekdayTitlesMobile = ["M", "T", "W", "T", "F", "S", "S"];
export const weekdayTitlesDesktop = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Returns Tailwind CSS classes for calendar day buttons based on their state
export function getDayButtonClasses(day, selectedDay, firstDayCurrentMonth) {
  return classNames(
    // Base styling for all day buttons
    "mx-auto flex h-8 w-8 items-center justify-center rounded-full pointer-events-none",

    // Standard text color for current month days
    isSameMonth(day, firstDayCurrentMonth) &&
      !isToday(day) &&
      !isSameDay(day, selectedDay) &&
      "text-black",

    // Highlight today (if not selected)
    isToday(day) && !isSameDay(day, selectedDay) && "text-primary",

    // Highlight Selected day - is today
    isSameDay(day, selectedDay) &&
      isToday(day) &&
      "text-primary font-extrabold",

    // Selected day (not today)
    isSameDay(day, selectedDay) && !isToday(day) && "text-black",

    // Hover effect for unselected days
    !isSameDay(day, selectedDay) && "hover:text-primary hover:font-bold",

    // Bold for selected day or today
    (isSameDay(day, selectedDay) || isToday(day)) && "font-bold"
  );
}
