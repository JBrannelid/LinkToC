import React, {useRef} from 'react';
import { useSearch} from "../../../context/searchContext"
import LoadingSpinner from "../../ui/LoadingSpinner";

const SearchBar = ({
    className = '',
    inputClassName = '',
    ariaLabel,
    onFocus,
    onBlur,
    autoFocus = false
}) => {
    const {
        query,
        handleInputChange,
        loading,
        loadingState,
        config
    } = useSearch();
    
    const inputRef = useRef(null);
    
    const placeholder = config?.placeholderText || 'Search...';
    
    return (
        <div  className={`relative ${className}`}>
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
                onFocus={onFocus}
                onBlur={onBlur}
                autoFocus={autoFocus}
                disabled={loading}
                role="searchbox"
                aria-busy={loading}
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