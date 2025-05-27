import { enUS } from "date-fns/locale";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Calendar from "../components/calendar/calendar";
import EventsContainer from "../components/calendar/events/EventsContainer";
import EventForm from "../components/forms/EventForm";
import StableName from "../components/layout/StableName";
import WallPost from "../components/posts/WallPost";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useAppContext } from "../hooks/useAppContext.js";
import { useCalendarEvents } from "../hooks/useCalendarEvents";
import { useStableData } from "../hooks/useStableData";
import { startOfToday } from "../utils/calendarUtils";
import * as calendarUtils from "../utils/calendarUtils";

export default function HomePage() {
  const [selectedDay, setSelectedDay] = useState(startOfToday());
  const [showWallPost, setShowLgWallPost] = useState(true);
  const [currentDayEvents, setCurrentDayEvents] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { currentStable, currentUser } = useAppContext();
  const currentUserId = currentUser.id;

  const {
    stableId,
    status: stableStatus,
    loadingState: stableLoadingState,
  } = useStableData(currentStable.id);

  const {
    events,
    calendarStatus,
    loadingState: calendarLoadingState,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsForDay,
    fetchAndUpdateEvents,
  } = useCalendarEvents(stableId || currentStable.id);

  const memoizedEvents = useMemo(() => events, [events]);

  const currentStableId = useMemo(
    () => stableId || currentStable.id,
    [stableId, currentStable.id]
  );

  useEffect(() => {
    if (!selectedDay) return;
    const dayEvents = getEventsForDay(selectedDay);
    setCurrentDayEvents(dayEvents);
  }, [memoizedEvents, selectedDay, getEventsForDay, refreshKey]);

  const handleOpenEventForm = useCallback(() => {
    setIsFormOpen(true);
    setCurrentEvent(null);
  }, []);

  const handleCloseEventForm = useCallback(() => {
    setIsFormOpen(false);
    setCurrentEvent(null);
  }, []);

  const handleOpenUpdateForm = useCallback(
    (eventId) => {
      const eventToEdit = memoizedEvents.find((event) => event.id === eventId);
      if (eventToEdit) {
        setCurrentEvent(eventToEdit);
        setIsFormOpen(true);
      } else {
        console.error(`Event with ID ${eventId} not found`);
      }
    },
    [memoizedEvents]
  );

  const refreshEventsData = useCallback(async () => {
    await fetchAndUpdateEvents();
    const freshEvents = getEventsForDay(selectedDay);
    setCurrentDayEvents(freshEvents);
    setRefreshKey((prev) => prev + 1);
  }, [fetchAndUpdateEvents, getEventsForDay, selectedDay]);

  const handleCreateEvent = useCallback(
    async (eventData) => {
      const success = await createEvent({
        ...eventData,
        stableIdFk: currentStableId,
        userIdFk: currentUserId,
      });

      if (success) {
        handleCloseEventForm();
        await refreshEventsData();
      } else console.error("Could not create event");
    },
    [
      createEvent,
      currentStableId,
      currentUserId,
      handleCloseEventForm,
      refreshEventsData,
    ]
  );

  const handleUpdateEvent = useCallback(
    async (eventData) => {
      const success = await updateEvent({
        ...eventData,
        id: currentEvent.id,
        stableIdFk: currentStableId,
        userIdFk: currentUserId,
      });

      if (success) {
        handleCloseEventForm();
        await refreshEventsData();
      } else console.error("Could not update event");
    },
    [
      updateEvent,
      currentEvent,
      currentStableId,
      currentUserId,
      handleCloseEventForm,
      refreshEventsData,
    ]
  );

  const handleDeleteEvent = useCallback(
    async (eventId) => {
      const eventToDelete = memoizedEvents.find(
        (event) => event.id === eventId
      );
      if (!eventToDelete) return;

      {
        await deleteEvent(eventId);
        await refreshEventsData();
      }
    },
    [memoizedEvents, deleteEvent, refreshEventsData]
  );

  const handleSelectDay = useCallback(
    (day) => {
      setSelectedDay(day);
      const dayEvents = getEventsForDay(day);
      setCurrentDayEvents(dayEvents);
    },
    [getEventsForDay]
  );

  const handleDayWithEventsSelected = useCallback((day, events) => {
    setCurrentDayEvents(events);
    setShowLgWallPost(false);
  }, []);

  const handleBackToWall = useCallback(() => {
    setShowLgWallPost(true);
  }, []);

  if (
    (calendarStatus.loading && memoizedEvents.length === 0) ||
    stableStatus.loading
  ) {
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
    <div className="mt-5 md:mt-10 pb-20 md:pb-10 sm:px-1 xl:px-16 lg:px-14">
      <div className="flex items-center justify-center mb-5 md:hidden">
        <StableName />
      </div>

      {isFormOpen && (
        <EventForm
          event={currentEvent}
          onSubmit={currentEvent ? handleUpdateEvent : handleCreateEvent}
          onCancel={handleCloseEventForm}
          onDeleteEvent={handleDeleteEvent}
          title={currentEvent ? "Edit Activity" : "New Activity"}
          date={selectedDay}
          stables={currentStableId}
        />
      )}

      <section className="grid grid-cols-1">
        <Calendar
          key={refreshKey}
          stableId={currentStableId}
          events={memoizedEvents}
          locale={enUS}
          noEventsMessage="No scheduled events"
          onAddEvent={handleOpenEventForm}
          onUpdateEvent={handleOpenUpdateForm}
          onDeleteEvent={handleDeleteEvent}
          getEventsForDay={getEventsForDay}
          selectedDay={selectedDay}
          onSelectDay={handleSelectDay}
          onDayWithEventsSelected={handleDayWithEventsSelected}
        >
          {showWallPost ? (
            <div className="mt-20">
              <div className="hidden md:block lg:hidden">
                <h1 className="hidden md:block lg:hidden md:text-center md:text-2xl">
                  <StableName currentStableId={currentStable.id} />
                </h1>
              </div>
              <div className="hidden md:block lg:block mt-10">
                <WallPost />
              </div>
            </div>
          ) : (
            <div>
              <EventsContainer
                key={refreshKey}
                selectedDay={selectedDay}
                events={currentDayEvents}
                format={calendarUtils.format}
                formatFullDayDate={calendarUtils.formatFullDayDate}
                locale={enUS}
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

      <section className="mx-1 sm:mx-15 md:hidden lg:hidden">
        <WallPost />
      </section>
    </div>
  );
}
