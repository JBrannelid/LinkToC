import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useStableData } from "../../hooks/useStableData.js";
import { useAppContext } from "../../context/AppContext.jsx";
import { ROUTES } from "../../routes/routeConstants.js";
import LoadingSpinner from "../ui/LoadingSpinner.jsx";
import { useLoadingState } from "../../hooks/useLoadingState";

export default function StableName({ currentStableId }) {
  const { currentStable, changeStable } = useAppContext();
  const {
    status: { loading, error },
    getStableById,
  } = useStableData();
  const navigate = useNavigate();
  const loadingState = useLoadingState(loading, "fetch");

  useEffect(() => {
    // If context (global stablId) is empty. Get it from useAppContext
    if (
      currentStableId &&
      (!currentStable.name || currentStable.id !== currentStableId)
    ) {
      const stableData = getStableById(currentStableId);
      if (stableData && stableData.name) {
        changeStable(currentStableId, stableData.name);
      }
    }
  }, [currentStableId, currentStable, changeStable, getStableById]);

  const handleStableClick = () => {
    navigate(ROUTES.SELECT_STABLE);
  };

  if (loading)
    return (
      <div className="flex items-center py-2">
        <LoadingSpinner size="small" className="text-gray" />
        <span>{loadingState.getMessage()}</span>
      </div>
    );

  if (error) return <p className="py-2 text-error-500">Error: {error}</p>;

  return (
    <div onClick={handleStableClick}>
      <h1 className="cursor-pointer font-normal text-2xl font-heading">
        {currentStable.name || "Inget stall kopplat"}
      </h1>
    </div>
  );
}
