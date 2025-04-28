import React, {useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import { Send, AlertCircle } from "lucide-react"
import FormProvider from "./formBuilder/FormProvider";
import FormInput from "./formBuilder/FormInput";
import authService from "../../api/services/authService";
import FormMessage from "./formBuilder/FormMessage";
import { ErrorTypes } from "../../api/index.js";
import {useNavigate} from "react-router";

const ForgotPasswordForm = ({ onSuccess, setParentLoading = null}) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({type: "", text: "",});
    const navigate = useNavigate();
    const methods = useForm({
        defaultValues: {
            email: '',
        },
    });
    
    useEffect(() => {
        if (setParentLoading) {
            setParentLoading(loading);
        }
    }, [loading, setParentLoading]);
    
    const handleSubmit = async(data) => {
        setLoading(true);
        setMessage({type: "", text: "", });
        try {
            const response = await authService.forgotPassword(data.email);

         
            if (response && (response.isSuccess || response.statusCode === 200 || response.statusCode === 201)) {
               
                if (response.message && response.message.includes("issue sending the email")) {
                    setMessage({
                        type: "warning",
                        text: 'Återställningsbegäran har skapats, men det uppstod ett problem med att skicka e-post. Om du inte får e-post inom några minuter, kontrollera din skräppostmapp eller kontakta support.',
                    });
                } else {
                    setMessage({
                        type: "success",
                        text: 'Återställningslänk har skickats till din e-post. Kontrollera din inkorg (inklusive skräppostmappen)',
                    });
                }
                sessionStorage.setItem('resetPasswordEmail', data.email);
                
                if(onSuccess) onSuccess();
            } else {
                setMessage({
                    type: "error",
                    text: response.message || "Något gick fel. Vänligen försök igen.",
                });
                setLoading(false);
            }
        }catch(error){
            let errorMessage = 'Misslyckades att bearbeta begäran. Försök igen senare';

            if (error.type === ErrorTypes.VALIDATION) {
                errorMessage = error.message || 'Vänligen verifiera din e-postadress.';
            } else if (error.type === ErrorTypes.NETWORK) {
                errorMessage = 'Nätverksfel. Kontrollera din anslutning.';
            } else if (error.type === ErrorTypes.SERVER) {
                errorMessage = 'Serverfel. Vänligen försök igen senare.';
            }

            setMessage({ type: 'error', text: errorMessage });
            console.error('Error:', error);
            setLoading(false);
            
        } 
    };
    
    return(
            <FormProvider methods={methods} onSubmit={handleSubmit} footer={{ showFooter: false }}>
                <p className="text-xs mt-2">
                    <span>OBS: </span>Kontrollera din skräppostmapp
                </p>
                
                <div className="mt-4">
                    <FormInput
                        name="email"
                        label="E-post"
                        type="email"
                        placeholder="exempel@email.com"
                        validation={{
                            required: "Vänligen ange en giltig e-postadress",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-.]+$/i,
                                message: "Vänligen använd ett giltigt e-postformat",
                            },
                        }}
                    />
                </div>

                {message.type === "warning" && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-amber-800">{message.text}</span>
                    </div>
                )}
                
                <FormMessage message={message}/>

                <div className="mt-5">
                    <button
                        type="submit"
                        className="w-full bg-[#556B2F] hover:bg-[#4B5320] p-2 rounded-md text-white flex items-center justify-center"
                        disabled={loading}
                        aria-busy={loading}
                        
                    >
                        <Send className="h-5 w-5 mr-2" />
                        <span>Skicka återställningslänk</span>
                    </button>
                </div>
            </FormProvider>
    );
};

export default ForgotPasswordForm;