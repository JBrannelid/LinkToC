import React, { useState } from "react";
import { sv } from "date-fns/locale";
import Calendar from "./calendar";
import EventForm from "../forms/EventForm";
import { useCalendarEvents } from "../../hooks/useCalendarEvents";
import { useStableData } from "../../hooks/useStableData";

function CalendarDisplay() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [selectedDay, setSelectedDay] = useState(new Date());

  // Hardcoded values until login and dynamic stable management
  const CURRENT_USER_ID = 1;
  const DEFAULT_STABLE_ID = 2;

  // Custom hooks for data fetching
  const { stableId, status: stableStatus } = useStableData(DEFAULT_STABLE_ID);
  const {
    events,
    users,
    calendarStatus,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsForDay,
  } = useCalendarEvents(stableId);

  // Form control functions
  const handleOpenEventForm = () => {
    setIsFormOpen(true);
    setCurrentEvent(null);
  };

  const handleCloseEventForm = () => {
    setIsFormOpen(false);
    setCurrentEvent(null);
  };

  const handleOpenUpdateForm = (eventId) => {
    const eventToEdit = events.find((event) => event.id === eventId);
    if (eventToEdit) {
      setCurrentEvent(eventToEdit);
      setIsFormOpen(true);
    } else {
      console.error(`Event with ID ${eventId} not found`);
    }
  };

  // Event CRUD handlers
  const handleCreateEvent = async (eventData) => {
    const success = await createEvent({
      ...eventData,
      stableIdFk: stableId,
      userIdFk: CURRENT_USER_ID,
    });

    if (success) handleCloseEventForm();
    else console.error("Could not create event");
  };

  const handleUpdateEvent = async (eventData) => {
    const success = await updateEvent({
      ...eventData,
      id: currentEvent.id,
      stableIdFk: stableId,
      userIdFk: CURRENT_USER_ID,
    });

    if (success) handleCloseEventForm();
    else console.error("Could not update event");
  };

  const handleDeleteEvent = async (eventId) => {
    const eventToDelete = events.find((event) => event.id === eventId);
    if (!eventToDelete) return;

    const eventTitle = eventToDelete.title;
    const creator =
      eventToDelete.user &&
      `${eventToDelete.user.firstName} ${eventToDelete.user.lastName}`.trim();

    if (
      confirm(
        `Är du säker på att du vill ta bort event "${eventTitle}" skapat av ${creator}?`
      )
    ) {
      await deleteEvent(eventId);
    }
  };

  // Loading state. Need to implement a loading component
  if ((calendarStatus.loading && events.length === 0) || stableStatus.loading) {
    return (
      <div className="p-8 text-center">
        <p>Vänta, vi hämtar in kalenderdata...</p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="container mx-auto px-4">
        {/* Loading and error status messages */}
        {calendarStatus.loading && events.length > 0 && (
          <div className="text-center py-2 text-gray-500">
            Vänta, vi uppdaterar kalenderdata...
          </div>
        )}

        {calendarStatus.error && (
          <div className="text-center py-2 text-red-500">
            {calendarStatus.error}
          </div>
        )}

        {stableStatus.error && (
          <div className="text-center py-2 text-red-500">
            {stableStatus.error}
          </div>
        )}

        {/* Event form modal */}
        {isFormOpen && (
          <EventForm
            event={currentEvent}
            onSubmit={currentEvent ? handleUpdateEvent : handleCreateEvent}
            onCancel={handleCloseEventForm}
            title={currentEvent ? "Ändra Aktivitet" : "Ny Aktivitet"}
            date={selectedDay}
            stables={stableId}
            users={users}
          />
        )}
      </div>

      {/* Placed outside container div for full width */}
      <Calendar
        stableId={stableId}
        events={events}
        users={users}
        locale={sv}
        noEventsMessage="Inga schemalagda händelser"
        onAddEvent={handleOpenEventForm}
        onUpdateEvent={handleOpenUpdateForm}
        onDeleteEvent={handleDeleteEvent}
        getEventsForDay={getEventsForDay}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
      />
    </div>
  );
}

export default CalendarDisplay;
