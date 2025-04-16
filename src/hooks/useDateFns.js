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
  weekdayTitles,
  formatMonthYear,
  formatMonth,
  formatDayNumber,
  formatFullDayDate,
  formatYear,
} from "../utils/calendarUtils";

// Custom hook for calendar functionality
export const calendarHook = (events = [], locale) => {
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

  // Navigate to the previous month
  function previousMonth() {
    const firstDayPreviousMonth = add(firstDayCurrentMonth, {
      months: -1,
    });
    setCurrentMonth(format(firstDayPreviousMonth, "MMM-yyyy", { locale }));
  }

  // Navigate to the next month
  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, {
      months: 1,
    });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy", { locale }));
  }

  // Navigate to the next year
  function nextYear() {
    const firstDayNextYear = add(firstDayCurrentMonth, {
      years: 1,
    });
    setCurrentMonth(format(firstDayNextYear, "MMM-yyyy", { locale }));
  }

  // Navigate to the previous year
  function previousYear() {
    const firstDayPreviousYear = add(firstDayCurrentMonth, {
      years: -1,
    });
    setCurrentMonth(format(firstDayPreviousYear, "MMM-yyyy", { locale }));
  }

  // Change year
  function changeYear(targetYear) {
    const newDate = new Date(firstDayCurrentMonth);
    newDate.setFullYear(targetYear);
    setCurrentMonth(format(newDate, "MMM-yyyy", { locale }));
  }

  // Go to today (resets both month and year)
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
    weekdayTitle: weekdayTitles,
    colStartClasses,
    classNames,

    // Formatting functions
    formatMonthYear,
    formatMonth,
    formatDayNumber,
    formatFullDayDate,
    formatYear,

    // States
    setSelectedDay,

    // Navigation functions
    previousMonth,
    previousYear,
    changeYear,
    nextMonth,
    nextYear,
    goToToday,
  };
};
