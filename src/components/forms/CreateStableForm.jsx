import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {FormProvider, FormInput, FormMessage } from "./index.js"
import Button from "../ui/Button.jsx"

const createStableForm = ({
    initialStableName = "",
    onSubmit,
    onCancel,
    isLoading = false,
    loadingState,
    error}) => {
    const [message, setMessage] = useState({type: "", text: ""});
    
    const methods = useForm({
        defaultValues: {
            stableName: initialStableName
        }
    });
    
    useEffect(() => {
        methods.setValue("stableName", initialStableName);
    }, [initialStableName, methods]);
    
    useEffect(()=>{
        if (error) {
            setMessage({type: "error", text: error.message});
        } else {
            setMessage({type: "", text: ""});
        }
    }, [error]);
    
    const handleSubmit = (data) => {
        if (onSubmit) {
            onSubmit(data.stableName);
        }
    };
    
    return (
        <FormProvider
            methods={methods}
            onSubmit={handleSubmit}
            footer={{ showFooter: false }}
            className="w-full"
        >
            <div className="mb-4">
                <label htmlFor="stableName" className="block text-lg mb-2">
                    Välj stallets namn:
                </label>
                <FormInput
                    name="stableName"
                    placeholder="Stallets namn..."
                    validation={{
                        required: "Stallets namn får inte vara tomt",
                    }}
                    className="w-full px-3 py-4 border rounded-md"
                />
            </div>

            <FormMessage message={message} />

            <div className="space-y-3 mt-6">
                <Button
                    type="submit"
                    className="w-full bg-primary"
                    loading={isLoading}
                    disabled={isLoading}
                    onClick={(e) => {
                        e.preventDefault();
                        methods.handleSubmit(handleSubmit)();
                    }}
                >
                    {isLoading && loadingState ? loadingState.getMessage() : "Fortsätt"}
                </Button>

                <Button
                    type="secondary"
                    className="w-full"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Gå tillbaka
                </Button>
            </div>
        </FormProvider>
    );
};

export default createStableForm;


