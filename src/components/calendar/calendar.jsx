import React, { useState, useEffect } from "react";
import EventsContainer from "./events/EventsContainer";
import CalendarHeader from "./components/CalendarHeader";
import CalendarGrid from "./components/CalendarGrid";
import { useDateFns } from "../../hooks/useDateFns";
import * as calendarUtils from "../../utils/calendarUtils";

const Calendar = ({
  users = [],
  locale,
  noEventsMessage = "No scheduled events",
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  getEventsForDay,
  selectedDay,
  onSelectDay,
  onDayWithEventsSelected,
  children,
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
    onSelectDay?.(day);

    const events = getEventsForDay?.(day) || [];
    setCurrentDayEvents(events);

    if (events.length > 0) {
      onDayWithEventsSelected?.(day, events);
    }

    if (openEvents) {
      setIsEventPanelOpen(true);
    }
  };

  // Get unique users with events on a specific day
  const findUsersWithEventsOnDay = (day) => {
    const events = getEventsForDay?.(day);
    if (!users?.length || !events?.length) return [];

    const uniqueUsers = new Map(
      events
        .filter((event) => event.user?.id)
        .map((event) => [event.user.id, event.user])
    );

    return [...uniqueUsers.values()];
  };

  const dayHasEvents = (day) => {
    if (!getEventsForDay) return false;
    const events = getEventsForDay(day);
    return Boolean(events?.length);
  };

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="grid md:grid-cols-[55%_1fr] lg:grid-cols-[60%_40%] md:overflow-hidden">
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

          {/* Right panel - Provided by HomePage */}
          <div className="hidden md:block h-full pl-5 lg:pl-8">{children}</div>
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
