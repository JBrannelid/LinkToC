import React from 'react';
import {useSearch} from '../../../context/searchContext.js';
import Button from '../../ui/Button';

const SearchActions = ({
                           onCancel,
                           onAction,
                           cancelButtonClassName = '',
                           actionsContainerClassName = ''
                       }) => {
    const {
        config,
        loading,
        selectedItem,
        executeActionForSelectedItem
    } = useSearch();

    const handleActionClick = () => {
        if (onAction && selectedItem) {
            executeActionForSelectedItem(onAction);
        }
    };

    const handleCancelClick = () => {
        if (onCancel) {
            onCancel();
        }
    };

    return (
        <div className={`space-y-3 ${actionsContainerClassName}`}>
            {/* Action button - only show if we have a selected item */}
            {selectedItem && onAction && (
                <Button
                    type="primary"
                    onClick={handleActionClick}
                    disabled={loading}
                    className="w-full"
                    data-action-button="primary"
                >
                    {config?.actionButtonText || 'Select'}
                </Button>
            )}

            {/* Cancel button */}
            <Button
                type="secondary"
                onClick={handleCancelClick}
                disabled={loading}
                className={`w-full ${cancelButtonClassName}`}
                data-action-button="secondary"
            >
                {config?.cancelButtonText || 'Cancel'}
            </Button>
        </div>
    );
};

export default SearchActions;