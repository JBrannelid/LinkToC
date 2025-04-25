import React, {useState} from 'react';
import {useNavigate} from "react-router"
import { ArrowLeft, RabbitIcon} from "lucide-react"
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm"
import AuthFormContainer from "../components/forms/formBuilder/AuthFormContainer.jsx";

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const handleGoBack = () => {
        navigate("/login");
    };
    
    const handleSuccess = () => {
        setSuccess(true);
        setTimeout(() => {
            navigate("/login");
        }, 5000);
    };
    
    return (
        <div className="flex flex-col min-h-screen">
            {/* Logo Section - Green background */}
            <div className="py-10 sm:py-16 flex justify-center items-center bg-[#556B2F]">
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
                    {success ? (
                        <AuthFormContainer
                            title="Epost skickad!">
                            <div className="bg-green-50 p-5 rounded-md">
                                <h2 className="text-xl font-bold text-green-700">E-post skickad!</h2>
                                <p className="mt-2">
                                    Instruktioner för att återställa ditt lösenord har skickats till din e-post. Kontrollera din inkorg (och skräppost) för att få vidare anvisningar.
                                </p>
                                <button
                                    onClick={handleGoBack}
                                    className="mt-4 flex items-center text-[#556B2F] hover:underline"
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
                            <ForgotPasswordForm onSuccess={handleSuccess} setParentLoading={setLoading} />   
                        </AuthFormContainer>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;