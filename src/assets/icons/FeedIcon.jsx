import React from "react";

const FeedIcon = ({ className, color = "currentColor" }) => {
  return (
    <svg
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4 12h16M4 16h16M4 20h16M4 8h16M4 4h16"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#080341"
      />
    </svg>
  );
};

export default FeedIcon;
