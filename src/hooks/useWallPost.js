import { useState, useCallback, useEffect } from "react";
import { wallPostService } from "../api";

export const useWallPost = (stableId) => {
  const [wallPost, setWallPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentWallPost = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchWallPost = await wallPostService.getById(stableId);
      setWallPost(fetchWallPost.value);

      return true;
    } catch (error) {
      setError(error);
      setLoading(false);

      return false;
    } finally {
      setLoading(false);
    }
  }, [stableId]);

  useEffect(() => {
    if (stableId) {
      currentWallPost();
    }
  }, [stableId, currentWallPost]);

  return { wallPost, loading, error, currentWallPost };
};

export default useWallPost;
