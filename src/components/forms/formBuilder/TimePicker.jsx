import React from "react";
import { useFormContext, Controller } from "react-hook-form";

// TimePicker component integrated with React Hook Form
const TimePicker = ({ name, label, date, validation = {}, className = "" }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext(); // Access form context provided by RHFFormProvider

  return (
    <div className="flex">
      <div className="flex-1">
        {/* Display the date and label(Tid) */}
        <span>{date}</span>
        <span>{label}&nbsp;&nbsp;</span>

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
              className={`w-20 focus:outline-none ${className}`}
            />
          )}
        />
      </div>

      {/* Show error message if validation fails */}
      {errors[name] && (
        <span className="text-error-500 text-xs ml-2">
          {errors[name].message || "Invalid time format"}
        </span>
      )}
    </div>
  );
};

export default TimePicker;
