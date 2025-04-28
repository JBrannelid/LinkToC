import React, {useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import FormProvider from "./formBuilder/FormProvider";
import FormInput from "./formBuilder/FormInput";
import authService from "../../api/services/authService";
import {NotFoundState} from "../ui/userPage/index.js";
import FormMessage from "./formBuilder/FormMessage.jsx";
import { Shield, ArrowLeft } from "lucide-react";
import {
    getErrorMessage,
    isResetCodeInvalid,
    shouldShowResetCodeNotFound,
    createSuccessMessage,
    createErrorMessage
} from "../../utils/errorUtils";
import {ROUTES} from "../../routes/index.jsx";

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
        if (setParentLoading) {
            setParentLoading(loading);
        }
    }, [loading, setParentLoading]);
    
    useEffect(() => {
      
    }, [codeVerified]);

    
    const {handleSubmit, getValues, formState: {errors}, trigger } = methods;

    const handleVerifyCode = async() => {
        const result = await trigger(["email", "resetCode"]);
        if(!result){
            return;
        }
        const email = getValues("email") || emailFromStorage;
        if (!email) {
            setMessage({
                type: "error",
                text: "E-postadress saknas. Vänligen ange din e-postadress."
            });
            return;
        }

        if (email !== getValues("email")) {
            setValue("email", email);
        }
        
        setLoading(true);
        setMessage({type: "", text: ""});
        try {
            const validateData = {
                email: email,
                resetCode: getValues("resetCode"),
            };

            const response = await authService.validateResetToken(validateData);

            if(response && response.isSuccess) {
                setCodeVerified(true);
                setMessage(createSuccessMessage("Kod verifierad. Du kan nu sätta ett nytt lösenord."));
                sessionStorage.setItem('resetPasswordEmail', email);
                
            } else {
                setMessage(createErrorMessage(
                    response?.message || "Ogiltig återställningskod. Kontrollera och försök igen."
                ));
            }
        } catch(error) {
            if (isResetCodeInvalid(error)) {
                setNotFound(true);
                return;
            }

            setMessage(getErrorMessage(error, {
                defaultMessage: "Kunde inte verifiera koden. Försök igen senare."
            }));
        } finally {
            setLoading(false);
        }
    };
    const onSubmit = async (data) => {
        if(!codeVerified){
            await handleVerifyCode();
            return;
        }
       
        if (data.password !== data.confirmPassword){
            setMessage(createErrorMessage("Lösenorden matchar inte. Försök igen."));
            return;
        }
        setLoading(true);
        setMessage({type: "", text: ""});

        const email = data.email || emailFromStorage || sessionStorage.getItem('resetPasswordEmail');
        
        try {
            const resetData = {
                email: email,
                newPassword: data.password,
                newPasswordConfirmation: data.confirmPassword
            };
            
            const response = await authService.resetPassword(resetData);
            if (response && response.isSuccess) {
                setMessage(createSuccessMessage(
                    "Ditt lösenord har återställts. Du kommer att omdirigeras till inloggningssidan."
                ));
                sessionStorage.removeItem('resetPasswordEmail');
                setTimeout(() => {navigate(ROUTES.LOGIN)}, 3000);
            } else {
                setMessage(createErrorMessage(
                    response?.message || "Något gick fel. Vänligen försök igen."
                ));
            }
        }catch(error) {
            setMessage(getErrorMessage(error, {
                defaultMessage: "Misslyckades att återställa lösenordet. Försök igen senare."
            }));
        } finally {
            setLoading(false);
        }
    };
    
    const handleBackToLogin = () => {
        navigate(ROUTES.LOGIN);
    };
    const handleRequestNewCode = () =>{
        navigate(ROUTES.FORGOT_PASSWORD);
    }
    if (shouldShowResetCodeNotFound(message, notFound)) {
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
