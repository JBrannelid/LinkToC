import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";

const TimePicker = ({
  name,
  label,
  validation = {},
  className = "",
  placeholder = "HH:MM",
  ...props
}) => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const [isFirefox, setIsFirefox] = useState(false);
  const fieldValue = watch(name);
  const fieldError = errors[name];

  // Detect Firefox browser
  useEffect(() => {
    setIsFirefox(navigator.userAgent.toLowerCase().indexOf("firefox") > -1);
  }, []);

  // Format time for better display
  const formatTimeForDisplay = (time) => {
    if (!time) return "";

    // Ensure proper HH:MM format
    if (time.length === 5 && time.includes(":")) {
      return time;
    }
  };

  // Validate time format
  const validateTimeFormat = (value) => {
    if (!value) return true;

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(value)) {
      return "Please enter a valid time format (HH:MM, 24-hour format)";
    }

    return true;
  };

  // Handle input change
  const handleTimeChange = (e) => {
    const value = e.target.value;
    setValue(name, value, { shouldValidate: true });
  };

  // Enhanced validation combining format and custom validation
  const combinedValidation = {
    ...validation,
    validate: {
      format: validateTimeFormat,
      ...(typeof validation.validate === "function"
        ? { custom: validation.validate }
        : validation.validate || {}),
    },
  };

  // Build CSS classes
  const inputClasses = [
    "time-picker-input",
    isFirefox ? "time-input-firefox" : "",
    fieldError ? "error" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col min-w-28">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray mb-1"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={name}
          type="time"
          {...register(name, combinedValidation)}
          onChange={handleTimeChange}
          value={formatTimeForDisplay(fieldValue)}
          placeholder={placeholder}
          className={inputClasses}
          {...props}
        />
      </div>

      {fieldError && (
        <p className="time-picker-error" role="alert">
          {fieldError.message}
        </p>
      )}

      {/* Fallback for browsers that don't support time input */}
      <noscript>
        <input
          type="text"
          pattern="[0-9]{2}:[0-9]{2}"
          placeholder="HH:MM (24-hour format)"
          className="time-picker-input"
        />
      </noscript>
    </div>
  );
};

export default TimePicker;
