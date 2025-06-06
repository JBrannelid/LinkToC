import { useState } from "react";
import { useFormContext } from "react-hook-form";
import EyeIcon from "../../../assets/icons/EyeIcon";
import EyeOffIcon from "../../../assets/icons/EyeOffIcon";
import MailIcon from "../../../assets/icons/MailIcon";

// A form input component that integrates with React Hook Form
const FormInput = ({
  name,
  id,
  label,
  type = "text",
  placeholder,
  validation = {},
  className = "",
  labelPosition = "inline",
  isPasswordMasked = false,
  autoComplete,
  inputClassName = "",
  rows = 3,
  showPasswordToggle = false,
  showEmailIcon = false,
  ...rest
}) => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordFocus = () => {
    if (isPasswordMasked && !isPasswordFocused) {
      setValue(name, "");
      setIsPasswordFocused(true);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Determine input type based on password visibility
  const inputType = type === "password" && showPassword ? "text" : type;
  const shouldShowToggle = type === "password" && showPasswordToggle;
  const shouldShowEmailIcon = type === "email" && showEmailIcon;

  // Use custom id if provided, otherwise use name
  const inputId = id || name;

  return (
    <div
      className={`form-control ${className} ${
        labelPosition === "above" ? "flex flex-col" : "flex items-center"
      }`}
    >
      {label && (
        <label
          htmlFor={inputId}
          className={`form-label ${
            labelPosition === "above" ? "mb-1" : "mr-2"
          } text-sm font-medium`}
        >
          {label}
        </label>
      )}
      <div className="relative w-full">
        {type === "textarea" ? (
          // Textarea rendering (unchanged)
          <textarea
            id={inputId}
            placeholder={placeholder}
            rows={rows}
            className={`form-input w-full px-3 py-2 border rounded-md 
              ${errors[name] ? "border-error-500" : "border-primary-light"} 
              focus:outline-none focus:ring-0 focus:ring-primary focus:border-primary
              transition-colors duration-200 ${inputClassName}`}
            {...register(name, validation)}
            {...rest}
          />
        ) : (
          // Regular input with eye icon positioning fix
          <div className="relative">
            <input
              id={inputId}
              type={inputType}
              placeholder={placeholder}
              className={`form-input w-full px-3 py-2 border rounded-md 
                ${errors[name] ? "border-error-500" : "border-primary-light"} 
                focus:outline-none focus:ring-0 focus:ring-primary focus:border-primary
                transition-colors duration-200 ${
                  shouldShowToggle || shouldShowEmailIcon ? "pr-10" : ""
                } ${inputClassName}`}
              {...register(name, validation)}
              onFocus={
                type === "password" && isPasswordMasked
                  ? handlePasswordFocus
                  : undefined
              }
              autoComplete={autoComplete}
              {...rest}
            />
            {/* Email icon */}
            {shouldShowEmailIcon && (
              <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500">
                <MailIcon size={20} />
              </div>
            )}
            {/* Eye/toggle icons */}
            {shouldShowToggle && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOffIcon size={20} />
                ) : (
                  <EyeIcon size={20} />
                )}
              </button>
            )}
          </div>
        )}

        {/* Error message positioned below without affecting input layout */}
        {errors[name] && (
          <p className="mt-1 text-sm text-error-600">{errors[name].message}</p>
        )}
      </div>
    </div>
  );
};
export default FormInput;
