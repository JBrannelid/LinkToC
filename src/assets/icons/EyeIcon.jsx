import React from "react";

const EyeIcon = ({
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
        d="M12 4.5C7.2 4.5 3.1 7.6 1 12c2.1 4.4 6.2 7.5 11 7.5s8.9-3.1 11-7.5c-2.1-4.4-6.2-7.5-11-7.5zm0 12.5c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z"
        fill={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default EyeIcon;
