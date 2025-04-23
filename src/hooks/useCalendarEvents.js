import { useState, useEffect, useCallback } from "react";
import eventService from "../api/services/eventService";
import userService from "../api/services/userService";
import { parseISO, isSameDay } from "../utils/calendarUtils";

export function useCalendarEvents(stableId) {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hard-coded userID until we have logic to handle userId dynamic
  const DEFAULT_USER_ID = 1;

  const fetchAndUpdateEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get Users
      const userResponse = await userService.getAll();
      const userList = Array.isArray(userResponse) ? userResponse : [];
      setUsers(userList);

      // Get events from stableId
      const eventsResponse = await eventService.getStableEvents(stableId);
      const eventList = Array.isArray(eventsResponse) ? eventsResponse : [];

      // Find current user from the user list
      const currentUser = userList.find((user) => user.id === DEFAULT_USER_ID);

      // Process events to ensure they have user references
      const processedEvents = eventList.map((event) => {
        let eventUser = null;

        // If the event has a userIdFk, look up the user
        if (event.userIdFk) {
          eventUser = userList.find((user) => user.id === event.userIdFk);
        }

        // If no user found, assign one for testing
        if (!eventUser && userList.length > 0) {
          const userIndex = event.id % userList.length;
          eventUser = userList[userIndex] || currentUser;
        }

        // Return the event with user information
        return {
          ...event,
          user: eventUser || currentUser,
          userIdFk:
            event.userIdFk || (eventUser ? eventUser.id : DEFAULT_USER_ID),
        };
      });

      setEvents(processedEvents);

      return true;
    } catch (error) {
      setError(error.message || "Failed to retrieve calendar data");
      return false;
    } finally {
      setLoading(false);
    }
  }, [stableId]);

  useEffect(() => {
    fetchAndUpdateEvents();
  }, [fetchAndUpdateEvents]);

  const createEvent = async (eventData) => {
    try {
      setLoading(true);
      setError(null);

      const eventWithDetails = {
        ...eventData,
        stableIdFk: stableId,
        userIdFk: DEFAULT_USER_ID,
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
    try {
      setLoading(true);
      setError(null);

      const eventWithDetails = {
        ...eventData,
        stableIdFk: stableId,
        userIdFk: DEFAULT_USER_ID,
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

  return {
    events,
    users,
    calendarStatus: { loading, error },
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsForDay,
    fetchAndUpdateEvents,
  };
}
