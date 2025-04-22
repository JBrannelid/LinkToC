import React, { useMemo } from "react";
import MobileEventsView from "./MobileEventsView";
import DesktopEventsView from "./DesktopEventsView";

const EventsContainer = ({
  selectedDay,
  events = [],
  format,
  formatFullDayDate,
  locale,
  noEventsMessage = "Inga schemalagda händelser",
  onUpdateEvent,
  onDeleteEvent,
  onAddEvent,
  onClose,
  isOpen,
  viewMode = "mobile",
}) => {
  // Sort events by start time and remeber events with react useMemo()
  const sortedEvents = useMemo(() => {
    if (!Array.isArray(events)) return [];

    const sorted = [...events].sort((a, b) => {
      const startA = new Date(a.startDateTime);
      const startB = new Date(b.startDateTime);
      return startA - startB;
    });

    return sorted;
  }, [events]);

  // Display mobileview
  if (viewMode === "mobile") {
    return (
      <MobileEventsView
        selectedDay={selectedDay}
        events={sortedEvents}
        format={format}
        formatFullDayDate={formatFullDayDate}
        locale={locale}
        noEventsMessage={noEventsMessage}
        onUpdateEvent={onUpdateEvent}
        onDeleteEvent={onDeleteEvent}
        onAddEvent={onAddEvent}
        onClose={onClose}
        isOpen={isOpen}
      />
    );
  }

  // Fallback to DesktopEventsView
  return (
    <DesktopEventsView
      selectedDay={selectedDay}
      events={sortedEvents}
      format={format}
      formatFullDayDate={formatFullDayDate}
      locale={locale}
      noEventsMessage={noEventsMessage}
      onUpdateEvent={onUpdateEvent}
      onDeleteEvent={onDeleteEvent}
      onAddEvent={onAddEvent}
    />
  );
};

export default EventsContainer;
