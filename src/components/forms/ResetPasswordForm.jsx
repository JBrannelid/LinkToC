import React, { useState }  from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import FormProvider from "./formBuilder/FormProvider";
import FormInput from "./formBuilder/FormInput";
import authService from "../../api/services/authService";
import { ErrorTypes } from "../../api/index.js"

const ResetPasswordForm = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({type: "", text: "",});
    const [codeVerified, setCodeVerified] = useState(false);
    const navigate = useNavigate();
    
    const methods = useForm({
        defaultValues: {
            email: "",
            resetCode: "",
            password: "",
            confirmPassword: "",
        },
    });
    
    const {handleSubmit, getValues, formState: {errors}, trigget } = methods;

    const handleVerifyCode = async() => {
        const result = await trigger(["email", "resetCode"]);
        if(!result) return;
        
        setLoading(true);
        setMessage({type: "", text: ""});
        try {
            const validateData ={
                email: getValues(result.email),
                resetCode: getValues(result.resetCode),
            };
            const response = await authService.validateResetToken(validateData);
            
            if(response && response.isSuccess) {
                setCodeVerified(true);
                setMessage({
                    type: "success",
                    text: "Kod verifierad. Du kan nu sätta ett nytt lösenord."
                });
            }
        }catch(error) {
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
            setLoading(false);
        }
    };
    const onSubmit = async (data) => {
        if(!codeVerified){
            await handleVerifyCode();
            return;
        }
        if (data.password !== data.confirmPassword){
            setMessage({
                type: "error",
                text: "Löseorden matchar inte. Försök igen."
            });
            return;
        }
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
    
    return(
        <div className="flex justify-center">
            <div className="w-[500px] p-5 rounded-sm shadow-lg bg-white bg-opacity-70">
                <h1 className="text-xl lg:text-2xl font-bold">
                    Återställ lösenord
                </h1>
                <p className="text-sm lg:text-base mt-2">
                    {!codeVerified
                        ? "Ange din e-postadress och återställningskoden du fick via e-post."
                        : "Ange ditt nya lösenord nedan."}
                </p>

                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} footer={{ showFooter: false }}>
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

                    {message.text && (
                        <div className={`mt-4 p-3 rounded-md ${
                            message.type === "success"
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                        }`}>
                            {message.text}
                        </div>
                    )}

                    <div className="mt-5">
                        <button
                            type="submit"
                            className="w-full bg-[#556B2F] hover:bg-[#4B5320] p-2 rounded-md text-white"
                            disabled={loading}
                            aria-busy={loading}
                        >
                            {loading ? "Bearbetar..." : codeVerified ? "Återställ lösenord" : "Verifiera kod"}
                        </button>
                    </div>

                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            onClick={handleBackToLogin}
                            className="text-[#556B2F] hover:underline"
                        >
                            Tillbaka till inloggning
                        </button>
                    </div>
                </FormProvider>
            </div>
        </div>
    );
};

export default ResetPasswordForm;
