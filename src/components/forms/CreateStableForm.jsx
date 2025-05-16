import React, {useEffect, useState} from "react";
import { FormProvider, FormInput, FormMessage } from "./index.js";
import Button from "../ui/Button.jsx";
import { createErrorMessage } from "../../utils/errorUtils.js";
import ModalHeader from "../../components/layout/ModalHeader.jsx";
import { useStableLocation} from "../../hooks/useStableLocation.js";
import LoadingSpinner from "../ui/LoadingSpinner.jsx";

const CreateStableForm = ({
  formMethods,
  onSubmit,
  onCancel,
  isLoading = false,
  loadingState = null,
  error = null,
  message = null,
  desktopView = false,
  inputClassName = "",
  hideLabel = false,
}) => {
  const [formError, setFormError] = useState(null);
  const { locationData, isLoading: isLoadingLocation, message: locationMessage, fetchLocationData } = useStableLocation();
  
  const handleSubmit = formMethods.handleSubmit((data) => {
    setFormError(null);

    if (onSubmit) {
      try {
        onSubmit(data);
      } catch (err) {
        setFormError(
          createErrorMessage(
            "An error occurred when creating stable! Try again later."
          )
        );
      }
    }
  });
  const handlePostcodeBlur = (e) => {
    const postcode = e.target.value;
    if (postcode && postcode.trim() !== "") {
      fetchLocationData(postcode);
    }
  };

  useEffect(() => {
    if (locationData) {
      formMethods.setValue("county", locationData.countyName, { shouldValidate: true });
      formMethods.clearErrors("county");
    }
  }, [locationData, formMethods]);
  const inputClass = `bg-white w-1/3 px-2 py-3 border-2 w-full rounded-md !border-primary focus:outline-none focus:ring-primary focus:ring-1 focus:border-primary ${inputClassName}`;

  const displayError =
    formError ||  (locationMessage?.type === 'error' ? locationMessage : null) ||
      (error ? { type: "error", text: error } : null);
  return (
    <div>
      {!desktopView && (
        <div className="bg-background">
          <ModalHeader title="Create a new stable" />
        </div>
      )}

      <FormProvider
        methods={formMethods}
        onSubmit={handleSubmit}
        className="w-full"
        showFooter={{ showFooter: false }}
      >
        <div className="mb-6 space-y-4">
          {/* Stable Name Field */}
          <div>
            {!hideLabel && (
              <label
                htmlFor="stableName"
                className="block text-sm mb-1 font-medium"
              >
                Choose Stable Name
              </label>
            )}
            <FormInput
              id="stableName"
              name="stableName"
              placeholder="Stable Name..."
              validation={{
                required: "Stable name is mandatory",
              }}
              inputClassName={inputClass}
              disabled={isLoading}
              aria-required="true"
            />
          </div>

          {/* Address Fields */}
          <div className="space-y-3">
            {!hideLabel && (
              <label
                htmlFor="streetAddress"
                className="block text-sm mb-1 font-medium"
              >
                Stable Address
              </label>
            )}
            <FormInput
              id="streetAddress"
              name="streetAddress"
              placeholder="Address..."
              inputClassName={inputClass}
            />

            <div className="grid grid-cols-2 gap-2">

              <div className="relative">
                <FormInput
                    id="postCode"
                    name="postCode"
                    placeholder="Postcode..."
                    inputClassName={inputClass}
                    onBlur={handlePostcodeBlur}
                    aria-describedby="postcode-info"
                />
                {isLoadingLocation && (
                    <div className="absolute right-3 top-3">
                      <LoadingSpinner size="small" withMargin={false} />
                    </div>
                )}
              </div>
              <div className="relative">
                <FormInput
                    id="county"
                    name="county"
                    placeholder="County..."
                    validation={{
                      required: "County is mandatory",
                    }}
                    inputClassName={inputClass}
                    disabled={isLoading}
                    aria-required="true"
                    aria-autocomplete="list"
                    aria-describedby="county-info"
                />
                {isLoadingLocation && (
                    <div className="absolute right-3 top-3">
                      <LoadingSpinner size="small" withMargin={false} />
                    </div>
                )}
              </div>
            </div>
            {locationMessage?.type === 'error' && (
                <div
                    id="postcode-info"
                    className="text-sm text-red-500"
                    aria-live="polite"
                >
                  {locationMessage.text}
                </div>
            )}
            
          </div>

          {/* Stable Type Field */}
          <div>
            {!hideLabel && (
              <label
                htmlFor="typeOfStable"
                className="block text-sm mb-1 font-medium"
              >
                Type of stable
              </label>
            )}
            <FormInput
              id="typeOfStable"
              name="typeOfStable"
              placeholder="ex. Private stable"
              inputClassName={inputClass}
            />
          </div>

          {/* Stable Boxes Field */}
          <div>
            {!hideLabel && (
              <label
                htmlFor="stableBoxes"
                className="block text-sm mb-1 font-medium"
              >
                Number of boxes in the stable
              </label>
            )}
            <div className="flex w-4/10">
              <FormInput
                id="stableBoxes"
                name="stableBoxes"
                placeholder="Boxes..."
                type="number"
                min="0"
                inputClassName={inputClass}
                disabled={isLoading}
                aria-label="Number of boxes"
              />
            </div>
          </div>
        </div>

        {displayError && <FormMessage message={displayError} />}
        
        {!displayError && locationMessage?.type === 'success' && !message && (
            <FormMessage message={locationMessage} />
        )}
        {message && message.text && !displayError && (
          <FormMessage message={message} />
        )}

        {/* Action buttons */}
        <div className="space-y-3 mt-8 flex flex-col items-center">
          <Button
            type="primary"
            htmlType="submit"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            className="w-9/10"
            aria-busy={isLoading ? "true" : "false"}
          >
            {isLoading && loadingState
              ? loadingState.getMessage()
              : "Create Stable"}
          </Button>

          {!desktopView && onCancel && (
            <Button
              type="secondary"
              onClick={onCancel}
              disabled={isLoading}
              className="w-9/10"
            >
              Return
            </Button>
          )}
        </div>
      </FormProvider>
    </div>
  );
};

export default CreateStableForm;
