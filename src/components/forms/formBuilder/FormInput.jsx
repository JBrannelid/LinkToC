import React from "react";
import { useFormContext } from "react-hook-form";

// A form input component that integrates with React Hook Form

// Props:
//  name - The form field name
//  label - Optional label text
//  validation - React Hook Form validation rules
//  className - Additional CSS classes for the input
//  errorMessage - Custom error message
//  type - Input type (default: "text")
//  placeholder - Placeholder text for the input

const FormInput = ({
  name,
  label,
  type = "text",
  placeholder,
  validation = {},
  className = "",
  errorMessage = "Detta fält krävs",
  ...rest
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="w-full">
      {/* Optional label text */}
      {label && (
        <label className="block mb-1 font-medium text-gray-700">{label}</label>
      )}

      <input
        type={type}
        placeholder={placeholder}
        className={`w-full border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 ${className}`}
        aria-invalid={!!errors[name]}
        {...register(name, validation)}
        {...rest}
      />

      {/* Error message display */}
      {errors[name] && (
        <p className="mt-1 text-sm text-red-500">
          {errors[name].message || errorMessage}
        </p>
      )}
    </div>
  );
};

export default FormInput;
