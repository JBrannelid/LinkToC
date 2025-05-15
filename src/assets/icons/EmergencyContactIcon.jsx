import React from "react";

const EmergencyContactIcon = ({
  size = 24,
  color = "currentColor",
  backgroundColor,
  iconColor,
  className = "",
  strokeWidth = 1.5,
  ...props
}) => {
  // Apply size to width and height
  const actualSize = size || 24;

  // Combine classes
  const svgClassName = `${className}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={svgClassName}
      width={actualSize}
      height={actualSize}
      viewBox="0 0 256 256"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path
        d="M232,104v48a16.01833,16.01833,0,0,1-16,16H168v48a16.01833,16.01833,0,0,1-16,16H104a16.01833,16.01833,0,0,1-16-16V168H40a16.01833,16.01833,0,0,1-16-16V104A16.01833,16.01833,0,0,1,40,88H88V40a16.01833,16.01833,0,0,1,16-16h48a16.01833,16.01833,0,0,1,16,16V88h48A16.01833,16.01833,0,0,1,232,104Z"
        fill="currentColor"
      ></path>
    </svg>
  );
};

export default EmergencyContactIcon;
