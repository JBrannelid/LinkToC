const ChevronDown = ({
  width = 24,
  height = 24,
  color = "currentColor",
  className = "",
  strokeWidth = 3,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 25 25"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      stroke={color}
      strokeWidth={strokeWidth}
      fill="none"
    >
      <title>Chevron Down</title>
      <g>
        <path
          d="M9.5 10.5L12.1997 13.1997V13.1997C12.3656 13.3656 12.6344 13.3656 12.8003 13.1997V13.1997L15.5 10.5"
          fill={color}
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </g>
    </svg>
  );
};

export default ChevronDown;
