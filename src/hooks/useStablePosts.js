import { useState, useEffect, useCallback } from "react";
import stablePostService from "../api/services/stablePostService";
import { useLoadingState } from "./useLoadingState";

export function useStablePosts(stableId) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationType, setOperationType] = useState("fetch");

  const fetchAndUpdatePosts = useCallback(async () => {
    if (!stableId) return false;

    setOperationType("fetch");
    try {
      setLoading(true);
      setError(null);

      // Get all stable posts base on a stable id
      const response = await stablePostService.getStablePosts(stableId);

      setPosts(response);
      return true;
    } catch (error) {
      setError(error.message || "Failed to retrieve stable posts");
      return false;
    } finally {
      setLoading(false);
    }
  }, [stableId]);

  useEffect(() => {
    fetchAndUpdatePosts();
  }, [fetchAndUpdatePosts]);

  // Create new post
  const createPost = async (postData) => {
    setOperationType("create");
    try {
      setLoading(true);
      setError(null);

      // Send postData with stable id to stablePostService
      const postWithStableId = {
        ...postData,
        stableIdFk: stableId,
      };

      await stablePostService.create(postWithStableId);
      await fetchAndUpdatePosts();
      return true;
    } catch (error) {
      setError(error.message || "Failed to create post");
      setLoading(false);
      return false;
    }
  };

  // Update existing post
  const updatePost = async (postData) => {
    setOperationType("update");
    try {
      setLoading(true);
      setError(null);

      // Required fields - Match Backend DTO
      const updateData = {
        id: postData.id,
        title: postData.title,
        content: postData.content,
      };

      await stablePostService.update(updateData);
      await fetchAndUpdatePosts();
      return true;
    } catch (error) {
      setError(error.message || "Failed to update post");
      setLoading(false);
      return false;
    }
  };

  // Delete a post by ID
  const deletePost = async (postId) => {
    setOperationType("delete");
    try {
      setLoading(true);
      setError(null);

      // Delete a postData base on the postID
      await stablePostService.delete(postId);
      await fetchAndUpdatePosts();
      return true;
    } catch (error) {
      setError(error.message || "Failed to delete post");
      setLoading(false);
      return false;
    }
  };

  // Toggle pin status of a post
  const togglePinStatus = async (postId) => {
    setOperationType("update");
    try {
      setLoading(true);
      setError(null);

      await stablePostService.togglePin(postId);
      await fetchAndUpdatePosts();
      return true;
    } catch (error) {
      setError(error.message || "Failed to toggle pin status");
      setLoading(false);
      return false;
    }
  };

  const loadingState = useLoadingState(loading, operationType);

  return {
    posts,
    status: { loading, error },
    loadingState,
    createPost,
    updatePost,
    deletePost,
    togglePinStatus,
    fetchAndUpdatePosts,
  };
}

export default useStablePosts;
