import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { sv } from "date-fns/locale";
import { calendarHook } from "../../hooks/useDateFns";
import EventItem from "./CalendarEventItem";
import CalendarEventsList from "./CalendarEventsList";
import { getDayButtonClasses } from "../../utils/calendarUtils";

// Reusable Calendar with props for data and configuration
const Calendar = ({
  events = [],
  locale = sv,
  noEventsMessage = "Inga schemalagda händelser",
  eventItemRenderer = EventItem,
  onAddEvent = () => {},
}) => {
  const {
    // Date values
    selectedDay,
    firstDayCurrentMonth,
    days,

    // Date functions
    format,
    isSameDay,
    isSameMonth,
    getDay,
    parseISO,

    // Calendar data
    selectedDayEvents,
    weekdayTitle,
    colStartClasses,
    classNames,

    // Format functions
    formatMonth,
    formatDayNumber,
    formatFullDayDate,

    // States
    setSelectedDay,

    // Navigation functions
    previousMonth,
    nextMonth,
    changeYear,
    goToToday,
  } = calendarHook(events, locale);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="pt-4">
      <div className=" mx-auto sm:px-7 md:max-w-5xl md:px-6">
        <div className="md:grid md:grid-cols-2 md:divide-x md:divide-accent-secondary/50">
          {/* Calendar */}
          <div className="md:pr-14">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                {/* Dropdownlist Years */}
                <select
                  id="year"
                  value={firstDayCurrentMonth.getFullYear()}
                  onChange={(e) => changeYear(Number(e.target.value))}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-full text-sm"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {/* Return to today */}
                <button
                  type="button"
                  onClick={goToToday}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-full text-sm"
                >
                  Today
                </button>
                {/* Add a new event */}
                <button
                  type="button"
                  onClick={onAddEvent}
                  className="px-3 py-2 bg-blue-500 text-white rounded-full text-sm flex items-center"
                >
                  <span>+</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={previousMonth}
                  className="pl-2 text-gray-400 hover:text-gray-500"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <h2 className=" text-sm">
                  {formatMonth(firstDayCurrentMonth, locale)}
                </h2>

                <button
                  onClick={nextMonth}
                  type="button"
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Weekday Headings */}
            <div className="grid grid-cols-7 text-sm text-center text-gray-500">
              {weekdayTitle.map((day, index) => (
                <div key={index} className="font-medium py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Divider between weekday headers and calendar */}
            <div className="border-t border-gray-200 my-2"></div>

            {/* Calendar Days Box-Grid */}
            <div className="grid grid-cols-7 mt-2 text-sm">
              {days.map((day, dayIdx) => (
                <div
                  key={day.toString()}
                  className={classNames(
                    dayIdx === 0 && colStartClasses[getDay(day)],
                    "p-0.5 h-20 border border-gray-200 rounded-md relative"
                  )}
                >
                  {/* Day number in top-left corner wrap in a button*/}
                  <div className="h-full flex flex-col text-[0.7rem] font-semibold">
                    <div className="self-start">
                      <button
                        type="button"
                        onClick={() => setSelectedDay(day)}
                        className={getDayButtonClasses(
                          day,
                          selectedDay,
                          firstDayCurrentMonth
                        )}
                      >
                        <time dateTime={format(day, "yyyy-MM-dd")}>
                          {formatDayNumber(day)}
                        </time>
                      </button>
                    </div>

                    {/* Border highlight for selected day */}
                    {isSameDay(day, selectedDay) && (
                      <div className="absolute inset-0 border-2 border-gray-400/60 z-10"></div>
                    )}

                    {/* Overlay for out-of-month days */}
                    {!isSameMonth(day, firstDayCurrentMonth) && (
                      <div className="absolute inset-0 bg-gray-100 bg-opacity-20 "></div>
                    )}

                    {/* Event indicator dot */}
                    {events.some((event) =>
                      isSameDay(parseISO(event.startDateTime), day)
                    ) && (
                      <div className="absolute bottom-2 w-full px-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's events */}
          <CalendarEventsList
            selectedDay={selectedDay}
            selectedDayEvents={selectedDayEvents}
            format={format}
            formatFullDayDate={formatFullDayDate}
            locale={locale}
            noEventsMessage={noEventsMessage}
            eventItemRenderer={eventItemRenderer}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;

// https://date-fns.org/v4.1.0/docs/parseJSON
