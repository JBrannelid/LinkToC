import React from "react";
import { Loader } from "lucide-react";
import PropTypes from "prop-types";

const LoadingSpinner = ({
  size = "medium",
  className = "",
  withMargin = true,
}) => {
  const iconSize = size === "small" ? 16 : size === "large" ? 24 : 20;
  const marginClass = withMargin ? "mr-5" : "";

  return (
    <span className={`animate-spin ${marginClass} ${className}`}>
      <Loader size={iconSize} />
    </span>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  className: PropTypes.string,
  withMargin: PropTypes.bool,
};

export default LoadingSpinner;
