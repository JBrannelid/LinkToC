import { useState, useEffect, useCallback } from "react";
import eventService from "../api/services/eventService";
import { parseISO, isSameDay } from "../utils/calendarUtils";
import { useAppContext } from "../context/AppContext.jsx";
import { useLoadingState } from "./useLoadingState";

export function useCalendarEvents(stableId) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current user from context
  const { currentUser, stableRefreshKey } = useAppContext();
  const currentUserId = currentUser.id;
  const [operationType, setOperationType] = useState("fetch");

  const fetchAndUpdateEvents = useCallback(async () => {
    setOperationType("fetch");

    try {
      setLoading(true);
      setError(null);

      // Get events for the specified stable and convert object into a array of events
      const eventsResponse = await eventService.getStableEvents(stableId);
      const eventList = Array.isArray(eventsResponse) ? eventsResponse : [];

      const processedEvents = eventList.map((event) => ({
        ...event,
        user: {
          id: event.userIdFk,
          firstName: event.userFirstName,
          lastName: event.userLastName,
          profilePicture: event.userProfilePicture || event.profilePicture,
        },
      }));

      setEvents(processedEvents);

      return true;
    } catch (error) {
      setError(error.message || "Failed to retrieve calendar data");
      return false;
    } finally {
      setLoading(false);
    }
  }, [stableId, currentUserId]);

  useEffect(() => {
    fetchAndUpdateEvents();
  }, [fetchAndUpdateEvents, stableId, stableRefreshKey]);

  const createEvent = async (eventData) => {
    setOperationType("create");

    try {
      setLoading(true);
      setError(null);

      const eventWithDetails = {
        ...eventData,
        stableIdFk: stableId,
        userIdFk: currentUserId,
      };

      await eventService.create(eventWithDetails);
      await fetchAndUpdateEvents();
      return true;
    } catch (error) {
      setError(error.message || "Failed to create event");
      setLoading(false);
      return false;
    }
  };

  const updateEvent = async (eventData) => {
    setOperationType("update");

    try {
      setLoading(true);
      setError(null);

      const eventWithDetails = {
        ...eventData,
        stableIdFk: stableId,
        userIdFk: currentUserId,
      };

      await eventService.update(eventWithDetails);
      await fetchAndUpdateEvents();
      return true;
    } catch (error) {
      setError(error.message || "Failed to update event");
      setLoading(false);
      return false;
    }
  };

  const deleteEvent = async (eventId) => {
    setOperationType("delete");

    try {
      setLoading(true);
      setError(null);

      await eventService.delete(eventId);
      await fetchAndUpdateEvents();
      return true;
    } catch (error) {
      setError(error.message || "Failed to delete event");
      setLoading(false);
      return false;
    }
  };

  const getEventsForDay = useCallback(
    (day) => {
      if (!events.length) return [];

      return events
        .filter((event) => {
          if (!event.startDateTime) return false;
          return isSameDay(parseISO(event.startDateTime), day);
        })
        .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
    },
    [events]
  );

  const loadingState = useLoadingState(loading, operationType);

  return {
    events,
    calendarStatus: { loading, error },
    loadingState,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsForDay,
    fetchAndUpdateEvents,
  };
}
