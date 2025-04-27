import React, { useCallback, useEffect, useState } from "react";
import { stablePostService } from "../../api";
import LoadingSpinner from "../ui/LoadingSpinner";

export default function Post({ id }) {
  const [post, setPost] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handlePost = useCallback(async () => {
    try {
      setLoading(true);
      const fetchPost = await stablePostService.getById(id);
      setPost(fetchPost.value);
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
    handlePost();
  }, [handlePost]);

  if (loading)
    return (
      <div className="flex items-center py-2">
        <LoadingSpinner size="small" className="text-gray" />
        <span>Laddar...</span>
      </div>
    );
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2 className="underline">{post.title}</h2>
      <p>{post.content}</p>
      <p>{post.date}</p>
    </div>
  );
}
