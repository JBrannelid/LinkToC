import React, { useCallback, useEffect, useState } from "react";
import WallPostForm from "../forms/WallPostForm";

export default function WallPost() {
  const [wallPost, setWallPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //   const currentWallPost = useCallback(async () => {
  //     try {
  //       setLoading(true);
  //       const fetchWallPost = await WALLPOSTSERVICE.getbyid!!!
  //       setWallPost(fetchWallPost);
  //       return true;
  //     } catch (error) {
  //       setLoading(false);
  //       return false;
  //     } finally {
  //       setLoading(false);
  //       return false;
  //     }
  //   }, [id]);

  //   useEffect(() => {
  //     currentWallPost();
  //   }, [currentWallPost]);

  const [isFormOpen, setIsForOpen] = useState(false);
  const toggleButton = () => {
    setIsFormOpen((prev) => !prev);
  };

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

      {/* <div class=wallpostservice>
    {wallPost.title}
    {wallPost.body}
    {wallPost.editedDateTime}
  </div> */}
    </>
  );
}
