import React, { useState, useCallback, useEffect } from "react";
import { stableService } from "../../api";
import { useAppContext } from "../../context/AppContext.jsx";

export default function StableName({ currentStableId }) {
  const [stableName, setStableName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { changeStable } = useAppContext();

  const handleStableName = useCallback(async () => {
    try {
      setLoading(true);
      const fetchStableName = await stableService.getById(currentStableId);

      if (fetchStableName?.value?.name) {
        setStableName(fetchStableName.value.name);
        // Update the context with both ID and name
        changeStable(currentStableId, fetchStableName.value.name);
      }

      return true;
    } catch (error) {
      setLoading(false);
      return false;
    } finally {
      setLoading(false);
      return false;
    }
  }, [currentStableId]);

  //load the handleStableName as user is in the website (useCallback won't run auto)
  useEffect(() => {
    handleStableName();
  }, [handleStableName]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <p>{stableName}</p>;
}
