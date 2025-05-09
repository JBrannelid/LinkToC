import React, { useState } from "react";
import Calendar from "../components/calendar/calendar";
import { sv } from "date-fns/locale";
import WallPost from "../components/posts/WallPost";
import EventsContainer from "../components/calendar/events/EventsContainer";
import { useCalendarEvents } from "../hooks/useCalendarEvents";
import { useStableData } from "../hooks/useStableData";
import { useAppContext } from "../context/AppContext";
import StableName from "../components/layout/StableName";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { startOfToday } from "../utils/calendarUtils";
import * as calendarUtils from "../utils/calendarUtils";
import EventForm from "../components/forms/EventForm";

export default function HomePage() {
  const [selectedDay, setSelectedDay] = useState(startOfToday());
  const [showWallPost, setShowLgWallPost] = useState(true);
  const [currentDayEvents, setCurrentDayEvents] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
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
        `Are you sure you want to delete event "${eventTitle}" created by ${creator}?`
      )
    ) {
      await deleteEvent(eventId);
    }
  };

  // Handle day selection
  const handleSelectDay = (day) => {
    setSelectedDay(day);
  };

  // Handle day with events is selected (for lg layout)
  const handleDayWithEventsSelected = (day, events) => {
    setCurrentDayEvents(events);
    setShowLgWallPost(false);
  };

  // Return to wall view on lg screens
  const handleBackToWall = () => {
    setShowLgWallPost(true);
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
    <div className="mt-5 md:mt-10 pb-20 md:pb-10 lg:max-w-[1440px] sm:px-1 xl:px-16 lg:px-14">
      {/* Stable Title */}
      <h1 className="text-center mb-5 md:hidden lg:hidden">
        <StableName currentStableId={currentStable.id} />
      </h1>

      {/* Event form modal */}
      {isFormOpen && (
        <EventForm
          event={currentEvent}
          onSubmit={currentEvent ? handleUpdateEvent : handleCreateEvent}
          onCancel={handleCloseEventForm}
          onDeleteEvent={handleDeleteEvent}
          title={currentEvent ? "Edit Activity" : "New Activity"}
          date={selectedDay}
          stables={stableId}
          users={users}
        />
      )}

      {/* Calendar Section */}
      <section className="grid grid-cols-1">
        <Calendar
          stableId={stableId || currentStable.id}
          events={events}
          users={users}
          locale={sv}
          noEventsMessage="No scheduled events"
          onAddEvent={handleOpenEventForm}
          onUpdateEvent={handleOpenUpdateForm}
          onDeleteEvent={handleDeleteEvent}
          getEventsForDay={getEventsForDay}
          selectedDay={selectedDay}
          onSelectDay={handleSelectDay}
          onDayWithEventsSelected={handleDayWithEventsSelected}
        >
          {/* Wall/EventList conditional rendered - md screen above */}
          {showWallPost ? (
            <div>
              <h1 className=" text-center pt-12 mb-10">
                <StableName currentStableId={currentStable.id} />
              </h1>
              <WallPost />
            </div>
          ) : (
            <div>
              <EventsContainer
                selectedDay={selectedDay}
                events={currentDayEvents}
                format={calendarUtils.format}
                formatFullDayDate={calendarUtils.formatFullDayDate}
                locale={sv}
                noEventsMessage="No scheduled events"
                onUpdateEvent={handleOpenUpdateForm}
                onDeleteEvent={handleDeleteEvent}
                onAddEvent={handleOpenEventForm}
                isOpen={true}
                viewMode="desktop"
                onBackToWall={handleBackToWall}
              />
            </div>
          )}
        </Calendar>
      </section>

      {/* Mobile Wall Post */}
      <section className="mx-auto md:mx-0 md:hidden lg:hidden">
        <WallPost />
      </section>
    </div>
  );
}
