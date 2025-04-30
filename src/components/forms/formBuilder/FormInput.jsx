import React from "react";
import { useFormContext } from "react-hook-form";

// A form input component that integrates with React Hook Form
const FormInput = ({
  name,
  label,
  type = "text",
  placeholder,
  validation = {},
  className = "",
  labelPosition = "inline",
  errorMessage = "Detta fält krävs",
  ...rest
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div
      className={`form-control ${className} ${
        labelPosition === "above" ? "flex flex-col" : "flex items-center"
      }`}
    >
      {label && (
        <label
          htmlFor={name}
          className={`form-label ${
            labelPosition === "above" ? "mb-1" : "mr-2"
          } text-sm font-medium`}
        >
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className={`form-input w-full px-3 py-2 border rounded-md 
          ${errors[name] ? "border-error-500" : "border-primary-light"} 
          focus:outline-none focus:ring-0 focus:ring-primary focus:border-primary
          transition-colors duration-200`}
        {...register(name, validation)}
        {...rest}
      />
      {errors[name] && (
        <p className="mt-1 text-sm text-error-600">{errors[name].message}</p>
      )}
    </div>
  );
};
export default FormInput;
