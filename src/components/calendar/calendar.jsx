import React, { useState, useEffect } from "react";
import EventsContainer from "./events/EventsContainer";
import CalendarHeader from "./components/CalendarHeader";
import CalendarGrid from "./components/CalendarGrid";
import { useDateFns } from "../../hooks/useDateFns";
import * as calendarUtils from "../../utils/calendarUtils";

const Calendar = ({
  users = [],
  locale,
  noEventsMessage = "Inga schemalagda händelser",
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  getEventsForDay,
  selectedDay,
  onSelectDay,
}) => {
  const [isEventPanelOpen, setIsEventPanelOpen] = useState(false);
  const [currentDayEvents, setCurrentDayEvents] = useState([]);
  const dateUtils = useDateFns(locale);

  useEffect(() => {
    if (selectedDay && dateUtils.setSelectedDay) {
      dateUtils.setSelectedDay(selectedDay, false);
    }
  }, [selectedDay, dateUtils.setSelectedDay]);

  useEffect(() => {
    if (getEventsForDay && selectedDay) {
      setCurrentDayEvents(getEventsForDay(selectedDay));
    }
  }, [selectedDay, getEventsForDay]);

  // Handle day selection
  const handleSelectDay = (day, openEvents = false) => {
    if (onSelectDay) {
      onSelectDay(day);
    }

    if (getEventsForDay) {
      setCurrentDayEvents(getEventsForDay(day));
    }

    // Only open events panel on second click (openEvents flag)
    if (openEvents) {
      setIsEventPanelOpen(true);
    }
  };

  // Get unique users with events on a specific day
  const findUsersWithEventsOnDay = (day) => {
    if (!getEventsForDay || !users?.length) return [];

    const dayEvents = getEventsForDay(day);
    if (!dayEvents?.length) return [];

    const uniqueUsers = new Map();
    dayEvents.forEach((event) => {
      // Add user from event.user
      if (event.user.id) {
        uniqueUsers.set(event.user.id, event.user);
      }
    });

    return Array.from(uniqueUsers.values());
  };

  const dayHasEvents = (day) => {
    if (!getEventsForDay) return false;
    const events = getEventsForDay(day);
    return Boolean(events?.length);
  };

  return (
    <div className="w-full">
      <div className="w-full">
        {/*   md:divide-x md:divide-primary-light md:rounded-lg md:overflow-hidden */}

        <div className="grid md:grid-cols-[58%_1fr] lg:grid-cols-[60%_40%] md:overflow-hidden">
          {/* Calendar */}
          <div className="md:w-full">
            <CalendarHeader
              firstDayCurrentMonth={dateUtils.firstDayCurrentMonth}
              locale={locale}
              previousMonth={dateUtils.previousMonth}
              nextMonth={dateUtils.nextMonth}
              changeYear={dateUtils.changeYear}
              goToToday={dateUtils.goToToday}
            />

            <CalendarGrid
              days={dateUtils.days}
              selectedDay={selectedDay}
              firstDayCurrentMonth={dateUtils.firstDayCurrentMonth}
              findUsersWithEventsOnDay={findUsersWithEventsOnDay}
              dayHasEvents={dayHasEvents}
              onSelectDay={handleSelectDay}
            />
          </div>

          {/* Desktop events view */}
          <div className="hidden md:block h-full pl-10 px-4">
            <EventsContainer
              selectedDay={selectedDay}
              events={currentDayEvents}
              format={calendarUtils.format}
              formatFullDayDate={calendarUtils.formatFullDayDate}
              locale={locale}
              noEventsMessage={noEventsMessage}
              onUpdateEvent={onUpdateEvent}
              onDeleteEvent={onDeleteEvent}
              onAddEvent={onAddEvent}
              onClose={() => setIsEventPanelOpen(false)}
              isOpen={isEventPanelOpen}
              viewMode="desktop"
            />
          </div>
        </div>
      </div>

      {/* Mobile events view */}
      <div className="md:hidden">
        <EventsContainer
          selectedDay={selectedDay}
          events={currentDayEvents}
          format={calendarUtils.format}
          formatFullDayDate={calendarUtils.formatFullDayDate}
          locale={locale}
          noEventsMessage={noEventsMessage}
          onUpdateEvent={onUpdateEvent}
          onDeleteEvent={onDeleteEvent}
          onAddEvent={onAddEvent}
          onClose={() => setIsEventPanelOpen(false)}
          isOpen={isEventPanelOpen}
          viewMode="mobile"
        />
      </div>
    </div>
  );
};

export default Calendar;
