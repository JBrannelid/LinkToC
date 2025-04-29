import React from "react";

const PlusIcon = ({
  className = "",
  fillColor = "none",
  strokeColor = "currentColor",
  strokeWidth = "2",
}) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={fillColor}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Plus</title>
      <path
        d="M4 12H20M12 4V20"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PlusIcon;