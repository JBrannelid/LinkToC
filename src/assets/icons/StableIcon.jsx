import React from "react";

const StableIcon = ({ className = "", size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-3" />
      <rect x="9" y="9" width="4" height="4" />
      <rect x="9" y="14" width="4" height="4" />
    </svg>
  );
};

export default StableIcon;
