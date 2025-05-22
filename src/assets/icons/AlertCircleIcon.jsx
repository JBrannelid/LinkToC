import React from "react";

const AlertCircleIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  strokeWidth = 1.5,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-8h2v6h-2V9z"
        fill={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default AlertCircleIcon;
