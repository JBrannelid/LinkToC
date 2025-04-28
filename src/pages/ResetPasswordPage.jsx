import React, {useEffect, useState} from "react";
import { useNavigate} from "react-router";
import { RabbitIcon } from "lucide-react";
import ResetPasswordForm from "../components/forms/ResetPasswordForm";
import {LoadingState} from "../components/ui/userPage/index.js";
import AuthFormContainer from "../components/forms/formBuilder/AuthFormContainer.jsx";


const ResetPasswordPage = () => {
    const [loading, setLoading] = useState(false);    
    const navigate = useNavigate();
 
    useEffect(() => {
        console.log("Parent component loading state:", loading);
    }, [loading]);
    
    const handleGoBack = () => {
        navigate("/login");
    }
    
    return(
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
                    {loading ? (
                        <div className="flex items-center justify-center w-full">
                            <LoadingState text={"Bearbetar..."} />  
                        </div>
                        
                    ): null}
                    
                        <AuthFormContainer
                            title="Återställ lösenord"
                            subtitle="Ange din e-postadress och återställningskoden du fick via e-post."
                            >
                            <ResetPasswordForm setParentLoading={setLoading} />
                        </AuthFormContainer>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;