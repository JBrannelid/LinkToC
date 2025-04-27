import React from "react";
import PropTypes from "prop-types";
import LoadingSpinner from "./LoadingSpinner";

const Button = ({
  type = "primary",
  disabled = false,
  loading = false,
  size = "medium",
  className = "",
  onClick,
  htmlType = "button",
  children,
  variant = "default",
  ...rest
}) => {
  // Base styles for all buttons
  const baseStyles =
    "flex items-center justify-center transition-colors focus:outline-none focus:ring-1 focus:ring-offset-2";

  // Global style from index.css
  const typeStyles = {
    primary:
      "bg-primary text-white border border-white hover:border hover:border-gray focus:ring-primary",
    secondary:
      "bg-white border border-primary hover:bg-gray-300 focus:ring-gray-300",
    danger: "bg-error-500 text-white hover:bg-error-600 focus:ring-error-400",
    warning:
      "bg-warning-300 text-gray-800 hover:bg-warning-400 focus:ring-warning-300",
    icon: "border border-gray text-gray hover:bg-primary focus:ring-gray-300",
  };

  // Size
  const sizeStyles = {
    small: "py-1 px-3 text-sm",
    medium: "py-2 px-4 text-base",
    large: "py-3 px-6 text-lg",
  };

  // Variant styles
  const variantStyles = {
    default: "rounded-md",
    icon: "rounded-full p-2",
  };

  // Size overrides for icon variant
  const iconSizeStyles = {
    small: "p-1 w-8 h-8",
    medium: "p-2 w-10 h-10",
    large: "p-3 w-12 h-12",
  };

  // Font weight
  const fontWeight = "font-medium";

  // Disabled styles override hover effects
  const disabledStyles =
    disabled || loading ? "opacity-50 cursor-not-allowed" : "";

  // Determine if we should use icon sizing
  const useIconSizing = variant === "icon";
  const sizeClasses = useIconSizing
    ? iconSizeStyles[size] || iconSizeStyles.medium
    : sizeStyles[size] || sizeStyles.medium;

  // Combine all styles
  const buttonStyles = `
    ${baseStyles}
    ${typeStyles[variant === "icon" ? "icon" : type] || typeStyles.primary}
    ${sizeClasses}
    ${variantStyles[variant] || variantStyles.default}
    ${fontWeight}
    ${disabledStyles}
    ${className}
  `;

  // Handle click with loading check
  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      type={htmlType}
      className={buttonStyles}
      disabled={disabled || loading}
      onClick={handleClick}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading && (
        <LoadingSpinner size={size} withMargin={variant !== "icon"} />
      )}
      {children}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(["primary", "secondary", "danger", "warning"]),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  className: PropTypes.string,
  onClick: PropTypes.func,
  htmlType: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf(["default", "icon"]),
  children: PropTypes.node.isRequired,
};

export default Button;
