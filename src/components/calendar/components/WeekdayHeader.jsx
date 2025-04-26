import React from "react";
import { weekdayTitles } from "../../../utils/calendarUtils";

// Renders the days "weekdayTitles" from CalendarUtils
const WeekdayHeader = () => {
  return (
    <div className="grid grid-cols-7 text-center bg-white">
      {weekdayTitles.map((day, index) => (
        <div key={index} className="py-2 font-">
          {day}
        </div>
      ))}
    </div>
  );
};

export default WeekdayHeader;
