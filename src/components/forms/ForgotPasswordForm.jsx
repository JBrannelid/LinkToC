import React, {useState} from "react";
import { useForm } from "react-hook-form";
import { X, Send } from "lucide-react"
import FormProvider from "./formBuilder/FormProvider";
import FormInput from "./formBuilder/FormInput";
import authService from "../../api/services/authService";
import { ErrorTypes } from "../../api/index.js";

const ForgotPasswordForm = ({onCancel, onSuccess}) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({type: "", text: "",});
    
    const methods = useForm({
        defaultValues: {
            email: '',
        },
    });
    
    const handleSubmit = async(data) => {
        setLoading(true);
        setMessage({type: "", text: "", });
        try {
            const response = await authService.forgotPassword(data.email);
            
            if (response && response.isSuccess){
                setMessage({type: "success",
                        text: 'Återställningslänk har skickats till din e-post. Kontrollera din inkorg (inklusive skräppostmappen)',
                     });
                if(onSuccess) onSuccess();
            } else {
                setMessage({type: "error", text: response.message || "Något gick fel. Vänligen försök igen.", });
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
        } finally {
            setLoading(false);
        }
    };
    
    return(<div className="flex justify-center">
        <div className="w-[500px] p-5 rounded-sm shadow-lg bg-white bg-opacity-70">
            <h1 className="text-xl lg:text-2xl font-bold flex items-center justify-between">
                Glömt lösenord?
                <button
                    onClick={onCancel}
                    className="p-2 text-gray-500 hover:text-gray-700"
                    aria-label="Stäng"
                >
                    <X className="h-6 w-6" />
                </button>
            </h1>
            <p className="text-sm lg:text-base mt-2">
                Oroa dig inte, det händer alla. Skriv din e-postadress nedan så skickar vi ett återställningsmail.
            </p>
            <p className="text-xs mt-2">
                <span>OBS: </span>Kontrollera din skräppostmapp
            </p>

            <FormProvider methods={methods} onSubmit={handleSubmit} footer={{ showFooter: false }}>
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

                {message.text && (
                    <div className={`mt-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
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
                        <Send className="h-6 w-6" />
                        {loading ? "Bearbetar..." : "Skicka"}
                    </button>
                </div>
            </FormProvider>
        </div>
    </div>
    );
};

export default ForgotPasswordForm;