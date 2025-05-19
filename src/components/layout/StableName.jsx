import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext.jsx";

export default function StableName({ className = "" }) {
  const { currentStable, stableData } = useAppContext();
  const [displayName, setDisplayName] = useState(() => {
    const savedStable = localStorage.getItem("currentStable");
    if (savedStable) {
      try {
        const parsed = JSON.parse(savedStable);
        return parsed.name || "Loading...";
      } catch (error) {
        return "Loading...";
      }
    }
    return "No stable connected";
  });

  // Update once context data is available
  useEffect(() => {
    if (stableData?.name) {
      setDisplayName(stableData.name);
    } else if (currentStable?.name) {
      setDisplayName(currentStable.name);
    }
  }, [stableData?.name, currentStable?.name]);

  return (
    <span className={`text-2xl md:text-3xl font-heading ${className}`}>
      {displayName}
    </span>
  );
}
