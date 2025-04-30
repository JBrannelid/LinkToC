import React, {useState} from "react";
import { FormProvider, FormInput, FormMessage } from "./index.js";
import Button from "../ui/Button.jsx";
import { createErrorMessage } from "../../utils/errorUtils.js";

const CreateStableForm = ({
                              formMethods,
                              onSubmit,
                              onCancel,
                              isLoading = false,
                              loadingState = null,
    error = null,
                              message = null
                          }) => {
    
    const [formError, setFormError] = useState(null);
    const handleSubmit = formMethods.handleSubmit((data) => {
        setFormError(null);

        if (onSubmit) {
            try {
                onSubmit(data);
            } catch (err) {
                setFormError(createErrorMessage("An error occurred when creating stable! Try again later."));
            }
        }
    });
    const inputClass = "w-full px-3 py-2 border border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

    const displayError = formError || (error ? { type: "error", text: error } : null);
    return (
        <FormProvider
            methods={formMethods}
            onSubmit={handleSubmit}
            className="w-full"
            showFooter={{showFooter:false}}
        >
            <div className="mb-6 space-y-4">
                {/* Stable Name Field */}
                <div>
                    <label htmlFor="stableName" className="block text-sm mb-1 font-medium">
                        Choose Stable Name
                    </label>
                    <FormInput
                        id="stableName"
                        name="stableName"
                        placeholder="Stable Name..."
                        validation={{
                            required: "Stable name is mandatory"
                        }}
                        className={inputClass}
                        disabled={isLoading}
                        aria-required="true"
                    />
                </div>

                {/* Address Fields */}
                <div>
                    <label htmlFor="streetAddress" className="block text-sm mb-1 font-medium">
                        Stable Address
                    </label>
                    <FormInput
                        id="streetAddress"
                        name="streetAddress"
                        placeholder="Address..."
                        className={inputClass}
                    />

                    <div className="grid grid-cols-2 gap-2">
                        <FormInput
                            id="county"
                            name="county"
                            placeholder="County..."
                            validation={{
                                required: "County is mandatory"
                            }}
                            className={inputClass}
                            disabled={isLoading}
                            aria-required="true"
                        />

                        <FormInput
                            id="postCode"
                            name="postCode"
                            placeholder="Postcode..."
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Stable Type Field */}
                <div>
                    <label htmlFor="typeOfStable" className="block text-sm mb-1 font-medium">
                        Type of stable
                    </label>
                    <FormInput
                        id="typeOfStable"
                        name="typeOfStable"
                        placeholder="ex. Riding School"
                        className={inputClass}                    />
                </div>

                {/* Stable Boxes Field */}
                <div>
                    <label htmlFor="stableBoxes" className="block text-sm mb-1 font-medium">
                        Number of boxes in the stable
                    </label>
                    <div className="flex">
                        <FormInput
                            id="stableBoxes"
                            name="stableBoxes"
                            placeholder="Number..."
                            type="number"
                            min="0"
                            className={inputClass}
                            disabled={isLoading}
                            aria-label="Number of boxes"
                        />
                    </div>
                </div>
            </div>
            
            {displayError && (
                <FormMessage message={displayError} />
            )}

            {message && message.text && !displayError && (
                <FormMessage message={message} />
            )}


            {/* Action buttons */}
            <div className="space-y-3 mt-8">
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={handleSubmit}
                    loading={isLoading}
                    disabled={isLoading}
                    className="w-full"
                    aria-busy={isLoading ? "true" : "false"}
                >
                    {isLoading && loadingState ? loadingState.getMessage() : "Create Stable"}
                </Button>

                <Button
                    type="secondary"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="w-full"
                >
                    Return
                </Button>
            </div>
        </FormProvider>
    );
};

export default CreateStableForm;