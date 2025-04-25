import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as calendarUtils from "../../../utils/calendarUtils";

const CalendarHeader = ({
  firstDayCurrentMonth,
  locale,
  previousMonth,
  nextMonth,
  changeYear,
  goToToday,
}) => {
  // Dropdown meny for a fix range of years
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <header className="flex items-center justify-between px-4 mb-1">
      <div className="flex items-center space-x-2">
        {/* Display current month */}
        <h2 className="text-xl font-bold">
          {calendarUtils.formatMonth(firstDayCurrentMonth, locale)}
        </h2>
        {/* Year dropdown */}
        <select
          id="year"
          value={firstDayCurrentMonth.getFullYear()}
          onChange={(e) => changeYear(Number(e.target.value))}
          className="text-xl font-bold"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="flex space-x-1">
        {/* Change to previous month */}
        <button type="button" onClick={previousMonth} className="text-primary">
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Return to today */}
        <button type="button" onClick={goToToday} className="text-sm">
          Till idag
        </button>
        {/* Change to next month */}
        <button type="button" onClick={nextMonth} className="text-primary">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default CalendarHeader;
