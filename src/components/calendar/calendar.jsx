import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
} from "date-fns";
import { sv } from "date-fns/locale";
import EventItem from "../calendar/calendarEventForm";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Reusable Calendar with props for data and configuration
const Calendar = ({
  events = [],
  locale = sv,
  accentColor = "bg-green-500",
  textColor = "text-primary-text",
  eventItemRenderer = EventItem,
  noEventsMessage = "Inga schemalagda händelser",
}) => {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(
    format(today, "MMM-yyyy", { locale })
  );

  // Create date obj from a string base on format and locale
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date(), {
    locale,
  });

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    const firstDayPreviousMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayPreviousMonth, "MMM-yyyy", { locale }));
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy", { locale }));
  }

  // Convert ISO 8601-format (2025-03-26T14:00:00Z) to a JS Date-obj.
  function parseISO(dateString) {
    return new Date(dateString);
  }

  const selectedDayEvents = events.filter((event) =>
    isSameDay(parseISO(event.startDatetime), selectedDay)
  );

  const colStartClasses = [
    "col-start-7", // Sunday moves to the end (7th column)
    "", // Monday
    "col-start-2", // Tuesday
    "col-start-3", // Wednesday
    "col-start-4", // Thursday
    "col-start-5", // Friday
    "col-start-6", // Saturday
  ];

  // Weekday abbreviations based on locale
  const weekdayAbbr =
    locale === sv
      ? ["Må", "Ti", "On", "To", "Fr", "Lö", "Sö"]
      : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  return (
    <div className="pt-16">
      <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-3xl md:px-6">
        <div className="md:grid md:grid-cols-2 md:divide-x md:divide-accent-secondary/50">
          {/* Calendar */}
          <div className="md:pr-14">
            <div className="flex items-center">
              <h2 className="flex-auto font-semibold text-gray-900">
                {format(firstDayCurrentMonth, "MMMM yyyy", { locale })}
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
              {weekdayAbbr.map((day, index) => (
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
                      isEqual(day, selectedDay) && "text-gray-800", // change foreground color on selectedDay
                      !isEqual(day, selectedDay) && isToday(day) && textColor, // Today foreground color
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        isSameMonth(day, firstDayCurrentMonth) &&
                        "text-gray-800", // default foreground color
                      isEqual(day, selectedDay) && isToday(day) && accentColor, // Today background color
                      isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        "bg-gray-300", // Default background color
                      !isEqual(day, selectedDay) && "hover:bg-gray-200", // change foreground color on hover
                      (isEqual(day, selectedDay) || isToday(day)) &&
                        "font-semibold",
                      "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
                    )}
                  >
                    <time dateTime={format(day, "yyyy-MM-dd")}>
                      {format(day, "d")}
                    </time>
                  </button>

                  {/* Marker for days with events */}
                  <div className="w-1 h-1 mx-auto mt-1">
                    {events.some((event) =>
                      isSameDay(parseISO(event.startDatetime), day)
                    ) && (
                      <div
                        className={`w-1 h-1 rounded-full ${accentColor}`}
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
                {format(selectedDay, "EEEE d MMMM", { locale })}
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
