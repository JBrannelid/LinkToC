import { useState, useCallback, useEffect } from "react";
import { wallPostService } from "../api";

export const useWallPost = (id) => {
  const [wallPost, setWallPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentWallPost = useCallback(async () => {
    try {
      setLoading(true);
      const fetchWallPost = await wallPostService.getById(id);
      setWallPost(fetchWallPost.value);
      return true;
    } catch (error) {
      setLoading(false);
      return false;
    } finally {
      setLoading(false);
      return false;
    }
  }, [id]);

  useEffect(() => {
    currentWallPost();
  }, [currentWallPost]);

  return { wallPost, id, loading, error, currentWallPost };
};

export default useWallPost;
