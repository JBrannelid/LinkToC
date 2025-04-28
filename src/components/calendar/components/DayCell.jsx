import React from "react";
import UserAvatarGrid from "../../../components/common/UserAvatarGrid";
import * as calendarUtils from "../../../utils/calendarUtils";

// Renders a single day within the calendar grid (daynumber, user image, indicators)
const DayCell = ({
  day,
  dayIdx,
  selectedDay,
  firstDayCurrentMonth,
  dayUsers,
  hasEvents,
  onSelectDay,
}) => {
  const colStartClass =
    dayIdx === 0
      ? calendarUtils.colStartClasses[calendarUtils.getDay(day)]
      : "";

  // Check if this day is in the current month
  const isCurrentMonth = calendarUtils.isSameMonth(day, firstDayCurrentMonth);

  // Check if this is the selected day
  const isSelected = calendarUtils.isSameDay(day, selectedDay);

  return (
    <div className={`${colStartClass} p-0.5 relative flex flex-col`}>
      {/* Day container */}
      <div
        className="relative w-full h-10 bg-background"
        onClick={() => onSelectDay(day)}
      >
        {/* User profile image for users with events on this day */}
        {hasEvents && dayUsers.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <UserAvatarGrid
              users={dayUsers}
              onSelectUser={() => onSelectDay(day)}
            />
          </div>
        )}

        {/* Highlight border for selected day */}
        {isSelected && (
          <div className="absolute inset-0 border-2 border-gray-400/60 z-10 rounded-lg pointer-events-none"></div>
        )}

        {/* Fill divs outside current month */}
        {!isCurrentMonth && (
          <div className="absolute inset-0 bg-primary-light rounded-lg pointer-events-none"></div>
        )}
      </div>

      {/* Display day-number */}
      <div
        className={calendarUtils.getDayButtonClasses(
          day,
          selectedDay,
          firstDayCurrentMonth
        )}
      >
        {calendarUtils.formatDayNumber(day)}
      </div>
    </div>
  );
};

export default DayCell;
