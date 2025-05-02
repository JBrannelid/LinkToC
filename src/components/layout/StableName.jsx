import React, { useEffect } from "react";
import { useStableData } from "../../hooks/useStableData.js";
import { useAppContext } from "../../context/AppContext.jsx";
import LoadingSpinner from "../ui/LoadingSpinner.jsx";
import { useLoadingState } from "../../hooks/useLoadingState";

export default function StableName({ currentStableId }) {
  const { currentStable } = useAppContext();
  const {
    status: { loading, error },
  } = useStableData();
  const loadingState = useLoadingState(loading, "fetch");

  if (loading)
    return (
      <div className="flex items-center py-2">
        <LoadingSpinner size="small" className="text-gray" />
        <span>{loadingState.getMessage()}</span>
      </div>
    );

  if (error) return <p className="py-2 text-error-500">Error: {error}</p>;

  return (
    <h1 className="cursor-pointer font-normal text-2xl font-heading">
      {currentStable.name || "Inget stall kopplat"}
    </h1>
  );
}
