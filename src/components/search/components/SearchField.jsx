import React, { forwardRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';
import SearchActions from './SearchActions';
import { FormMessage } from '../../forms/index';
import {SearchProvider} from "../index.js";

const SearchField = forwardRef(({
                                    name,
                                    label,
                                    labelClassName = '',
                                    containerClassName = '',
                                    validation = {},
                                    customConfig = null,
                                    onSearch,
                                    onSelectItem,
                                    onCancel,
                                    errorMessage = "Detta fält krävs",
                                    resultsClassName = '',
                                    searchBarClassName = '',
                                    labelPosition = 'above',
                                    showMessage = true,
                                    formError = null,
                                    message = null,
                                }, ref) => {
    const {
        register,
        setValue,
        formState: { errors },
        trigger
    } = useFormContext();

    // Handle selection with form integration
    const handleSelectItem = (item) => {
        if (item && item.id) {
            setValue(name, item.id, { shouldValidate: true });
            trigger(name);
        }

        if (onSelectItem) {
            onSelectItem(item);
        }
    };

    // Handle search action with form integration
    const handleSearchAction = (selectedItem) => {
        if (selectedItem && selectedItem.id) {
            setValue(name, selectedItem.id, { shouldValidate: true });
            trigger(name);
        }

        if (onSearch) {
            onSearch(selectedItem);
        }
    };

    // Handle cancel action
    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };

    // Register the field with form
    useEffect(() => {
        register(name, validation);
    }, [register, name, validation]);

    // Prepare display message
    const displayMessage = formError ||
        (errors[name] ? { type: "error", text: errors[name].message || errorMessage } : null) ||
        (message && message.text ? message : null);

    return (
        <SearchProvider customConfig={customConfig}>
            <div className={`form-control ${containerClassName}`}>
                {/* Label */}
                {label && (
                    <label
                        htmlFor={name}
                        className={`form-label ${
                            labelPosition === "above" ? "mb-1" : "mr-2"
                        } text-sm font-medium ${labelClassName}`}
                    >
                        {label}
                    </label>
                )}

                {/* Hidden input for form control */}
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

                {/* Error message */}
                {showMessage && displayMessage && (
                    <FormMessage message={displayMessage} />
                )}
            </div>
        </SearchProvider>
    );
});

SearchField.displayName = "SearchField";
export default SearchField;