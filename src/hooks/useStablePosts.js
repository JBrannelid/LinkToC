import { useState, useEffect, useCallback } from "react";
import stablePostService from "../api/services/stablePostService";
import { useLoadingState } from "./useLoadingState";
import { useAppContext } from "../context/AppContext";

export function useStablePosts(stableId) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationType, setOperationType] = useState("fetch");
  const { stableRefreshKey } = useAppContext();
  const loadingState = useLoadingState(loading, operationType);

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
  }, [fetchAndUpdatePosts, stableRefreshKey]);

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

  // Fetch comments for a specific post
  const fetchComments = useCallback(async (postId) => {
    if (!postId) return false;

    setCommentLoading(true);
    setCommentError(null);

    try {
      const response = await stablePostService.getCommentsByPostId(postId);

      // Update comments state with the fetched comments for this post
      setComments((prevComments) => ({
        ...prevComments,
        [postId]: response,
      }));

      return true;
    } catch (error) {
      setCommentError(error.message || "Failed to retrieve comments");
      return false;
    } finally {
      setCommentLoading(false);
    }
  }, []);

  // Create a new comment
  const createComment = async (postId, content) => {
    if (!postId || !content) return false;

    setCommentLoading(true);
    setCommentError(null);

    try {
      const commentData = {
        userId: currentUser.id,
        stablePostId: postId,
        content: content,
      };

      await stablePostService.createComment(commentData);

      // Refresh comments for this post
      await fetchComments(postId);

      // Also refresh posts to update comment counts
      await fetchAndUpdatePosts();

      return true;
    } catch (error) {
      setCommentError(error.message || "Failed to create comment");
      return false;
    } finally {
      setCommentLoading(false);
    }
  };

  // Delete a comment
  const deleteComment = async (commentId, postId) => {
    if (!commentId || !postId) return false;

    setCommentLoading(true);
    setCommentError(null);

    try {
      await stablePostService.deleteComment(commentId);

      // Refresh comments for this post
      await fetchComments(postId);

      // Also refresh posts to update comment counts
      await fetchAndUpdatePosts();

      return true;
    } catch (error) {
      setCommentError(error.message || "Failed to delete comment");
      return false;
    } finally {
      setCommentLoading(false);
    }
  };

  // Set the active post for comments
  const setActivePost = (postId) => {
    setActivePostId(postId);
    if (postId) {
      fetchComments(postId);
    }
  };

  return {
    posts,
    status: { loading, error },
    loadingState,
    comments,
    activePostId,
    commentLoading,
    commentError,
    createPost,
    updatePost,
    deletePost,
    togglePinStatus,
    fetchAndUpdatePosts,
    fetchComments,
    createComment,
    deleteComment,
    setActivePost,
  };
}

export default useStablePosts;
