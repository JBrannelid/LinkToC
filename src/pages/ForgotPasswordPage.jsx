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
      <div className="flex flex-col min-h-screen lg:hidden">
        {/* Header - fixed img size */}
        <div className="relative w-full h-[200px] sm:h-[300px] md:h-[350px]">
          <img
            src="/src/assets/images/BgLoginMobile.jpg"
            alt="Horses grazing in a meadow"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 sm:pb-6">
            <div className="bg-light/20 backdrop-blur-[2px] backdrop-brightness-120 px-6 py-2 rounded-sm shadow-sm">
              <h1 className="text-3xl text-black">EQUILOG</h1>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 px-6 py-6 sm:py-8 bg-background flex justify-center">
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
                <h2 className=" pl-4 mb-10 text-center">
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
