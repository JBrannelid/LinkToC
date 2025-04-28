import React, { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import WallPostForm from "../forms/WallPostForm";
import useWallPost from "../../hooks/useWallPost";
import Pin from "../../assets/icons/Pin";
import ChevronDown from "../../assets/icons/ChevronDown";

export default function WallPost({ id }) {
  const { wallPost, loading, error, currentWallPost } = useWallPost(id);

  useEffect(() => {
    const wallPostData = currentWallPost(id);
  }, [id, currentWallPost]);

  //Toggle for the form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const toggleForm = () => {
    setIsFormOpen((prev) => !prev);
  };

  //Toggle for the content/body of the WallPost
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {wallPost ? (
        <div className="mt-5 px-2">
          <h2 className="text-2xl mb-2">Väggen</h2>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div
              className="p-4 flex items-center cursor-pointer"
              onClick={toggleExpand}
              aria-label="Expandable important message"
            >
              <div className="text-primary mr-3">
                <Pin className="w-6 h-6" />
              </div>
              <p className="flex-1">{wallPost.title}</p>
              <div className="text-primary">
                <ChevronDown
                  className={`w-6 h-6 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            {isExpanded && (
              <div className="px-4 pb-4">
                <p className="font-light text-sm">{wallPost.body}</p>
                <br />

                {wallPost?.lastEdited ? (
                  <p className="font-light text-xs">
                    Edited: (
                    {format(new Date(wallPost.lastEdited), "yyyy-MM-dd HH:mm")})
                  </p>
                ) : (
                  <p className="font-light text-xs">
                    Posted: (
                    {format(new Date(wallPost.postDate), "yyyy-MM-dd HH:mm")})
                  </p>
                )}

                <div>
                  <button
                    onClick={toggleForm}
                    className="px-2 py-1 bg-olive-500 text-white rounded hover:bg-olive-600 text-sm"
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
        <p>Inga tillgänglig händelse</p>
      )}
      {/* Older ver */}
      {/* {wallPost ? (
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
                    onClick={toggleForm}
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
      )} */}
    </>
  );
}
