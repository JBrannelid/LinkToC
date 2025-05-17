import { useState } from "react";
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
  parseISO,
  classNames,
  colStartClasses,
  formatMonthYear,
  formatMonth,
  formatDayNumber,
  formatFullDayDate,
  formatYear,
} from "../utils/calendarUtils";

// Custom hook for calendar functionality
export const useDateFns = (locale, events = []) => {
  const today = startOfToday();

  // State for the currently selected day and current month view
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(
    format(today, "MMM-yyyy", { locale })
  );

  // Parse the current month string into a Date object
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date(), {
    locale,
  });

  // Get start of the first week that contains the first day of the month
  const start = startOfWeek(firstDayCurrentMonth, {
    weekStartsOn: 1,
  }); // 1 = Monday

  // Get end of the last week that contains the last day of the month
  const end = endOfWeek(endOfMonth(firstDayCurrentMonth), { weekStartsOn: 1 });

  // Generate all days in the calendar view (including days from other months)
  const days = eachDayOfInterval({ start, end });

  // Filter events that occur on the selected day
  const selectedDayEvents = events.filter((event) =>
    isSameDay(parseISO(event.startDateTime), selectedDay)
  );

  // Enhanced setter for selectedDay that can optionally update the month
  const setSelectedDayWithMonthUpdate = (day, shouldUpdateMonth = true) => {
    if (!day) return;

    setSelectedDay(day);

    // Only update the month if explicitly requested and the day is in a different month
    if (shouldUpdateMonth && !isSameMonth(day, firstDayCurrentMonth)) {
      setCurrentMonth(format(day, "MMM-yyyy", { locale }));
    }
  };

  // Navigate to the previous month without changing selected day
  function previousMonth() {
    const firstDayPreviousMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayPreviousMonth, "MMM-yyyy", { locale }));
  }

  // Navigate to the next month without changing selected day
  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy", { locale }));
  }

  // Navigate to the next year without changing selected day
  function nextYear() {
    const firstDayNextYear = add(firstDayCurrentMonth, { years: 1 });
    setCurrentMonth(format(firstDayNextYear, "MMM-yyyy", { locale }));
  }

  // Navigate to the previous year without changing selected day
  function previousYear() {
    const firstDayPreviousYear = add(firstDayCurrentMonth, { years: -1 });
    setCurrentMonth(format(firstDayPreviousYear, "MMM-yyyy", { locale }));
  }

  // Change year without changing selected day
  function changeYear(targetYear) {
    const newDate = new Date(firstDayCurrentMonth);
    newDate.setFullYear(targetYear);
    setCurrentMonth(format(newDate, "MMM-yyyy", { locale }));
  }

  // Go to today - update month and selected day
  function goToToday() {
    setSelectedDay(today);
    setCurrentMonth(format(today, "MMM-yyyy", { locale }));
  }

  return {
    // Date values
    today,
    selectedDay,
    firstDayCurrentMonth,
    days,

    // Date utility functions
    format,
    isSameDay,
    isToday,
    isSameMonth,
    getDay,
    parseISO,

    // Calendar data
    selectedDayEvents,
    colStartClasses,
    classNames,

    // Formatting functions
    formatMonthYear,
    formatMonth,
    formatDayNumber,
    formatFullDayDate,
    formatYear,

    // States
    setSelectedDay: setSelectedDayWithMonthUpdate,

    // Navigation functions
    previousMonth,
    previousYear,
    changeYear,
    nextMonth,
    nextYear,
    goToToday,
  };
};
