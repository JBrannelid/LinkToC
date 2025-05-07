import React from "react";
import { FormProvider as RHFFormProvider } from "react-hook-form";

//A wrapper component for React Hook Form with built-in layout and optional footer
const FormProvider = ({
  methods,
  onSubmit,
  children,
  className = "",
    ariaLabel = "Form",
}) => {
  const { handleSubmit } = methods;

  return (
    <RHFFormProvider {...methods}>
      {/* Form element with submit handler and optional custom class */}
      <form onSubmit={handleSubmit(onSubmit)} className={className} role="form" aria-label={ariaLabel}>
        {/* Form content area */}
        <div className="px-4 py-6">{children}</div>
      </form>
    </RHFFormProvider>
  );
};

export default FormProvider;
