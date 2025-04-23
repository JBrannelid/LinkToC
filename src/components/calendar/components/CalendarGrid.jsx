import React from "react";
import DayCell from "./DayCell";
import WeekdayHeader from "./WeekdayHeader";

const CalendarGrid = ({
  days,
  selectedDay,
  firstDayCurrentMonth,
  findUsersWithEventsOnDay,
  dayHasEvents,
  onSelectDay,
}) => {
  return (
    <>
      {/* Weekday headers */}
      <WeekdayHeader />

      {/* Calendar Days Box-Grid */}
      <div className="grid grid-cols-7 bg-gray-100 rounded-b-lg pb-4">
        {days.map((day, dayIdx) => {
          const hasEvents = dayHasEvents(day);
          const dayUsers = hasEvents ? findUsersWithEventsOnDay(day) : [];

          return (
            <DayCell
              key={day.toString()}
              day={day}
              dayIdx={dayIdx}
              selectedDay={selectedDay}
              firstDayCurrentMonth={firstDayCurrentMonth}
              dayUsers={dayUsers}
              hasEvents={hasEvents}
              onSelectDay={onSelectDay}
            />
          );
        })}
      </div>
    </>
  );
};

export default CalendarGrid;
