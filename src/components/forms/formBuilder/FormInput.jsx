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
      {label && <label className=" text-gray text-sm">{label}</label>}

      <input
        type={type}
        placeholder={placeholder}
        className={` focus:outline-none${className}`}
        aria-invalid={!!errors[name]}
        {...register(name, validation)}
        {...rest}
      />

      {/* Error message display */}
      {errors[name] && (
        <p className="mt-1 text-sm text-error-500">
          {errors[name].message || errorMessage}
        </p>
      )}
    </div>
  );
};

export default FormInput;
