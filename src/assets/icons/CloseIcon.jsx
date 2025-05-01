import React from "react";

const CloseIcon = ({ className, color = "currentColor" }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={color}
      stroke={color}
      strokeWidth="1"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M0 14.545L1.455 16 8 9.455 14.545 16 16 14.545 9.455 8 16 1.455 14.545 0 8 6.545 1.455 0 0 1.455 6.545 8z" />
    </svg>
  );
};

export default CloseIcon;
