import React, {useState} from 'react';
import {FormInput, FormMessage, FormProvider} from "../forms/index.js";
import Button from "../ui/Button.jsx"
import {createErrorMessage} from "../../utils/errorUtils.js";
import searchConfigs from "../search/config/searchConfig.js";
import {SearchActions, SearchBar, SearchProvider, SearchResults} from "../search/index.js";


const JoinStableForm = ({
                            formMethods,
                            onSubmit,
                            onCancel,
                            isLoading = false,
                            loadingState = null,
                            error = null,
                            message = null
                        }) => {
    
    const stableConfig = searchConfigs.stable;
    
    const handleSelectAction = (selectedItem) => {
        if(onSubmit && selectedItem){
            onSubmit({
                stableId: selectedItem.id,
                stableName: selectedItem,
                action: 'join'
            });
        }
    };
    const handleCancelSearch = () => {
        if (onCancel) {
            onCancel();
        }
    };

    const displayError = error ? { type: "error", text: error } : null;

    return (
        <FormProvider
            methods={formMethods}
            className="w-full"
        >
            <div aria-live="polite">
                {/* The SearchProvider encapsulates all search functionality */}
                <SearchProvider customConfig={stableConfig}>
                    <div className="space-y-4">
                        {/* Search input */}
                        <div>
                            <label htmlFor="stable-search" className="block text-sm font-medium mb-1">
                                Search for stable
                            </label>
                            <SearchBar
                                className="w-full"
                                inputClassName="w-full"
                                ariaLabel="Search for stable name"
                                autoFocus
                            />
                        </div>

                        {/* Search results */}
                        <SearchResults
                            className="mt-4"
                            maxHeight="40vh"
                            showWhenEmpty={false}
                        />

                        {/* Error message display */}
                        {displayError && (
                            <FormMessage message={displayError} />
                        )}

                        {/* Custom message if provided */}
                        {message && message.text && !displayError && (
                            <FormMessage message={message} />
                        )}

                        {/* Action buttons */}
                        <div className="mt-6">
                            <SearchActions
                                onAction={handleSelectAction}
                                onCancel={handleCancelSearch}
                                actionButtonClassName="mb-2"
                            />
                        </div>
                    </div>
                </SearchProvider>
            </div>
        </FormProvider>
    );
};

export default JoinStableForm;