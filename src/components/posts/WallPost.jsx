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
import WallPostCard from "./WallPostCard";
import { useStableData } from "../../hooks/useStableData";

export default function WallPost({}) {
  const { currentStable } = useAppContext();
  const { stableId } = useStableData(currentStable.id);
  const {
    wallPost,
    loading,
    error,
    currentWallPost,
    updateWallPost,
    replaceWallPost,
  } = useWallPost(currentStable?.id);

  const { createWallPost } = useWallPost(currentStable.id);

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

  // Create WallPost when 404: Not Found
  const [successMessage, setSuccessMessage] = useState("");

  const handleCreateWallPost = async () => {
    if (!stableId && !currentStable?.id) {
      console.error("Stable ID is missing");
      return;
    }

    console.log("Stable ID:", stableId || currentStable.id); // Debugging

    try {
      const success = await createWallPost({
        stableIdFk: stableId || currentStable.id,
      });
      if (success) {
        setSuccessMessage("Vänligen uppdatera sidan");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReplaceWallPost = async (formData) => {
    const success = await replaceWallPost(formData);
    if (success) {
      setIsFormOpen(false);
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

  //In case not found, create empty WallPost with Stable ID
  if (error?.status === 404 || wallPost == null) {
    return (
      <div className="px-2 md:px-0 w-full md:max-w-[58%]">
        <h2 className="text-xl md:text-2xl mb-2 md:mb-3 font-medium">Väggen</h2>

        {/* Show success message if set */}
        {successMessage && (
          <div className="bg-warning-300 p-4 rounded mb-4">
            {successMessage}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm md:shadow overflow-hidden border border-gray-100 md:border-gray-200">
          <div className="flex flex-row">
            <p className="flex-1 p-3">Ingen händelse hittades</p>

            <Button
              className="flex-none"
              type="primary"
              size="small"
              onClick={handleCreateWallPost}
            >
              Skapa
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 md:px-0 w-full md:max-w-[58%]">
      <h2 className="text-xl md:text-2xl mb-2 md:mb-3 font-medium">Väggen</h2>
      <WallPostCard
        title={
          wallPost?.title ? wallPost.title : "Hittade ingen händelse i stallet"
        }
        isExpanded={isExpanded}
        toggleExpand={toggleExpand}
        actions={
          <Button type="secondary" size="small" onClick={toggleForm}>
            {isFormOpen ? "Avbryt" : wallPost?.title ? "Redigera" : "Skapa"}
          </Button>
        }
        form={
          isFormOpen && (
            <WallPostForm
              event={wallPost}
              onSubmit={
                wallPost.title ? handleSubmitWallPost : handleReplaceWallPost
              }
              onCancel={toggleForm}
            />
          )
        }
      >
        {wallPost?.body ? (
          <>
            <p className="font-light text-sm">{wallPost.body}</p>
            {wallPost.lastEdited ? (
              <p className="font-light text-xs">
                Edited: ({formatData(wallPost.lastEdited)})
              </p>
            ) : wallPost.postDate ? (
              <p className="font-light text-xs">
                Posted: ({formatData(wallPost.postDate)})
              </p>
            ) : null}
          </>
        ) : (
          <p className="font-light text-sm">
            Inga detaljer om händelse i stallet
          </p>
        )}
      </WallPostCard>
    </div>
  );
}
