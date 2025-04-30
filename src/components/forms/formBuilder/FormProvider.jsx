import React from "react";
import { FormProvider as RHFFormProvider } from "react-hook-form";
import Button from "../../ui/Button";

//A wrapper component for React Hook Form with built-in layout and optional footer
const FormProvider = ({
  methods,
  onSubmit,
  children,
  className = "",
}) => {
  const { handleSubmit } = methods;

  return (
    <RHFFormProvider {...methods}>
      {/* Form element with submit handler and optional custom class */}
      <form onSubmit={handleSubmit(onSubmit)} className={className}>
        {/* Form content area */}
        <div className="px-4 py-6">{children}</div>
      </form>
    </RHFFormProvider>
  );
};

export default FormProvider;
