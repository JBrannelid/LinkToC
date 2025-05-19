import { useState, useEffect, useCallback } from "react";
import stablePostService from "../api/services/stablePostService";
import { useLoadingState } from "./useLoadingState";
import { useAppContext } from "../context/AppContext";

export function useStablePosts(stableId, currentUser) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationType, setOperationType] = useState("fetch");
  const { stableRefreshKey } = useAppContext();
  const loadingState = useLoadingState(loading, operationType);
  const [comments, setComments] = useState({});
  const [activePostId, setActivePostId] = useState(null);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState(null);

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

      const normalizedComments = Array.isArray(response)
        ? response.map((comment) => ({
            id: comment.id,
            content: comment.content || comment.Content,
            commentDate: comment.commentDate || comment.CommentDate,
            userId: comment.userId || comment.UserId || currentUser?.id,
            userName: comment.userName,
            userProfileImage: comment.userProfileImage,
          }))
        : [];

      // Update comments state
      setComments((prevComments) => ({
        ...prevComments,
        [postId]: normalizedComments,
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
    if (!postId || !content || !currentUser?.id) return false;

    setCommentLoading(true);
    setCommentError(null);

    try {
      const commentData = {
        userId: currentUser.id,
        stablePostId: postId,
        comment: {
          content: content,
        },
      };

      await stablePostService.createComment(commentData);

      await fetchComments(postId);
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
      console.log(
        `Deleting comment with ID: ${commentId} from post: ${postId}`
      );

      // Call the API to delete the comment
      const result = await stablePostService.deleteComment(commentId);

      // If successful, update our local state
      if (result) {
        // Remove the comment from our local state
        setComments((prevComments) => {
          const updatedPostComments = (prevComments[postId] || []).filter(
            (comment) => comment.id !== commentId
          );

          return {
            ...prevComments,
            [postId]: updatedPostComments,
          };
        });

        // Also refresh the posts to update any comment counts
        await fetchAndUpdatePosts();
      }

      return true;
    } catch (error) {
      console.error("Error deleting comment:", error);
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

  const initializeCommentCounts = useCallback(async () => {
    if (!posts || posts.length === 0) return;

    try {
      await Promise.all(posts.map((post) => fetchComments(post.id)));
    } catch (error) {
      console.error("Failed to initialize comment counts:", error);
    }
  }, [posts, fetchComments]);

  // Call this function when posts are loaded
  useEffect(() => {
    if (posts && posts.length > 0) {
      initializeCommentCounts();
    }
  }, [posts, initializeCommentCounts]);

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
