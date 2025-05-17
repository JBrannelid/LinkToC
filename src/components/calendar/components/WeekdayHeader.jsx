import React from "react";
import { weekdayTitles } from "../../../utils/calendarUtils";

// Renders the days "weekdayTitles" from CalendarUtils
const WeekdayHeader = () => {
  return (
    <div className="grid grid-cols-7 bg-white w-full md:h-auto md:pl-2 md:pr-2 shadow-md pt-2">
      {weekdayTitles.map((day, index) => (
        <p
          key={index}
          className="py-1 flex items-center justify-center text-sm lg:text-lg font-normal"
        >
          {day}
        </p>
      ))}
    </div>
  );
};

export default WeekdayHeader;
