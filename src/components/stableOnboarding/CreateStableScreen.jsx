import React from "react";
import { FormProvider } from "../forms";
import Button from "../ui/Button.jsx";
import SettingIcon from "../../assets/icons/SettingIcon.jsx";
import FormFields from "../forms/CreateStableFormFields.jsx";


const CreateStableScreen = ({
                                formMethods,
                                onSubmit,
                                onBack,
                                isLoading,
                                loadingState,
                                error,
                                message
                            }) => {
    // Handle form submission
    const handleSubmit = formMethods.handleSubmit((data) => {
        if (onSubmit) {
            onSubmit(data);
        }
    });

    return (
        <div className="flex flex-col items-center" role="region" aria-labelledby="create-stable-heading">
            {/* Header section */}
            <div className="self-start mb-2 sm:mb-4">
                <SettingIcon strokeWidth={9} className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            </div>

            <h1 id="create-stable-heading" className="text-2xl sm:text-3xl text-center my-4 sm:my-6 font-heading">
                Skapa nytt stall
            </h1>

            {/* Image section */}
            <div className="w-full my-2 sm:my-4 px-2 sm:px-4">
                <div className="relative">
                    <img
                        src="/src/assets/images/FirstLoginImage.jpg"
                        alt="Häst i hage"
                        className="w-full rounded-lg border border-primary"
                    />
                </div>
            </div>

            {/* Form section */}
            <div className="w-full mt-6 px-2 sm:px-4">
                <FormProvider
                    methods={formMethods}
                    onSubmit={handleSubmit}
                    className="w-full"
                >
                    <div className="mb-6">
                        {/* Form fields component */}
                        <FormFields />

                        {/* Error message */}
                        {error && (
                            <div
                                className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200"
                                role="alert"
                                aria-live="assertive"
                            >
                                {error}
                            </div>
                        )}

                        {/* Success/warning message */}
                        {message && message.text && (
                            <div
                                className={`mt-4 p-3 rounded-lg border ${
                                    message.type === "success"
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : message.type === "warning"
                                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                            : "bg-red-50 text-red-700 border-red-200"
                                }`}
                                role="alert"
                                aria-live="polite"
                            >
                                {message.text}
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3 mt-8">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                            disabled={isLoading}
                            className="w-full"
                            aria-busy={isLoading ? "true" : "false"}
                        >
                            {isLoading && loadingState ? loadingState.getMessage() : "Skapa stall"}
                        </Button>

                        <Button
                            type="secondary"
                            onClick={onBack}
                            disabled={isLoading}
                            className="w-full"
                        >
                            Gå tillbaka
                        </Button>
                    </div>
                </FormProvider>
            </div>
        </div>
    );
};

export default CreateStableScreen;