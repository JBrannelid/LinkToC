import React, { useState } from "react";
import ResetPasswordForm from "../components/forms/ResetPasswordForm";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import AuthFormContainer from "../components/forms/formBuilder/AuthFormContainer";

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Responsive header with background image */}
      <div
        className="relative w-full"
        style={{ height: "clamp(200px, 30vh, 400px)" }}
      >
        <img
          src="/src/assets/images/LoginBackgroundImage.jpg"
          alt="Horse Background"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ maxHeight: "none" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <div className="bg-light/20 backdrop-blur-[2px] backdrop-brightness-120 px-4 py-1 rounded-sm shadow-sm">
            <h1 className="text-3xl text-black">EQUILOG</h1>
          </div>
        </div>
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
