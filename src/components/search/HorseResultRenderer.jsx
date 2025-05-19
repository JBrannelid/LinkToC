import React from "react";
import Card from "../ui/card/index.js";
import Button from "../ui/Button.jsx";

const HorseResultRenderer = ({ item, isSelected, onSelect, config }) => {
  const name = item[config?.labelField || "name"] || "Unnamed horse";
  const breed = item[config?.secondaryField || "breed"];
  const imageUrl = item[config?.imageField || "profileImage"];
  const birthYear = item.birthYear || "";
  const owner = item.owner || "";

  const handleClick = () => {
    onSelect(item);
  };

  const placeholderImage = "/src/assets/images/horsePlaceholder.jpg";
  return (
    // Card wrapper with mobile-first considerations
    <div
      className="cursor-pointer transition-all duration-200 w-full"
      onClick={handleClick}
      role="option"
      aria-selected={isSelected}
    >
      <Card.Container className="h-full w-full">
        {/* Content layout that works on all screen sizes */}
        <div className="flex flex-col p-3">
          <div className="flex items-center">
            {/* Horse image */}
            <div className="w-14 h-14 rounded-full overflow-hidden mr-3 flex-shrink-0 border border-light">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={`Horse named ${name}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <img
                  src={placeholderImage}
                  alt="Horse placeholder"
                  className="w-full h-full object-cover opacity-60"
                  loading="lazy"
                />
              )}
            </div>
            {/* Information with proper spacing for mobile */}
            <div className="ml-3 flex-grow min-w-0">
              {/* Name with text truncation */}
              <div className="font-bold truncate">{name}</div>

              {/* Other details */}
              {birthYear && <div className="text-sm">{birthYear} year</div>}
              {breed && <div className="text-sm turncate">{breed}</div>}
              {owner && (
                <div className="text-xs text-gray-600 truncate">{owner}</div>
              )}
            </div>
          </div>

          {/* Optional explicit button for accessibility */}
          <div className="mt-3 sm:mt-2 hidden">
            <Button
              type={isSelected ? "secondary" : "primary"}
              size="small"
              onClick={(e) => {
                e.stopPropagation(); // Prevent double-triggering
                handleClick();
              }}
              className="w-full"
            >
              {isSelected ? "Selected" : "Select"}
            </Button>
          </div>
        </div>
      </Card.Container>
    </div>
  );
};
export default HorseResultRenderer;
