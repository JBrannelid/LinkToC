import React, {useRef} from 'react';
import {useSearch} from "../../../context/searchContext";
import Button from '../../ui/Button'

const SearchActions = ({
                           onCancel,
                           cancelButtonClassName = '',
                           actionsContainerClassName = ''
                       }) => {
    const {
        config,
        loading,
    } = useSearch();
    
    const handleCancelClick = () => {
        if (onCancel) {
            onCancel();
        }
    };

    return (
        <div className={`space-y-3 ${actionsContainerClassName}`}>

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