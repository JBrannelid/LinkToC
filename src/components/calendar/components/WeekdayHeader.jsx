import React from "react";
import { weekdayTitles } from "../../../utils/calendarUtils";

// Renders the days "weekdayTitles" from CalendarUtils in the calendar grid
const WeekdayHeader = () => {
  return (
    <div className="grid grid-cols-7 text-center bg-gray-100 rounded-t-lg">
      {weekdayTitles.map((day, index) => (
        <div key={index} className="py-2 font-medium">
          {day}
        </div>
      ))}
    </div>
  );
};

export default WeekdayHeader;
