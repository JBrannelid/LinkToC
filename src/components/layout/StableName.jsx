import React from "react";
import { useAppContext } from "../../context/AppContext.jsx";

export default function StableName({ className = "" }) {
  const { currentStable, stableData } = useAppContext();

  return (
    <span className={`text-2xl md:text-3xl font-heading ${className}`}>
      {stableData?.name || currentStable?.name || "No stable connected"}
    </span>
  );
}
