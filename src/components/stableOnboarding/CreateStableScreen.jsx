import React from "react";
import CreateStableForm from "../forms/CreateStableForm";

const CreateStableScreen = ({
                                stableName,
                                onSubmit,
                                onBack,
                                isLoading,
                                loadingState,
                                error
                            }) => {
    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl sm:text-3xl text-center my-4 sm:my-6 font-heading">
                Skapa nytt stall
            </h1>

            <div className="w-full my-2 sm:my-4 px-2 sm:px-4">
                <div className="relative">
                    <img
                        src="/src/assets/images/FirstLoginImage.jpg"
                        alt="Häst i hage"
                        className="w-full rounded-lg border border-primary"
                    />
                </div>
            </div>

            <div className="w-full mt-6 px-2 sm:px-4">
                <CreateStableForm
                    initialStableName={stableName}
                    onSubmit={onSubmit}
                    onCancel={onBack}
                    isLoading={isLoading}
                    loadingState={loadingState}
                    error={error}
                />
            </div>
        </div>
    );
};

export default CreateStableScreen;