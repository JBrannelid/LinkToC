import React, { useState } from "react";
import { useNavigate } from "react-router";
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";
import { ROUTES } from "../routes/index.jsx";
import WelcomeLayout from "../components/layout/WelcomeLayout";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoBack = () => {
    navigate(ROUTES.LOGIN);
  };

  const handleSuccess = () => {
    setLoading(false);
    setSuccess(true);
  };

  return (
    <WelcomeLayout>
      {/* Mobile layout */}
      <div className="flex flex-col lg:hidden">
        {/* Form Section */}
        <div className="flex-1 bg-transparent flex justify-center">
          <div className="w-full max-w-md">
            {success ? (
              <div className="text-center">
                <h2 className="text-xl font-medium mb-3">Email Sent!</h2>
                <div className="bg-green-50 p-5 rounded-md">
                  <p className="mb-4 ">
                    Instructions to reset your password have been sent to your
                    email. Check your inbox (and spam folder) for further
                    instructions.
                  </p>
                  <button
                    onClick={handleGoBack}
                    className="text-primary hover:underline"
                  >
                    Back to login
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-10 ">
                <h2 className=" pl-4 text-center">
                  Enter your email address to receive a password reset link
                </h2>
                <ForgotPasswordForm
                  onSuccess={handleSuccess}
                  setParentLoading={setLoading}
                  handleGoBack={handleGoBack}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Section */}
      <section className="hidden lg:flex lg:justify-center lg:items-center w-full">
        <div className="w-full max-w-md px-4 text-center">
          <h2 className="text-2xl mb-2">Forgot password?</h2>
          <p className="text-gray mb-6">
            Enter your email, we'll send you reset instructions.
          </p>

          {loading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="medium" className="text-gray" />
              <p className="ml-2">Processing...</p>
            </div>
          ) : success ? (
            <div className="bg-green-50 p-5 rounded-md">
              <p className="mb-4">
                Instructions to reset your password have been sent to your
                email. Check your inbox (and spam folder) for further
                instructions.
              </p>
              <button
                onClick={handleGoBack}
                className="text-primary hover:underline"
              >
                Back to login
              </button>
            </div>
          ) : (
            <ForgotPasswordForm
              onSuccess={handleSuccess}
              setParentLoading={setLoading}
              handleGoBack={handleGoBack}
            />
          )}
        </div>
      </section>
    </WelcomeLayout>
  );
};

export default ForgotPasswordPage;
