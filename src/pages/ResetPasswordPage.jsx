import React, { useState } from "react";
import ResetPasswordForm from "../components/forms/ResetPasswordForm";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import WelcomeLayout from "../components/layout/WelcomeLayout";

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);

  return (
    <WelcomeLayout>
      {/* Mobile layout */}
      <div className="flex flex-col lg:hidden">
        {/* Form Section */}
        <div className="flex-1 bg-transparent overflow-y-auto">
          <div className="w-full max-w-md mx-auto">
            {loading ? (
              <div className="flex items-center justify-center w-full">
                <LoadingSpinner size="medium" className="text-gray" />
                <p className="ml-2">Processing...</p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-medium text-center mb-2 mt-3">
                  Reset Password
                </h2>
                <p className="text-center text-gray-600 mb-1">
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
