import React from "react";
import { FormProvider as RHFFormProvider } from "react-hook-form";

//A wrapper component for React Hook Form with built-in layout and optional footer

// Props:
//  methods: React Hook Form methods object
//  onSubmit: Function to handle form submission
//  children: Form fields/components
//  className - Additional CSS classes for the input
//  footer: Configuration for the footer (submit button, visibility, custom classes)

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

        {/* Optional footer with submit button */}
        {footer.showFooter && (
          <div className={footer.footerClassName}>
            {/* Header and submit button */}
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-medium">Description</h3>
              <div className="flex ml-auto space-x-2">
                <button
                  type="submit"
                  className="bg-gray-200 hover:bg-gray-300 transition-colors text-black px-4 py-1 rounded-full flex items-center"
                >
                  {footer.submitText}
                </button>
              </div>
            </div>

            {/* Decorative divider */}
            <div className="border-t opacity-20 mb-10"></div>
          </div>
        )}
      </form>
    </RHFFormProvider>
  );
};

export default FormProvider;
