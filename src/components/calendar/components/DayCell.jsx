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

  // Handle click on day cell
  const handleDayClick = () => {
    // If day is already selected, open events
    if (isSelected) {
      // Open events for this day
      onSelectDay(day, true); // Added boolean flag to indicate it's the second click
    } else {
      // Just select the day
      onSelectDay(day, false); // First click just selects the day
    }
  };

  return (
    <div className={`${colStartClass} p-0.5 md:p-1 relative flex flex-col`}>
      {/* Day container */}
      <div
        className="relative w-full h-10 md:h-12 lg:h-14 xl:h-17 bg-background cursor-pointer transition-colors duration-300 hover:bg-light hover:opacity-40 rounded-lg"
        onClick={handleDayClick}
      >
        {/* User profile image for users with events on this day */}
        {hasEvents && dayUsers.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <UserAvatarGrid
              users={dayUsers}
              onSelectUser={() => handleDayClick()}
            />
          </div>
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
