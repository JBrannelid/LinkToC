import React from "react";
// Doors-entrance
const HorseBoxIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  strokeWidth = 1.5,
  ...props
}) => {
  // Create style object with explicit sizing
  const sizeStyle = {
    width: `${size}px`,
    height: `${size}px`,
    minWidth: `${size}px`, // Prevent shrinking
    minHeight: `${size}px`, // Prevent shrinking
  };

  return (
    <svg
      style={sizeStyle}
      viewBox="0 0 512 512"
      fill="none" // Set fill to none so paths control the fill
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M152.216,124.541c0,38.244-30.946,69.189-69.189,69.189C37.135,193.73,0,230.865,0,276.757v193.73h235.243V41.513 C189.351,41.513,152.216,78.649,152.216,124.541z M166.054,394.378H69.189v-41.514h96.865V394.378z M166.054,311.351H69.189 v-41.514h96.865V311.351z"
        strokeWidth={strokeWidth}
        fill={color}
      />
      <path
        d="M428.973,193.73c-38.244,0-69.189-30.946-69.189-69.189c0-45.892-37.135-83.027-83.027-83.027v428.973H512v-193.73 C512,230.865,474.865,193.73,428.973,193.73z M442.811,394.378h-96.865v-41.514h96.865V394.378z M442.811,311.351h-96.865v-41.514 h96.865V311.351z"
        strokeWidth={strokeWidth}
        fill={color}
      />
    </svg>
  );
};

export default HorseBoxIcon;
