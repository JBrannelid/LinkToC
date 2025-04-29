import React from "react";
import { FormProvider, FormInput, FormMessage } from "./index.js";
import Button from "../ui/Button.jsx";

const CreateStableForm = ({
                              formMethods,
                              onSubmit,
                              onCancel,
                              isLoading = false,
                              loadingState = null,
                              message = { type: "", text: "" }
                          }) => {

    // Handle form submission
    const handleSubmit = formMethods.handleSubmit((data) => {
        if (onSubmit) {
            onSubmit({
                name: data.stableName,
                streetAddress: data.streetAddress,
                postCode: data.postCode,
                county: data.county,
                typeOfStable: data.typeOfStable,
                stableBoxes: data.stableBoxes
            });
        }
    });

    return (
        <FormProvider
            methods={formMethods}
            onSubmit={handleSubmit}
            className="w-full"
        >
            <div className="mb-6 space-y-4">
                {/* Stable Name Field */}
                <div>
                    <label htmlFor="stableName" className="block text-sm mb-1 font-medium">
                        Välj stallets namn
                    </label>
                    <FormInput
                        id="stableName"
                        name="stableName"
                        placeholder="Stallets namn..."
                        validation={{
                            required: "Stallets namn är obligatoriskt"
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-required="true"
                    />
                </div>

                {/* Address Fields */}
                <div>
                    <label htmlFor="streetAddress" className="block text-sm mb-1 font-medium">
                        Stallets adress
                    </label>
                    <FormInput
                        id="streetAddress"
                        name="streetAddress"
                        placeholder="Gatuadress..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-2"
                    />

                    <div className="grid grid-cols-2 gap-2">
                        <FormInput
                            id="postCode"
                            name="postCode"
                            placeholder="Postnummer..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />

                        <FormInput
                            id="county"
                            name="county"
                            placeholder="Postadress..."
                            validation={{
                                required: "Postadress är obligatoriskt"
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            aria-required="true"
                        />
                    </div>
                </div>

                {/* Stable Type Field */}
                <div>
                    <label htmlFor="typeOfStable" className="block text-sm mb-1 font-medium">
                        Typ av stall
                    </label>
                    <FormInput
                        id="typeOfStable"
                        name="typeOfStable"
                        placeholder="ex. Ridskola"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* Stable Boxes Field */}
                <div>
                    <label htmlFor="stableBoxes" className="block text-sm mb-1 font-medium">
                        Antal boxar i stallet
                    </label>
                    <div className="flex">
                        <FormInput
                            id="stableBoxes"
                            name="stableBoxes"
                            placeholder="Antal..."
                            type="number"
                            className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <div className="w-24 ml-2">
                            <input
                                type="text"
                                value="Boxar"
                                disabled
                                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500"
                                aria-hidden="true"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Message display */}
            <FormMessage message={message} />

            {/* Action buttons */}
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
                    onClick={onCancel}
                    disabled={isLoading}
                    className="w-full"
                >
                    Gå tillbaka
                </Button>
            </div>
        </FormProvider>
    );
};

export default CreateStableForm;