import React from "react";
import { FormProvider as RHFFormProvider } from "react-hook-form";
import Button from "../../ui/Button";

//A wrapper component for React Hook Form with built-in layout and optional footer
const FormProvider = ({
  methods,
  onSubmit,
  children,
  className = "",
  footer = {
    submitText: "Submit",
    showFooter: true,
    footerClassName: "bg-gray-100 px-4 py-6",
  },
}) => {
  const { handleSubmit } = methods;

  return (
    <RHFFormProvider {...methods}>
      {/* Form element with submit handler and optional custom class */}
      <form onSubmit={handleSubmit(onSubmit)} className={className}>
        {/* Form content area */}
        <div className="px-4 py-6">{children}</div>

        {/* Optional footer with custom submit button */}
        {footer.showFooter && (
          <div className={footer.footerClassName}>
            {/* Header and submit button */}
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-medium">Description</h3>
              <div className="flex ml-auto space-x-2">
                <Button type="submit" className="">
                  {footer.submitText}
                </Button>
              </div>
            </div>
          </div>
        )}
      </form>
    </RHFFormProvider>
  );
};

export default FormProvider;
