import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useStableData } from "../../hooks/useStableData.js";
import { useAppContext } from "../../context/AppContext.jsx";
import { ROUTES } from "../../routes/routeConstants.js";

export default function StableName({ currentStableId }) {
  const { currentStable, changeStable } = useAppContext();
  const {
    status: { loading, error },
    getStableById,
  } = useStableData();
  const navigate = useNavigate();

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div
      onClick={handleStableClick}
      className="cursor-pointer hover:text-gray-900 transition-colors"
    >
      <p>{currentStable.name || "Inget stall kopplat"}</p>
    </div>
  );
}
