import { useState, useEffect, useCallback } from "react";
import eventService from "../api/services/eventService";

export function useCalendarEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAndUpdateEvents = useCallback(async () => {
    try {
      // Set loading to true and clear any previous errors
      setLoading(true);
      setError(null);

      const fetchedEventsData = await eventService.getAll();

      // Update events list with new data
      setEvents(fetchedEventsData);

      return true;
    } catch (error) {
      // Error already formatted by axiosConfig interceptor
      console.error("Error fetching events:", error);
      setError(error.message || "Något gick fel vid hämtning av kalenderdata");
      return false;
    } finally {
      // Always reset loading state when done to prevent endless loading spinner
      setLoading(false);
    }
  }, []);

  // Load events when component mounts (runs once)
  useEffect(() => {
    fetchAndUpdateEvents();
  }, [fetchAndUpdateEvents]);

  const createEvent = async (eventData) => {
    try {
      setLoading(true);
      setError(null);

      await eventService.create(eventData);
      await fetchAndUpdateEvents();
      return true;
    } catch (error) {
      // Use the error message already formatted by the axios interceptor
      setError(error.message || "Kunde inte skapa händelse");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (eventData) => {
    try {
      setLoading(true);
      setError(null);

      await eventService.update(eventData);
      await fetchAndUpdateEvents();
      return true;
    } catch (error) {
      setError(error.message || "Kunde inte uppdatera händelse");
      return false;
    } finally {
      setLoading(false);
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
      setError(error.message || "Ett fel inträffade. Event kunde inte raderas");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    events,
    status: { loading, error },
    createEvent,
    updateEvent,
    deleteEvent,
  };
}
