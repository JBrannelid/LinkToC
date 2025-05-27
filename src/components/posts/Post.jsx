import React, { useCallback, useEffect, useState } from "react";
import { stablePostService } from "../../api";
import { useLoadingState } from "../../hooks/useLoadingState";
import LoadingSpinner from "../ui/LoadingSpinner";

export default function Post({ id }) {
  const [post, setPost] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [operationType, setOperationType] = useState("fetch");

  const loadingState = useLoadingState(loading, operationType);

  const handlePost = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setOperationType("fetch");
      const fetchPost = await stablePostService.getById(id);
      setPost(fetchPost.value);
      return true;
    } catch {
      setError("Failed to fetch post");
      return false;
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    handlePost();
  }, [handlePost]);

  if (loading) {
    return (
      <div className="flex items-center py-2">
        <LoadingSpinner size="small" className="text-gray" />
        <span>{loadingState.getMessage()}</span>
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!post) {
    return <p>Post not found</p>;
  }

  return (
    <div>
      <h2 className="underline">{post.title}</h2>
      <p>{post.content}</p>
      <p>{post.date}</p>
    </div>
  );
}
