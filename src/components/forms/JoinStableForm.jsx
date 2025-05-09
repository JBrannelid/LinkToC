import React from 'react';
import {FormMessage, FormProvider} from "../forms/index.js";
import searchConfigs from "../search/config/searchConfig.js";
import {SearchActions, SearchBar, SearchProvider, SearchResults} from "../search/index.js";
import {useStableJoinRequest} from "../../hooks/useStableJoinRequest.js";


const JoinStableForm = ({
                            formMethods,
                            onSubmit,
                            onCancel
                            // isLoading = false,
                            // loadingState = null,
                            // error = null,
                            // message = null
                        }) => {
    const {
        sendJoinRequest,
        loading: joinLoading,
        error: joinError,
        message: joinMessage,
        loadingState: joinLoadingState
    } = useStableJoinRequest();
    const isLoading = joinLoading;
    const loadingState = joinLoadingState;
    const error = joinError;
    const message = joinMessage;
    
    const stableConfig = {
        ...searchConfigs.stable,
        loading: isLoading,
        loadingState: loadingState
    };
    
    const handleJoinStable = async (data) => {
        const result = await sendJoinRequest(data);
        if(result.success && onSubmit) {
            onSubmit(result.data);
        }
    };
    
    const handleCancelSearch = () => {
        if (onCancel) {
            onCancel();
        }
    };

    const displayError = error ? { type: "error", text: error } : null;
    
    const ariaAttributes = {
        'aria-busy' : isLoading ? 'true' : 'false'
    };
    
    if (isLoading && loadingState) {
        ariaAttributes['aria-live'] = 'polite';
    }

    return (
        <FormProvider
            methods={formMethods}
            className="w-full"
        >
            <div {...ariaAttributes}>
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
                                disabled={isLoading}
                            />
                        </div>
                        
                        {isLoading && loadingState && (
                            <div className="sr-only" aria-live="polite">
                                {loadingState.getMessage() || 'Loading...'}
                            </div>
                        )}
                        
                        {/* Search results */}
                        <SearchResults
                            className="mt-4"
                            maxHeight="40vh"
                            showWhenEmpty={false}
                            onItemSelect={handleJoinStable}
                        />

                        {/* Error message display */}
                        {displayError && (
                            <FormMessage message={displayError} />
                        )}

                        {/* Success message display */}
                        {message && message.text && !displayError && (
                            <FormMessage message={message} />
                        )}

                        {/* Action button */}
                        <div className="mt-6">
                            <SearchActions
                                onCancel={handleCancelSearch}
                                actionButtonClassName="mb-2"
                                loading={isLoading}
                                loadingState={loadingState}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </SearchProvider>
            </div>
        </FormProvider>
    );
};

export default JoinStableForm;