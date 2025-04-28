import React, {useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import FormProvider from "./formBuilder/FormProvider";
import FormInput from "./formBuilder/FormInput";
import authService from "../../api/services/authService";
import { ErrorTypes } from "../../api/index.js"
import {NotFoundState} from "../ui/userPage/index.js";
import FormMessage from "./formBuilder/FormMessage.jsx";
import { Shield, ArrowLeft } from "lucide-react";

const ResetPasswordForm = ({setParentLoading = null}) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({type: "", text: "",});
    const [codeVerified, setCodeVerified] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [emailFromStorage, setEmailFromStorage] = useState('');
    const navigate = useNavigate();
    
    const methods = useForm({
        defaultValues: {
            email: "",
            resetCode: "",
            password: "",
            confirmPassword: "",
        },
    });
    useEffect(() => {
        const storedEmail = sessionStorage.getItem('resetPasswordEmail');
        if (storedEmail) {
            setEmailFromStorage(storedEmail);
            methods.setValue('email', storedEmail);
        }
    }, []);
    
    useEffect(() => {
        console.log("Loading state changed:", loading);
        if (setParentLoading) {
            console.log("Updating parent loading state to:", loading);
            setParentLoading(loading);
        }
    }, [loading, setParentLoading]);
    
    useEffect(() => {
        console.log("codeVerified state changed to:", codeVerified);
    }, [codeVerified]);

    
    const {handleSubmit, getValues, formState: {errors}, trigger } = methods;

    const handleVerifyCode = async() => {
        console.log("Starting code verification...");
        const result = await trigger(["email", "resetCode"]);
        if(!result){
            console.log("Form validation failed");
            return;
        } 
        
        setLoading(true);
        setMessage({type: "", text: ""});
        try {
            const validateData ={
                email: getValues("email"),
                resetCode: getValues("resetCode"),
            };
            console.log("Sending validation request with data:", validateData);
            const response = await authService.validateResetToken(validateData);
            console.log("Validation response:", response);
            
            if(response && response.isSuccess) {
                console.log("Code verification successful");
                setCodeVerified(true);
                setMessage({
                    type: "success",
                    text: "Kod verifierad. Du kan nu sätta ett nytt lösenord."
                });
            }else {
                console.log("Code verification failed:", response?.message);
                setMessage({
                    type: "error",
                    text: response?.message || "Ogiltig återställningskod. Kontrollera och försök igen."
                });
            }
        }catch(error) {
            console.log("Error during code verification:", error);
            if (error.message && (
                error.message.includes("does not exist") ||
                error.message.includes("expired") ||
                error.message.includes("invalid")
            )) {
                // Set notFound to true to show the alternative UI
                setNotFound(true);
                return; // Exit early since we're showing a different UI
            }
            
            let errorMessage = "Kunde inte verifiera koden. Försök igen senare.";

            if (error.type === ErrorTypes.VALIDATION) {
                errorMessage = error.message || "Ogiltig e-post eller kod.";
            } else if (error.type === ErrorTypes.NETWORK) {
                errorMessage = "Nätverksfel. Kontrollera din anslutning.";
            } else if (error.type === ErrorTypes.SERVER) {
                errorMessage = "Serverfel. Vänligen försök igen senare.";
            }

            setMessage({ type: "error", text: errorMessage });
            console.error("Code validation error:", error);
        }finally {
            console.log("Completing code verification, setting loading to false");
            setLoading(false);
        }
    };
    const onSubmit = async (data) => {
        console.log("Form submitted, codeVerified state:", codeVerified);
        if(!codeVerified){
            console.log("Code not verified, calling handleVerifyCode");
            await handleVerifyCode();
            return;
        }
        console.log("Code verified, proceeding with password reset");
        if (data.password !== data.confirmPassword){
            console.log("Passwords don't match");
            setMessage({
                type: "error",
                text: "Löseorden matchar inte. Försök igen."
            });
            return;
        }
        console.log("Setting loading to true for password reset");
        setLoading(true);
        setMessage({type: "", text: ""});
        try {
            const resetData = {
                email: data.email,
                newPassword: data.password,
                newPasswordConfirmation: data.confirmPassword
            };
            
            const response = await authService.resetPassword(resetData);
            
            if (response && response.isSuccess) {
                setMessage({
                    type: "success",
                    text: "Ditt lösenord har återställts. Du kommer att omdirigeras till inloggningssidan."
                });
                
                setTimeout(() => {navigate("/login")}, 3000);
            }else {
                setMessage({
                    type: "error",
                    text: response?.message || "Något gick fel. Vänligen försök igen."
                });
            }
        }catch(error) {
            let errorMessage = "Misslyckades att återställa lösenordet. Försök igen senare.";

            if (error.type === ErrorTypes.VALIDATION) {
                errorMessage = error.message || "Lösenordet uppfyller inte kraven.";
            } else if (error.type === ErrorTypes.NETWORK) {
                errorMessage = "Nätverksfel. Kontrollera din anslutning.";
            } else if (error.type === ErrorTypes.SERVER) {
                errorMessage = "Serverfel. Vänligen försök igen senare.";
            }

            setMessage({ type: "error", text: errorMessage });
            console.error("Password reset error:", error);  
        } finally {
            setLoading(false);
        }
    };
    
    const handleBackToLogin = () => {
        navigate("/login");
    };
    const handleRequestNewCode = () =>{
        navigate("/forgotPassword");
    }
    if (notFound) {
        return (
            <div className="w-full">
                <NotFoundState text="Ogiltig eller utgången återställningskod" />
                <div className="mt-6 flex flex-col gap-3">
                    <button
                        onClick={handleRequestNewCode}
                        className="w-full py-2 bg-[#556B2F] hover:bg-[#4B5320] text-white rounded-md"
                    >
                        Begär en ny återställningskod
                    </button>
                    <button
                        onClick={handleBackToLogin}
                        className="flex items-center justify-center mx-auto mt-2 text-[#556B2F] hover:underline"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Tillbaka till inloggning
                    </button>
                </div>
            </div>
        );
    }
    return( <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} footer={{ showFooter: false }}>
            {!codeVerified && (
                <>
                    <div className="mt-4">
                        <FormInput
                            name="email"
                            label="E-post"
                            type="email"
                            placeholder="Din e-postadress"
                            validation={{
                                required: "E-postadress krävs",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-.]+$/i,
                                    message: "Vänligen ange en giltig e-postadress",
                                },
                            }}
                        />
                    </div>

                    <div className="mt-4">
                        <FormInput
                            name="resetCode"
                            label="Återställningskod"
                            placeholder="Ange koden från e-postmeddelandet"
                            validation={{
                                required: "Återställningskod krävs",
                            }}
                        />
                    </div>
                </>
            )}

            {codeVerified && (
                <>
                    <div className="mt-4">
                        <FormInput
                            name="password"
                            label="Nytt lösenord"
                            type="password"
                            placeholder="Ange nytt lösenord"
                            validation={{
                                required: "Lösenord krävs",
                                minLength: {
                                    value: 8,
                                    message: "Lösenordet måste vara minst 8 tecken",
                                },
                            }}
                        />
                    </div>

                    <div className="mt-4">
                        <FormInput
                            name="confirmPassword"
                            label="Bekräfta lösenord"
                            type="password"
                            placeholder="Bekräfta ditt nya lösenord"
                            validation={{
                                required: "Vänligen bekräfta ditt lösenord",
                            }}
                        />
                    </div>
                </>
            )}

            <FormMessage message={message}/>

            <div className="mt-5">
                <button
                    type="submit"
                    className="w-full bg-[#556B2F] hover:bg-[#4B5320] p-2 rounded-md text-white flex items-center justify-center"
                    disabled={loading}
                    aria-busy={loading}
                >
                    <Shield className="h-5 w-5 mr-2" />
                    <span>{codeVerified ? "Återställ lösenord" : "Verifiera kod"}</span>
                </button>
            </div>

            <div className="mt-4 text-center">
                <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="flex items-center justify-center mx-auto text-[#556B2F] hover:underline"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    <span>Tillbaka till inloggning</span>
                </button>
            </div>
        </FormProvider>
    );
};

export default ResetPasswordForm;
