import React, { forwardRef, useCallback, useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import SearchActions from "./SearchActions";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";
import { FormMessage } from "../../forms/index";
import { SearchProvider } from "../index.js";

const SearchField = forwardRef(
  (
    {
      name,
      label,
      labelClassName = "",
      containerClassName = "",
      validation = {},
      customConfig = null,
      onSearch,
      onSelectItem,
      onCancel,
      errorMessage = "This field is required. Please enter a value.",
      resultsClassName = "",
      searchBarClassName = "",
      labelPosition = "above",
      showMessage = true,
      formError = null,
      message = null,
    },
    ref
  ) => {
    const {
      register,
      setValue,
      formState: { errors },
      trigger,
    } = useFormContext();

    // Handle selection with form integration
    const handleSelectItem = useCallback(
      (item) => {
        if (item && item.id) {
          setValue(name, item.id, { shouldValidate: true });
          trigger(name);
        }

        if (onSelectItem) {
          onSelectItem(item);
        }
      },
      [onSelectItem, setValue, name, trigger]
    );

    // Handle search action with form integration
    const handleSearchAction = useCallback(
      (selectedItem) => {
        if (selectedItem && selectedItem.id) {
          setValue(name, selectedItem.id, { shouldValidate: true });
          trigger(name);
        }

        if (onSearch) {
          onSearch(selectedItem);
        }
      },
      [onSearch, trigger, setValue, name]
    );

    // Handle cancel action
    const handleCancel = useCallback(() => {
      if (onCancel) {
        onCancel();
      }
    }, [onCancel]);

    // Register the field with form
    useEffect(() => {
        register(name, validation);
      },
      [register, name, validation]);

    // Prepare display message
    const displayMessage = useMemo(() => {
      return (
        formError ||
        (errors[name]
          ? { type: "error", text: errors[name].message || errorMessage }
          : null) ||
        (message && message.text ? message : null)
      );
    }, [formError, errors, name, errorMessage, message]);
    const labelElement = useMemo(() => {
      if (!label) return null;

      return (
        <label
          htmlFor={name}
          className={`form-label ${
            labelPosition === "above" ? "mb-1" : "mr-2"
          } text-sm font-medium ${labelClassName}`}
        >
          {label}
        </label>
      );
    }, [label, labelPosition, labelClassName, name]);
    const errorElement = useMemo(() => {
      if (!showMessage || !displayMessage) return null;

      return <FormMessage message={displayMessage} />;
    }, [showMessage, displayMessage]);

    return (
      <SearchProvider customConfig={customConfig}>
        <div className={`form-control ${containerClassName}`}>
          {/* Label */}
          {labelElement}

          <input
            type="hidden"
            id={name}
            name={name}
            aria-hidden="true"
            ref={ref}
          />

          {/* Search bar */}
          <SearchInput
            className={searchBarClassName}
            ariaLabel={label || "Sök"}
            autoFocus
          />

          {/* Search results */}
          <SearchResults
            className={`mt-2 ${resultsClassName}`}
            maxHeight="60vh"
            onItemSelect={handleSelectItem}
          />

          {/* Action buttons */}
          <div className="mt-4">
            <SearchActions
              onAction={handleSearchAction}
              onCancel={handleCancel}
            />
          </div>

          {errorElement}
        </div>
      </SearchProvider>
    );
  }
);

SearchField.displayName = "SearchField";
export default React.memo(SearchField);
