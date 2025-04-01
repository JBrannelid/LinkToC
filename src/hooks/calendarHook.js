import { useState } from "react";
import * as calendarUtils from "../utils/calendarUtils";

// Custom hook for calendar functionality
export const calendarHook = (events = [], locale) => {
  const today = calendarUtils.startOfToday();

  // State for the currently selected day and current month view
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(
    calendarUtils.format(today, "MMM-yyyy", { locale })
  );

  // Parse the current month string into a Date object
  const firstDayCurrentMonth = calendarUtils.parse(
    currentMonth,
    "MMM-yyyy",
    new Date(),
    {
      locale,
    }
  );

  // Get start of the first week that contains the first day of the month
  const start = calendarUtils.startOfWeek(firstDayCurrentMonth, {
    weekStartsOn: 1,
  }); // 1 = Monday

  // Get end of the last week that contains the last day of the month
  const end = calendarUtils.endOfWeek(
    calendarUtils.endOfMonth(firstDayCurrentMonth),
    { weekStartsOn: 1 }
  );

  // Generate all days in the calendar view (including days from other months)
  const days = calendarUtils.eachDayOfInterval({ start, end });

  // Filter events that occur on the selected day
  const selectedDayEvents = events.filter((event) =>
    calendarUtils.isSameDay(
      calendarUtils.parseISO(event.StartDatetime),
      selectedDay
    )
  );

  // Navigate to the previous month
  function previousMonth() {
    const firstDayPreviousMonth = calendarUtils.add(firstDayCurrentMonth, {
      months: -1,
    });
    setCurrentMonth(
      calendarUtils.format(firstDayPreviousMonth, "MMM-yyyy", { locale })
    );
  }

  // Navigate to the next month
  function nextMonth() {
    const firstDayNextMonth = calendarUtils.add(firstDayCurrentMonth, {
      months: 1,
    });
    setCurrentMonth(
      calendarUtils.format(firstDayNextMonth, "MMM-yyyy", { locale })
    );
  }

  return {
    // Date values
    today,
    selectedDay,
    firstDayCurrentMonth,
    days,

    // Date utility functions (exported from hook)
    format: calendarUtils.format,
    isSameDay: calendarUtils.isSameDay,
    isToday: calendarUtils.isToday,
    isSameMonth: calendarUtils.isSameMonth,
    getDay: calendarUtils.getDay,
    parseISO: calendarUtils.parseISO,

    // Calendar data
    selectedDayEvents,
    weekdayTitle: calendarUtils.weekdayTitles,
    colStartClasses: calendarUtils.colStartClasses,
    classNames: calendarUtils.classNames,

    // States
    setSelectedDay,

    // Navigation functions
    previousMonth,
    nextMonth,
  };
};
