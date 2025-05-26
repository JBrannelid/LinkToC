import React, {useCallback, useEffect, useRef, useState} from "react";
import { useSearch } from "../../../context/searchContext";
import LoadingSpinner from "../../ui/LoadingSpinner";

const SearchInput = ({
  className = "",
  inputClassName = "",
  ariaLabel,
  onFocus,
  onBlur,
  autoFocus = false,
  desktopView = false,
  maintainFocus = true,
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
  const [localValue, setLocalValue] = useState(query || '');
  const isUserTypingRef = useRef(false);
  useEffect(() => {
    if (!isUserTypingRef.current && query !== localValue) {
      setLocalValue(query || '');
    }
  }, [query, localValue]);
  
  const inputRef = useRef(null);
  const wasLoadingRef = useRef(loading);
  const placeholder = config?.placeholderText || "Search...";
  const debounceTimerRef = useRef(null);
  
  const handleLocalInputChange = useCallback((e) => {
    const newValue = e.target.value;

    // Update local state immediately for responsive UI
    setLocalValue(newValue);

    // Mark that user is typing
    isUserTypingRef.current = true;

    // Clear any previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Only update context after debounce period
    debounceTimerRef.current = setTimeout(() => {
      isUserTypingRef.current = false;
      const syntheticEvent = { target: { value: newValue } };
      handleInputChange(syntheticEvent);
      
    }, 400); 

  }, [query, handleInputChange]);
  useEffect(() => {
    if (wasLoadingRef.current && !loading && maintainFocus && !desktopView) {
      setTimeout(() => {
        if (inputRef.current && document.activeElement?.tagName !== "INPUT") {
          inputRef.current.focus();

          const length = inputRef.current.value.length;
          inputRef.current.setSelectionRange(length, length);
        }
      }, 100);
    }

    wasLoadingRef.current = loading;
  }, [loading, maintainFocus, desktopView]);


  useEffect(() => {
    // Only auto-focus if:
    if (
      autoFocus &&
      !desktopView &&
      window.innerWidth < 1024 &&
      inputRef.current
    ) {
      // Slight delay to ensure DOM is fully rendered
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [autoFocus, desktopView]);


  const handleFocus = useCallback((e) => {
    if (onFocus) {
      onFocus(e);
    }
  }, [onFocus]);

  const handleBlur = useCallback((e) => {
    // const relatedTarget = e.relatedTarget;
    //
    // if (
    //     maintainFocus &&
    //     !relatedTarget?.closest('[role="listbox"]') &&
    //     !relatedTarget?.closest('button') &&
    //     !desktopView
    // ) {
    //   // Increased timeout for better UX
    //   setTimeout(() => {
    //     if (inputRef.current) {
    //       inputRef.current.focus();
    //     }
    //   }, 150);
    // }

    if (onBlur) {
      onBlur(e);
    }
  },[maintainFocus, onBlur, desktopView]);
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
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

    if (e.key === "ArrowDown" && results && results.length > 0) {
      e.preventDefault();

      const firstResultItem = document.querySelector('[role="option"]');
      if (firstResultItem) {
        firstResultItem.focus();
      }
    }
  },[selectedItem, results, executeActionForSelectedItem, handleSelectItem]);
  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={handleLocalInputChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${inputClassName} ${
          loading ? "pr-10" : ""
        }`}
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
              className={`absolute inset-0 flex items-center justify-center bg-white
    transition-opacity duration-200 ${!loading && message ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
              role="alert"
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
          {loadingState?.getMessage() || "Searching..."}
        </div>
      )}
    </div>
  );
};

export default React.memo(SearchInput);