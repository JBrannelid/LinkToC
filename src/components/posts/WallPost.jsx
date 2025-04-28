import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { parseISO } from "../../utils/calendarUtils";
import WallPostForm from "../forms/WallPostForm";
import useWallPost from "../../hooks/useWallPost";
import Pin from "../../assets/icons/Pin";
import ChevronDown from "../../assets/icons/ChevronDown";
import { useAppContext } from "../../context/AppContext";
import LoadingSpinner from "../ui/LoadingSpinner";

export default function WallPost({}) {
  const { currentStable } = useAppContext();
  const { wallPost, loading, error, currentWallPost } = useWallPost(
    currentStable?.id
  );

  useEffect(() => {
    if (currentStable?.id) {
      currentWallPost();
    }
  }, [currentStable?.id, currentWallPost]);

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

  // Formatt data
  const formatData = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, "yyyy-MM-dd HH:mm");
    } catch (error) {
      console.log("Invalid date format:", dateString);
      return "Unknown date";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner size="medium" className="text-gray" />
        <span className="ml-2">Laddar...</span>
      </div>
    );
  }

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
                    Edited: ({formatData(wallPost.lastEdited)})
                  </p>
                ) : wallPost?.postDate ? (
                  <p className="font-light text-xs">
                    Posted: ({formatData(wallPost.postDate)})
                  </p>
                ) : null}

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
    </>
  );
}
