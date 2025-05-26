import React from "react";
import ChevronLeftIcon from "../../../assets/icons/ChevronLeftIcon";
import ChevronRightIcon from "../../../assets/icons/ChevronRightIcon";
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
    <header className="flex items-center justify-between px-4 bg:background lg:bg-white rounded-t-sm md:rounded-t-lg lg:shadow-md">
      {/* Desktop view */}
      <div className="hidden lg:flex items-center space-x-2 mt-2 w-full">
        <button
          type="button"
          onClick={previousMonth}
          className="text-primary"
          aria-label="Previous month"
        >
          <ChevronLeftIcon className="w-5 h-5 lg:block hidden" />
        </button>
        <h2 className="text-sm md:text-lg lg:text-xl font-normal font-heading">
          {calendarUtils.formatMonth(firstDayCurrentMonth, locale)}
        </h2>
        <select
          id="year"
          value={firstDayCurrentMonth.getFullYear()}
          onChange={(e) => changeYear(Number(e.target.value))}
          className="text-sm md:text-lg lg:text-xl font-normal font-heading"
          aria-label="Select year"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={nextMonth}
          className="text-primary"
          aria-label="Next month"
        >
          <ChevronRightIcon className="w-5 h-5 lg:block hidden" />
        </button>
        <button
          type="button"
          onClick={goToToday}
          className="ml-auto lg:ml-5 text-xl lg:text-2xl font-normal font-heading text-primary"
          aria-label="Go to today"
        >
          Today
        </button>
      </div>

      {/* Mobil view */}
      <div className="flex lg:hidden items-center space-x-2 mt-2 w-full ">
        <h2 className="text-lg font-normal font-heading">
          {calendarUtils.formatMonth(firstDayCurrentMonth, locale)}
        </h2>
        <select
          id="year-mobile"
          value={firstDayCurrentMonth.getFullYear()}
          onChange={(e) => changeYear(Number(e.target.value))}
          className="text-lg font-normal font-heading"
          aria-label="Select year"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={previousMonth}
          className="text-primary ml-auto"
          aria-label="Previous month"
        >
          <ChevronLeftIcon className="lg:hidden mr-2 w-5 h-5 " />
        </button>
        <button
          type="button"
          onClick={goToToday}
          className="text-lg font-normal font-heading text-primary"
          aria-label="Go to today"
        >
          Today
        </button>
        <button
          type="button"
          onClick={nextMonth}
          className="text-primary"
          aria-label="Next month"
        >
          <ChevronRightIcon className="lg:hidden ml-2 w-5 h-5 " />
        </button>
      </div>
    </header>
  );
};

export default CalendarHeader;
