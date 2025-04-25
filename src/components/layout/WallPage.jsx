import React, { useState } from "react";
import { Pin, ChevronDown } from "lucide-react";

export default function WallPage() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mt-5 px-2">
      <h2 className="text-2xl mb-2">Väggen</h2>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div
          className="p-4 flex items-center cursor-pointer"
          onClick={toggleExpand}
          aria-label="Expandible important message"
        >
          <div className="text-primary mr-3">
            <Pin className="w-6 h-6" />
          </div>
          <p className="flex-1">Trasigt stängsel västra hagen</p>
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
            <p className="font-light text-sm">
              Trasigt stängsel. Hästarna får inte stå i västra hagen!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
