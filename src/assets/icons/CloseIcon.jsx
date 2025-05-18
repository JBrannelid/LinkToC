import React from "react";

const CloseIcon = ({
  className,
  color = "currentColor",
  size = 16,
  strokeWidth = 1,
}) => {
  // Maintain aspect ratio
  const svgSize = size;

  return (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Rotated 45 degrees to centered X */}
      <path
        d="M8 3.5V12.5M3.5 8H12.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="rotate(45, 8, 8)"
      />
    </svg>
  );
};

export default CloseIcon;
