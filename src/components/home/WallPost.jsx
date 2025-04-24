import React, { useCallback, useEffect, useState } from "react";
import WallPostForm from "../forms/WallPostForm";
import { wallPostService } from "../../api";

export default function WallPost({ id }) {
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

  const [isFormOpen, setIsFormOpen] = useState(false);
  const toggleButton = () => {
    setIsFormOpen((prev) => !prev);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div>
        <button
          onClick={toggleButton}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isFormOpen ? "Close" : "Edit Post"}
        </button>

        {isFormOpen && <WallPostForm />}
      </div>

      {wallPost ? (
        <div>
          <h2 className="underline">{wallPost.title}</h2>
          <p>{wallPost.body}</p>
          <p>{wallPost.postDate}</p>
        </div>
      ) : (
        <p>No post available</p>
      )}
    </>
  );
}
