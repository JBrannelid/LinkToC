// Import specific functions from date-fns to use throughout the application
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
} from "date-fns";

// Export the imported date-fns functions so they can be imported from this file by other modules
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

// CSS class names for positioning days in the calendar grid
export const colStartClasses = [
  "col-start-7", // Sunday (moved to end for European calendar format)
  "", // Monday (first column, no special class needed)
  "col-start-2", // Tuesday
  "col-start-3", // Wednesday
  "col-start-4", // Thursday
  "col-start-5", // Friday
  "col-start-6", // Saturday
];

//  weekday titles for Swedish locale
//  Ordered Monday to Sunday following European convention
export const weekdayTitles = ["Må", "Ti", "On", "To", "Fr", "Lö", "Sö"];
