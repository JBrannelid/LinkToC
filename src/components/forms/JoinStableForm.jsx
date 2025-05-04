import React, { useState } from 'react';
import { FormProvider, FormInput, FormMessage } from "../forms/index.js";
import Button from "../ui/Button.jsx"
import { createErrorMessage } from "../../utils/errorUtils.js";

const JoinStableForm = ({
    formMethods,
    onSubmit,
    onCancel,
    isLoading = false,
    loadingState = null,
    error = null, 
                            message = null
}) => {
    const [searchResults, setSearchResults] = useState([]);
    const [selectedStable, setSelectedStable] = useState(null);
    const [formError, setFormError] = useState(null);

    const handleSearch = formMethods.handleSubmit(async (data) => {
        setFormError(null);

        if (onSubmit) {
            try {
                const result = await onSubmit(data.searchQuery);
                
                if (result && result.success && result.data) {
                    setSearchResults(result.data);
                    
                    if (result.data.length === 0) {
                        setFormError(createErrorMessage("Can't find a stable with that name. Try another name."));
                    }
                } else {

                    setSearchResults([]);
                }
            } catch (err) {

                setFormError(createErrorMessage("An error occured while searching. Try again later."));
            }
        }
    });
    const handleSelectStable = (stable) => {
        setSelectedStable(stable);
    };
    
    const handleJoinStable = () => {
        if(selectedStable && onSubmit) {
            onSubmit({
                stableId: selectedStable.id,
                stableName: selectedStable.name,
                action: 'join'
            });
        }
    };
    const inputClass = "w-full px-3 py-2 border border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
    const displayError = formError || (error ? { type: "error", text: error } : null);
    return (
        <FormProvider
            methods={formMethods}
            onSubmit={handleSearch}
            className="w-full"
        >
            <div className="mb-6 space-y-4">
                <div>
                    <label
                        htmlFor="searchQuery"
                        className="block text-sm mb-1 font-medium"
                    >
                        Search for existing stable:
                    </label>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <FormInput
                            id="searchQuery"
                            name="searchQuery"
                            placeholder="Search for stable name..."
                            validation={{
                                required: "Enter stable name...",
                            }}
                            className={inputClass}
                            disabled={isLoading}
                            aria-required="true"
                        />
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full sm:w-auto"
                            disabled={isLoading}
                            loading={isLoading && loadingState?.operationType === 'fetch'}
                        >
                            Search
                        </Button>
                    </div>
                </div>
            </div>

            {/* Error message display */}
            {displayError && (
                <FormMessage message={displayError} />
            )}

            {/* Custom message if provided */}
            {message && message.text && !displayError && (
                <FormMessage message={message} />
            )}

            {/* Search results */}
            {searchResults.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-medium mb-2 font-heading">Search Results</h2>
                    <ul
                        className="space-y-2"
                        role="listbox"
                        aria-label="Search results for stable"
                    >
                        {searchResults.map(stable => (
                            <li
                                key={stable.id}
                                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                    selectedStable?.id === stable.id
                                        ? 'border-primary bg-primary-light'
                                        : 'border-light hover:bg-light'
                                }`}
                                onClick={() => handleSelectStable(stable)}
                                role="option"
                                aria-selected={selectedStable?.id === stable.id}
                            >
                                <div className="font-medium">{stable.name}</div>
                                {stable.location && (
                                    <div className="text-sm text-gray">{stable.location}</div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Action buttons */}
            <div className="space-y-3 mt-8">
                {searchResults.length > 0 && (
                    <Button
                        type="primary"
                        htmlType="submit"
                        onClick={handleJoinStable}
                        disabled={isLoading || !selectedStable}
                        loading={isLoading && loadingState?.operationType === 'update'}
                        className="w-full"
                    >
                        {isLoading && loadingState?.operationType === 'update'
                            ? loadingState.getMessage()
                            : 'Join'}
                    </Button>
                )}

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

export default JoinStableForm;