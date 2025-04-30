import { useState, useCallback, useEffect } from "react";
import wallPostService from "../api/services/wallPostService";

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

  const updateWallPost = async (data) => {
    try {
      setLoading(true);
      setError(null);

      const updateData = {
        stableIdFk: stableId,
        title: data.title,
        body: data.body,

        // id: wallPost.id,
        // title: data.title,
        // body: data.body,
        // lastEdited: new Date().toISOString(),
        // stableIdFk: stableId,
      };

      await wallPostService.update(updateData);

      // Refresh data
      await currentWallPost();
      return true;
    } catch (error) {
      setError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createWallPost = async (data) => {
    try {
      setLoading(true);
      setError(null);

      const createData = {
        stableIdFk: stableId,
        title: data.title,
        body: data.body,
      };

      await wallPostService.update(updateData);

      // Refresh data
      await currentWallPost();
      return true;
    } catch (error) {
      setError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (stableId) {
      currentWallPost();
    }
  }, [stableId, currentWallPost]);

  return {
    wallPost,
    loading,
    error,
    currentWallPost,
    updateWallPost,
    createWallPost,
  };
};

export default useWallPost;
