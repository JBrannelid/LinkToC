import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { parseISO } from "../../utils/calendarUtils";
import WallPostForm from "../forms/WallPostForm";
import useWallPost from "../../hooks/useWallPost";
import PinIcon from "../../assets/icons/PinIcon";
import ChevronDownIcon from "../../assets/icons/ChevronDownIcon";
import { useAppContext } from "../../context/AppContext";
import LoadingSpinner from "../ui/LoadingSpinner";
import Button from "../ui/Button";

export default function WallPost({}) {
  const { currentStable } = useAppContext();
  const { wallPost, loading, error, currentWallPost, updateWallPost } =
    useWallPost(currentStable?.id);

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

  const handleSubmitWallPost = async (updatedData) => {
    try {
      const success = await updateWallPost(updatedData);
      if (success) {
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error("Error updating wall post:", error);
    }
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

  //Error for everything except NotFound 404
  if (error && error.status !== 404) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <>
      {/* Ternary operator of wallPost on condition: Null or not Null? */}
      {wallPost !== null ? (
        // if true
        <div className="mt-5 px-2">
          <h2 className="text-2xl mb-2">Väggen</h2>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div
              className="p-4 flex items-center cursor-pointer"
              onClick={toggleExpand}
              aria-label="Expandable important message"
            >
              <div className="text-primary mr-3">
                <PinIcon className="w-6 h-6" />
              </div>
              <p className="flex-1">{wallPost.title}</p>
              <div className="text-primary">
                <ChevronDownIcon
                  className={`w-5 h-5 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
            {isExpanded && (
              <div className="px-4 pb-4">
                <p className="font-light text-sm">{wallPost.body}</p>
                {wallPost?.lastEdited ? (
                  <p className="font-light text-xs">
                    Edited: ({formatData(wallPost.lastEdited)})
                  </p>
                ) : wallPost?.postDate ? (
                  <p className="font-light text-xs">
                    Posted: ({formatData(wallPost.postDate)})
                  </p>
                ) : null}

                <div className="mt-3">
                  <Button type="secondary" size="small" onClick={toggleForm}>
                    {isFormOpen ? "Avbryt" : "Redigera"}
                  </Button>
                  <div className="mt-5">
                    {isFormOpen && (
                      <WallPostForm
                        event={wallPost}
                        onSubmit={handleSubmitWallPost}
                        onCancel={toggleForm}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        //if false wallPost == null
        <div className="mt-5 px-2">
          <h2 className="text-2xl mb-2">Väggen</h2>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div
              className="p-4 flex items-center cursor-pointer"
              onClick={toggleExpand}
              aria-label="Expandable important message"
            >
              <div className="text-primary mr-3">
                <PinIcon className="w-6 h-6" />
              </div>
              <p className="flex-1">Händelse i stallet</p>
              <div className="text-primary">
                <ChevronDownIcon
                  className={`w-5 h-5 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
            {isExpanded && (
              <div className="px-4 pb-4">
                <p className="font-light text-sm">
                  Detaljer om händelse i stallet
                </p>

                <div className="mt-3">
                  <Button type="secondary" size="small" onClick={toggleForm}>
                    {isFormOpen ? "Avbryt" : "Redigera"}
                  </Button>
                  <div className="mt-5">
                    {isFormOpen && (
                      <WallPostForm
                        event={wallPost}
                        onSubmit={handleSubmitWallPost}
                        onCancel={toggleForm}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
