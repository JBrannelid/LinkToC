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
    <div className="flex justify-between items-center mb-6 px-2 sm:px-4">
      <div className="flex items-center space-x-2">
        {/* Year dropdown */}
        <select
          id="year"
          value={firstDayCurrentMonth.getFullYear()}
          onChange={(e) => changeYear(Number(e.target.value))}
          className="px-3 py-2 bg-white border border-gray-300 rounded-full text-sm"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        {/* Return to today */}
        <button
          type="button"
          onClick={goToToday}
          className="px-3 py-2 bg-white border border-gray-300 rounded-full text-sm"
        >
          Till idag
        </button>
      </div>
      <div className="flex items-center space-x-2">
        {/* Change to previous month */}
        <button
          type="button"
          onClick={previousMonth}
          className="pl-2 text-gray-400 hover:text-gray-500"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Display current month */}
        <h2 className="text-sm">
          {calendarUtils.formatMonth(firstDayCurrentMonth, locale)}
        </h2>

        {/* Change to next month */}
        <button
          onClick={nextMonth}
          type="button"
          className="p-2 text-gray-400 hover:text-gray-500"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
