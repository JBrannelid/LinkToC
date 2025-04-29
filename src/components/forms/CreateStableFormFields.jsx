import React from "react";
import { FormInput } from "../forms";


const FormFields = () => {
    return (
        <>
            {/* Stable Name Field */}
            <div className="mb-4">
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
            <div className="mb-4">
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
                    <div>
                        <FormInput
                            id="postCode"
                            name="postCode"
                            placeholder="Postnummer..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
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
            </div>

            {/* Stable Type Field */}
            <div className="mb-4">
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
        </>
    );
};

export default FormFields;