import { motion } from "framer-motion";
import PropTypes from "prop-types";
import React from "react";
import LoadingIcon from "../../assets/icons/LoadingIcon";

const LoadingSpinner = ({
  size = "medium",
  className = "",
  withMargin = true,
}) => {
  const iconSize = size === "small" ? 16 : size === "large" ? 24 : 20;
  const marginClass = withMargin ? "mr-5" : "";

  return (
    <motion.span
      className={`${marginClass} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <LoadingIcon size={iconSize} color="currentColor" />
    </motion.span>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  className: PropTypes.string,
  withMargin: PropTypes.bool,
};

export default LoadingSpinner;
