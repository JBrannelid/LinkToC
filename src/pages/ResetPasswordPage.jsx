import React, { useState } from "react";
import ResetPasswordForm from "../components/forms/ResetPasswordForm";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import WelcomeLayout from "../components/layout/WelcomeLayout";

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);

  return (
    <WelcomeLayout>
      {/* Mobile layout */}
      <div className="flex flex-col min-h-screen lg:hidden">
        {/* Header */}
        <div className="relative w-full h-[200px] sm:h-[300px] md:h-[350px]">
          <img
            src="/src/assets/images/BgLoginMobile.jpg"
            alt="Horses grazing in a meadow"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 sm:pb-6">
            <div className="bg-light/20 backdrop-blur-[2px] backdrop-brightness-120 px-6 py-2 rounded-sm shadow-sm">
              <h1 className="text-3xl text-black">EQUILOG</h1>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 px-6 py-8 bg-background">
          <div className="w-full max-w-md mx-auto">
            {loading ? (
              <div className="flex items-center justify-center w-full">
                <LoadingSpinner size="medium" className="text-gray" />
                <p className="ml-2">Processing...</p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-medium text-center mb-3">
                  Reset Password
                </h2>
                <p className="text-center text-gray-600 mb-6">
                  Enter your new password below
                </p>
                <ResetPasswordForm setParentLoading={setLoading} />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Desktop layout */}
      <div className="hidden lg:block">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-medium text-center mb-8">
            Reset Password
          </h2>
          {loading ? (
            <div className="flex items-center justify-center w-full">
              <LoadingSpinner size="medium" className="text-gray" />
              <p className="ml-2">Processing...</p>
            </div>
          ) : (
            <div>
              <ResetPasswordForm setParentLoading={setLoading} />
            </div>
          )}
        </div>
      </div>
    </WelcomeLayout>
  );
};

export default ResetPasswordPage;
