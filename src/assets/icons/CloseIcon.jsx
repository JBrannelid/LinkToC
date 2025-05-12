import React from "react";

const CloseIcon = ({
  className,
  color = "currentColor",
  size = 24,
  strokeWidth = 1,
}) => {
  // Maintain aspect ratio
  const viewBoxSize = 24;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16" // 16x16 viewBox match the path data
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
