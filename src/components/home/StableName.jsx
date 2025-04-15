import React, { useState, useCallback, useEffect } from "react";
import { stableService } from "../../api";

export default function StableName({ id }) {
  const [stableName, setStableName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStableName = useCallback(async () => {
    try {
      setLoading(true);
      const fetchStableName = await stableService.getById(id);
      setStableName(fetchStableName.value.name);
      return true;
    } catch (error) {
      setLoading(false);
      return false;
    } finally {
      setLoading(false);
      return false;
    }
  }, [id]);

  //load the handleStableName as user is in the website (useCallback won't run auto)
  useEffect(() => {
    handleStableName();
  }, [handleStableName]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <p>{stableName}</p>;
}
