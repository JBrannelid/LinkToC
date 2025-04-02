import React, { useState, useEffect } from "react";

const FetchEventData = () => {
  const [event, setEvent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("api"); // Replace with actual API URL
      if (!response.ok) {
        throw new Error("Det vart fel med hämtning av data från BE");
      }

      // Parse the JSON response
      const data = await response.json();

      // Update state with fetched data
      setEvent(data);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch events when the component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  // Loading state display
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {/* Loader component */}
      </div>
    );
  }

  // Error state display
  if (error) {
    return (
      <div className="flex items-center">
        <p>{error}</p>
      </div>
    );
  }

  // Render event data when successfully fetched
  return (
    <div>
      <h1>Events data</h1>
    </div>
  );
};

export default FetchEventData;
