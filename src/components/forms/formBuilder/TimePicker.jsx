import React from "react";
import { useFormContext, Controller } from "react-hook-form";

// TimePicker component integrated with React Hook Form
// Props:
//   name - Field name in the form
//   label - Label text displayed next to the input
//   date - Date or identifier shown before the label
//   validation - React Hook Form validation rules
//   className - Additional CSS classes for the input

const TimePicker = ({ name, label, date, validation = {}, className = "" }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext(); // Access form context provided by RHFFormProvider

  return (
    <div className="flex items-center bg-red-50 rounded-lg px-4 py-2">
      <div className="flex-1">
        {/* Display the date and label */}
        <span className="font-semibold mr-2">{date}&nbsp;&nbsp;&nbsp;</span>
        <span className="w-24 text-gray-600 font-semibold">
          {label}:&nbsp;&nbsp;
        </span>

        {/* Controlled time input field using RHF's Controller */}
        <Controller
          name={name}
          control={control}
          rules={validation}
          render={({ field }) => (
            <input
              type="time"
              value={field.value}
              onChange={field.onChange}
              className={`bg-transparent border-none p-0 inline-block w-20 focus:outline-none font-semibold ${className}`}
            />
          )}
        />
      </div>

      {/* Show error message if validation fails */}
      {errors[name] && (
        <span className="text-red-500 text-xs ml-2">
          {errors[name].message || "Invalid time"}
        </span>
      )}
    </div>
  );
};

export default TimePicker;
