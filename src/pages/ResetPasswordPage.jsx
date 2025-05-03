import React, { useState } from "react";
import { RabbitIcon } from "lucide-react";
import ResetPasswordForm from "../components/forms/ResetPasswordForm";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import AuthFormContainer from "../components/forms/formBuilder/AuthFormContainer";

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Logo Section - Green background */}
      <div className="py-10 sm:py-16 flex justify-center items-center bg-primary">
        <RabbitIcon className="h-16 w-16 sm:h-20 sm:w-20 text-white">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path fill="rgba(200, 200, 200, 0.8)" />
          </svg>
        </RabbitIcon>
      </div>

      {/* Form Section - White background */}
      <div className="flex-1 px-4 py-6 sm:py-8 bg-white flex justify-center">
        <div className="w-full max-w-md">
          {loading ? (
            <div className="flex items-center justify-center w-full">
              <LoadingSpinner size="medium" className="text-gray" />
              <p className="ml-2">Bearbetar...</p>
            </div>
          ) : (
            <AuthFormContainer
              title="Återställ lösenord"
              subtitle="Ange ditt nya lösenord nedan"
            >
              <ResetPasswordForm setParentLoading={setLoading} />
            </AuthFormContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
