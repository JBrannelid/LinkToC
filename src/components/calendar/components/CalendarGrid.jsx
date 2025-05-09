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
      <div className="grid grid-cols-7 text-center bg-white md:h-auto px-2 md:pl-4 md:pr-4 md:pb-6 rounded-b-lg shadow-md">
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
