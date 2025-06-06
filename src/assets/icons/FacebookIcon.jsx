import React from "react";

const FacebookIcon = ({
  className = "",
  fillColor = "currentColor",
  strokeColor = "currentColor",
  strokeWidth = "1",
}) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Facebook</title>
      <path
        d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default FacebookIcon;
