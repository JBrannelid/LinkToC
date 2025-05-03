import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";
import AuthFormContainer from "../components/forms/formBuilder/AuthFormContainer.jsx";
import { ROUTES } from "../routes/index.jsx";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoBack = () => {
    navigate(ROUTES.LOGIN);
  };

  const handleSuccess = () => {
    // Set success state but don't navigate automatically
    setSuccess(true);
  };

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
          {success ? (
            <AuthFormContainer title="Epost skickad!">
              <div className="bg-green-50 p-5 rounded-md">
                <h2 className="text-xl font-bold text-primary">
                  E-post skickad!
                </h2>
                <p className="mt-5">
                  Instruktioner för att återställa ditt lösenord har skickats
                  till din e-post. Kontrollera din inkorg (och skräppost) för
                  att få vidare anvisningar.
                </p>
                <button
                  onClick={handleGoBack}
                  className="mt-5 flex items-center text-primary hover:underline"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Tillbaka till inloggning
                </button>
              </div>
            </AuthFormContainer>
          ) : (
            <AuthFormContainer
              title="Glömt lösenord?"
              subtitle="Oroa dig inte, det händer alla. Skriv din e-postadress nedan så skickar vi ett återställningsmail."
              onCancel={handleGoBack}
            >
              <ForgotPasswordForm
                onSuccess={handleSuccess}
                setParentLoading={setLoading}
              />
            </AuthFormContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
