import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { sv } from "date-fns/locale";
import { calendarHook } from "../../hooks/useDateFns";
import EventItem from "./CalendarEventItem";

// Reusable Calendar with props for data and configuration
const Calendar = ({
  events = [],
  locale = sv,
  noEventsMessage = "Inga schemalagda händelser",
  eventItemRenderer = EventItem,
}) => {
  const {
    // Date values
    selectedDay,
    firstDayCurrentMonth,
    days,

    // Date functions
    format,
    isSameDay,
    isToday,
    isSameMonth,
    getDay,
    parseISO,

    // Calendar data
    selectedDayEvents,
    weekdayTitle,
    colStartClasses,
    classNames,

    // Format functions
    formatMonthYear,
    formatDayNumber,
    formatFullDayDate,

    // States
    setSelectedDay,

    // Navigation functions
    previousMonth,
    nextMonth,
  } = calendarHook(events, locale);

  return (
    <div className="pt-16">
      <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-3xl md:px-6">
        <div className="md:grid md:grid-cols-2 md:divide-x md:divide-accent-secondary/50">
          {/* Calendar */}
          <div className="md:pr-14">
            <div className="flex items-center">
              <h2 className="flex-auto font-semibold text-gray-900">
                {formatMonthYear(firstDayCurrentMonth, locale)}
              </h2>
              <button
                type="button"
                onClick={previousMonth}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextMonth}
                type="button"
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Weekday Headings */}
            <div className="grid grid-cols-7 mt-10 text-xs text-center text-gray-500">
              {weekdayTitle.map((day, index) => (
                <div key={index}>{day}</div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 mt-2 text-sm">
              {days.map((day, dayIdx) => (
                <div
                  key={day.toString()}
                  className={classNames(
                    dayIdx === 0 && colStartClasses[getDay(day)],
                    "p-1.5"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={classNames(
                      // Selected day text color
                      isSameDay(day, selectedDay) && "text-secondary-text",

                      // Highlight Today's date (when not selected) with accent color
                      !isSameDay(day, selectedDay) &&
                        isToday(day) &&
                        "text-primary-text",

                      // Current month days text color (not selected, not today)
                      !isSameDay(day, selectedDay) &&
                        !isToday(day) &&
                        isSameMonth(day, firstDayCurrentMonth) &&
                        "text-gray-800",

                      // Days not included in current
                      !isSameDay(day, selectedDay) &&
                        !isToday(day) &&
                        !isSameMonth(day, firstDayCurrentMonth) &&
                        "text-gray-500",

                      // Background for selected day that is also today
                      isSameDay(day, selectedDay) &&
                        isToday(day) &&
                        "bg-bg-secondary",

                      // Background for selected day that is not today
                      isSameDay(day, selectedDay) &&
                        !isToday(day) &&
                        "bg-gray-500",

                      // Hover effect for non-selected days
                      !isSameDay(day, selectedDay) && "hover:bg-gray-200",

                      // Bold text for selected day or today
                      (isSameDay(day, selectedDay) || isToday(day)) &&
                        "font-semibold",

                      // Base styling for all day buttons
                      "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
                    )}
                  >
                    <time dateTime={format(day, "yyyy-MM-dd")}>
                      {formatDayNumber(day)}
                    </time>
                  </button>

                  {/* Marker for days with events */}
                  <div className="w-1 h-1 mx-auto mt-1">
                    {events.some((event) =>
                      isSameDay(parseISO(event.startDateTime), day)
                    ) && (
                      <div
                        className={`w-1 h-1 rounded-full bg-bg-secondary`}
                      ></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's events */}
          <section className="mt-12 md:mt-0 md:pl-14">
            <h2 className="font-semibold text-gray-900">
              Schema för&nbsp;
              <time dateTime={format(selectedDay, "yyyy-MM-dd")}>
                {formatFullDayDate(selectedDay, locale)}
              </time>
            </h2>
            {/* Map list of events */}
            <ol className="mt-4 text-sm leading-6 text-gray-500">
              {selectedDayEvents.length > 0 ? (
                selectedDayEvents.map((event) => (
                  <React.Fragment key={event.id}>
                    {React.createElement(eventItemRenderer, { event })}
                  </React.Fragment>
                ))
              ) : (
                <p>{noEventsMessage}</p>
              )}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Calendar;

// https://date-fns.org/v4.1.0/docs/parseJSON
