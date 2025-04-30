import React from "react";
import {FormInput, FormProvider} from "../forms";
import Button from "../ui/Button.jsx";
import SettingIcon from "../../assets/icons/SettingIcon.jsx";
import CreateStableForm from "../forms/CreateStableForm.jsx";


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
                <CreateStableForm
                    formMethods={formMethods}
                    onSubmit={onSubmit}
                    onCancel={onBack}
                    isLoading={isLoading}
                    loadingState={loadingState}
                    message={message ? { type: message.type, text: message.text } : null}
                />
            </div>
        </div>
    );
};

export default CreateStableScreen;