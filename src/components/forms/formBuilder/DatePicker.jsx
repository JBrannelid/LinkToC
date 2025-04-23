import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { format } from "../../utils/calendarUtils";

// Date picker component that integrates with React Hook Form

// Props:
//  name - The form field name
//  label - Optional label text
//  validation - React Hook Form validation rules
//  className - Additional CSS classes for the input
//  errorMessage - Custom error message

const DatePicker = ({
  name,
  label,
  validation = {},
  className = "",
  errorMessage = "Ogiltigt datum",
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="w-full">
      {/* Optional label text */}
      {label && (
        <label className="block mb-1 font-medium text-gray-700">{label}</label>
      )}

      <Controller
        name={name}
        control={control}
        rules={validation}
        render={({ field }) => {
          // Format date value to YYYY-MM-DD for input field
          const formattedValue = format(new Date(field.value), "yyyy-MM-dd");

          return (
            <input
              type="date"
              value={formattedValue}
              onChange={(inputEvent) => {
                const parsedDate = new Date(inputEvent.target.value);
                field.onChange(parsedDate);
              }}
              // ${className} add extra Tailwind CSS if provided by the child-component
              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${className}`}
              aria-invalid={!!errors[name]}
            />
          );
        }}
      />

      {/* Error message display */}
      {errors[name] && (
        <p className="mt-1 text-sm text-red-500 ">
          {errors[name].message || errorMessage}
        </p>
      )}
    </div>
  );
};

export default DatePicker;
