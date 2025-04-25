import React, { useCallback, useEffect, useState } from "react";
import WallPostForm from "../forms/WallPostForm";
import useWallPost from "../../hooks/useWallPost";

export default function WallPost({ id }) {
  const { wallPost, loading, error, currentWallPost } = useWallPost(id);

  useEffect(() => {
    const wallPostData = currentWallPost(id);
  }, [id, currentWallPost]);

  //Toggle for the forma
  const [isFormOpen, setIsFormOpen] = useState(false);
  const toggleButton = () => {
    setIsFormOpen((prev) => !prev);
  };

  //For the content/body of the WallPost
  const [isOpen, setIsOpen] = useState(false);
  const isChecked = () => {
    setIsOpen((prev) => !prev);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {wallPost ? (
        <div className="bg-bg-primary p-6 mb-6 rounded-lg shadow-md border-2 border-bg-secondary">
          <h2 className="underline">{wallPost.title}</h2>
          <div>
            <input type="checkbox" onChange={isChecked} checked={isOpen} />

            {isOpen && (
              <div>
                <p>{wallPost.body}</p>
                <p>{wallPost.postDate}</p>

                <div>
                  <button
                    onClick={toggleButton}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    {isFormOpen ? "Close" : "Edit Post"}
                  </button>

                  {isFormOpen && <WallPostForm />}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>No post available</p>
      )}
    </>
  );
}
