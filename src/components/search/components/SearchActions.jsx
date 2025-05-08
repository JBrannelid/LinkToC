import React, {useImperativeHandle, useRef} from 'react';
import {useSearch} from "../../../context/searchContext";
import Button from '../../ui/Button'

const SearchActions =({
    onAction,
    onCancel,
    actionButtonClassName = '',
    cancelButtonClassName = '',
    actionsContainerClassName = ''
}) => {
    const {
        config,
        selectedItem,
        selectedItems,
        loading,
        loadingState,
        selectionMode
    } = useSearch();
    
    const isActionEnabled = selectionMode === 'multiple' ? selectedItems.length > 0 : selectedItem !== null;
    
    const handleActionClick = () => {
        if(onAction){
            if(selectionMode === 'multiple'){
                onAction(selectedItems);
            }else{
                onAction(selectedItem);
            }
        }
    };
    const handleCancelClick = () => {
        if(onCancel){
            onCancel();
        }
    };
    const actionButtonRef = useRef(null);
    
    return (
        <div className={`space-y-3 ${actionsContainerClassName}`}>
            {/* Primary action button (Join, Select, etc.) */}
            {isActionEnabled && (
                <Button
                    ref={actionButtonRef}
                    type="primary"
                    onClick={handleActionClick}
                    loading={loading && loadingState?.operationType === 'update'}
                    disabled={loading || !isActionEnabled}
                    className={`w-full ${actionButtonClassName}`}
                    aria-busy={loading && loadingState?.operationType === 'update'}
                    data-action-button="primary"
                >
                    {loading && loadingState?.operationType === 'update'
                        ? loadingState.getMessage()
                        : config?.actionButtonText || 'Join'}
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
                {config?.cancelButtonText || 'Avbryt'}
            </Button>
        </div>
    );
};

export default SearchActions;