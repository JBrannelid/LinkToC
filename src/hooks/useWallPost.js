import { useState, useCallback, useEffect } from "react";
import wallPostService from "../api/services/wallPostService";
import { useAppContext } from "../context/AppContext";

export const useWallPost = (stableId) => {
  const [wallPost, setWallPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentStable } = useAppContext();

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

  // creates empty wallPost with only stable ID
  const createWallPost = async (data) => {
    console.log("createWallPost called with data:", data); // Debugging
    try {
      setLoading(true);
      setError(null);

      const createNewPost = {
        stableId: data.stableId,
      };

      await wallPostService.create(createNewPost);

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

  //creates new Content (title & body) for WallPost
  const replaceWallPost = async (data) => {
    try {
      setLoading(true);
      setError(null);

      const replaceWallPost = {
        stableIdFk: currentStable.id,
        title: data.title,
        body: data.body,
      };

      await wallPostService.replace(replaceWallPost);

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
    replaceWallPost,
  };
};

export default useWallPost;
