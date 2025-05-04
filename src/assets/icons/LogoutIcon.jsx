import React from "react";

const LogoutIcon = ({
  size = 24,
  color = "currentColor",
  backgroundColor = "bg-error-500",
  iconColor = "text-white",
  className = "",
  strokeWidth = 1.5,
  ...props
}) => {
  const innerSize = Math.floor(size * 0.6);

  return (
    <div
      className={`${backgroundColor} ${iconColor} flex items-center justify-center rounded-full overflow-hidden ${className}`}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg
        width={innerSize}
        height={innerSize}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16 13v-2H7V8l-5 4 5 4v-3z" strokeWidth={strokeWidth} />
        <path
          d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z"
          strokeWidth={strokeWidth}
        />
      </svg>
    </div>
  );
};

export default LogoutIcon;
