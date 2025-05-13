import React from "react";
import { useStableData } from "../../hooks/useStableData.js";
import { useAppContext } from "../../context/AppContext.jsx";
import LoadingSpinner from "../ui/LoadingSpinner.jsx";
import { useLoadingState } from "../../hooks/useLoadingState";

export default function StableName({ currentStableId, className = "" }) {
  const { currentStable } = useAppContext();
  const {
    currentStableData,
    status: { loading, error },
  } = useStableData(currentStable?.id);

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
    <span
      className={`text-lg md:text-xl xl:text-2xl font-heading ${className}`}
    >
      {currentStableData?.name || currentStable?.name || "No stable connected"}
    </span>
  );
}
