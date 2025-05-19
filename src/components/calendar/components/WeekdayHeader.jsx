import React from "react";
import {
  weekdayTitlesDesktop,
  weekdayTitlesMobile,
} from "../../../utils/calendarUtils";

const WeekdayHeader = () => {
  return (
    <div className="w-full bg-white shadow-md">
      {/* Mobilversion */}
      <div className="grid grid-cols-7 xl:hidden pl-2 pr-2 pt-2">
        {weekdayTitlesMobile.map((day, index) => (
          <p
            key={index}
            className="py-1 flex items-center justify-center text-sm text-normal"
          >
            {day}
          </p>
        ))}
      </div>

      {/* Desktop-version */}
      <div className="hidden xl:grid grid-cols-7 xl:pl-2 xl:pr-2 pt-2">
        {weekdayTitlesDesktop.map((day, index) => (
          <p
            key={index}
            className="py-1 flex items-center justify-center text-xxs"
          >
            {day}
          </p>
        ))}
      </div>
    </div>
  );
};

export default WeekdayHeader;
