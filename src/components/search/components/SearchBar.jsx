import React, {useEffect, useRef} from 'react';
import {useSearch} from "../../../context/searchContext"
import LoadingSpinner from "../../ui/LoadingSpinner";

const SearchBar = ({
                       className = '',
                       inputClassName = '',
                       ariaLabel,
                       onFocus,
                       onBlur,
                       autoFocus = false,
                       maintainFocus = true
                   }) => {
    const {
        query,
        handleInputChange,
        loading,
        loadingState,
        config,
        results,
        handleSelectItem,
        selectedItem,
        executeActionForSelectedItem,
    } = useSearch();

    const inputRef = useRef(null);
    const wasLoadingRef = useRef(loading);
    const placeholder = config?.placeholderText || 'Search...';
    useEffect(() => {
        if (wasLoadingRef.current && !loading && maintainFocus) {

            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();

                    const length = inputRef.current.value.length;
                    inputRef.current.setSelectionRange(length, length);
                }
            }, 10);
        }


        wasLoadingRef.current = loading;
    }, [loading, maintainFocus]);
    useEffect(() => {
        if (maintainFocus && inputRef.current && document.activeElement !== inputRef.current) {
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();


                    const length = inputRef.current.value.length;
                    inputRef.current.setSelectionRange(length, length);
                }
            }, 10);
        }
    }, [results, maintainFocus]);
    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);


    const handleFocus = (e) => {
        if (onFocus) {
            onFocus(e);
        }
    };


    const handleBlur = (e) => {

        const relatedTarget = e.relatedTarget;

        if (maintainFocus && !relatedTarget?.closest('[role="listbox"]')) {

            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 10);
        }

        if (onBlur) {
            onBlur(e);
        }
    };
    const handleKeyDown = (e) => {

        if (e.key === 'Enter') {
            e.preventDefault();

            if (selectedItem) {

                executeActionForSelectedItem();
            } else if (results && results.length > 0) {

                handleSelectItem(results[0]);

                setTimeout(() => {
                    executeActionForSelectedItem();
                }, 10);
            }
            return;
        }

        if (e.key === 'ArrowDown' && results && results.length > 0) {
            e.preventDefault();

            const firstResultItem = document.querySelector('[role="option"]');
            if (firstResultItem) {
                firstResultItem.focus();
            }
        }
    };
    return (
        <div className={`relative ${className}`}>
            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder={placeholder}
                className={`w-full px-3 py-2 border border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${inputClassName} ${loading ? 'pr-10' : ''}`}
                aria-label={ariaLabel || placeholder}
                aria-autocomplete="list"
                autoComplete="off"
                onFocus={handleFocus}
                onBlur={handleBlur}
                autoFocus={autoFocus}
                disabled={loading}
                role="searchbox"
                aria-busy={loading}
                aria-controls="search-results"
                onKeyDown={handleKeyDown}
            />

            {loading && (
                <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    aria-hidden="true"
                >
                    <LoadingSpinner
                        size="small"
                        withMargin={false}
                        className="text-primary"
                    />
                </div>
            )}

            {loading && (
                <div className="sr-only" aria-live="polite">
                    {loadingState?.getMessage() || 'Searching...'}
                </div>
            )}
        </div>
    );
};

export default SearchBar;