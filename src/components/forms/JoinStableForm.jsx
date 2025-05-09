import React, {useCallback} from 'react';
import {FormMessage, FormProvider} from "../forms/index.js";
import searchConfigs from "../search/config/searchConfig.js";
import {SearchActions, SearchBar, SearchProvider, SearchResults} from "../search/index.js";
import {useStableJoinRequest} from "../../hooks/useStableJoinRequest.js";


const JoinStableForm = ({
                            formMethods,
                            onSubmit,
                            onCancel,
                            isLoading: externalLoading = false,
                            loadingState: externalLoadingState = null,
                            error: externalError = null,
                            message: externalMessage = null
                        }) => {
    const {
        sendJoinRequest,
        loading: hookLoading,
        error: hookError,
        message: hookMessage,
        loadingState: hookLoadingState,
        isThrottled,
        throttleTimeRemaining
    } = useStableJoinRequest();
    const isLoading = hookLoading || externalLoading;
    const loadingState = hookLoading ? hookLoadingState : externalLoadingState;
    const error = hookError || externalError;
    const message = hookMessage || externalMessage;
    
    const stableConfig = {
        ...searchConfigs.stable,
        loading: isLoading,
        loadingState: loadingState
    };

    const handleJoinStable = useCallback(async (data) => {
        console.log("Sending join request for stable:", data);
        
        if(isThrottled) {
            console.log(`Request throttled. Please wait ${throttleTimeRemaining} seconds`);
            return;
        }
        const result = await sendJoinRequest(data);

        if (result.success && onSubmit) {
            console.log("Join request API call successful, updating app state...");
            
            setTimeout(() => {
                onSubmit(data);
            }, 1500);
        }else if (result.throttled) {
            console.log(`Request throttled. Please wait ${result.timeRemaining} seconds`);
        } else if (result.alreadyRequested) {
            console.log("Already requested to join this stable");
        }
    },[sendJoinRequest, onSubmit, isThrottled, throttleTimeRemaining]);
    
    const handleCancelSearch = () => {
        if (onCancel) {
            onCancel();
        }
    };

    const displayError = typeof error === 'string' ? { type: "error", text: error } : error;
    
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

export default React.memo(JoinStableForm);