import React, { useState } from "react";
import { sv } from "date-fns/locale";
import Calendar from "./calendar";
import EventForm from "../forms/EventForm";
import { useCalendarEvents } from "../../hooks/useCalendarEvents";
import { useStableData } from "../../hooks/useStableData";
import { useAppContext } from "../../context/AppContext";
import StableName from "../layout/StableName";
import LoadingSpinner from "../ui/LoadingSpinner";

function CalendarDisplay() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [selectedDay, setSelectedDay] = useState(new Date());

  // Get the global stable ID from context
  const { currentStable, currentUser } = useAppContext();
  const currentUserId = currentUser.id;

  // Custom hooks for data fetching
  const {
    stableId,
    status: stableStatus,
    loadingState: stableLoadingState,
  } = useStableData(currentStable.id);
  const {
    events,
    users,
    calendarStatus,
    loadingState: calendarLoadingState,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsForDay,
  } = useCalendarEvents(stableId || currentStable.id);

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
      stableIdFk: stableId || currentStable.id,
      userIdFk: currentUserId,
    });

    if (success) handleCloseEventForm();
    else console.error("Could not create event");
  };

  const handleUpdateEvent = async (eventData) => {
    const success = await updateEvent({
      ...eventData,
      id: currentEvent.id,
      stableIdFk: stableId || currentStable.id,
      userIdFk: currentUserId,
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

  // Loading state
  if ((calendarStatus.loading && events.length === 0) || stableStatus.loading) {
    return (
      <div className="py-2 text-gray flex items-center justify-center">
        <LoadingSpinner size="medium" className="text-gray" />
        <p>
          {stableStatus.loading
            ? stableLoadingState.getMessage()
            : calendarLoadingState.getMessage()}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-2 bg-background">
      <div className="mx-auto">
        {/* Stable Title */}
        <h1 className="text-center mb-5 font-heading md:pb-10">
          <StableName currentStableId={currentStable.id} />
        </h1>

        {/* Loading and error status messages */}
        {calendarStatus.loading && events.length > 0 && (
          <div className="text-center py-2 flex items-center justify-center">
            <LoadingSpinner size="small" className="text-gray" />
            <span>{calendarLoadingState.getMessage()}</span>
          </div>
        )}

        {/* Event form modal */}
        {isFormOpen && (
          <EventForm
            event={currentEvent}
            onSubmit={currentEvent ? handleUpdateEvent : handleCreateEvent}
            onCancel={handleCloseEventForm}
            onDeleteEvent={handleDeleteEvent}
            title={currentEvent ? "Ändra Aktivitet" : "Ny Aktivitet"}
            date={selectedDay}
            stables={stableId}
            users={users}
          />
        )}
        <Calendar
          stableId={stableId || currentStable.id}
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
    </div>
  );
}

export default CalendarDisplay;
