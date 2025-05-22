import React from "react";

const EyeOffIcon = ({
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
        d="M9.9 4.24A9.12 9.12 0 0 1 12 4c5 0 9 3 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22m-5.72-5.72A9 9 0 0 1 12 20c-5 0-9-3-11-8a18.5 18.5 0 0 1 5.06-5.72Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

export default EyeOffIcon;
