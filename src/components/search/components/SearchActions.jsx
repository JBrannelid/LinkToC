import React from 'react';
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
    
    return (
        <div className={`space-y-3 ${actionsContainerClassName}`}>
            {/* Primary action button (Join, Select, etc.) */}
            {isActionEnabled && (
                <Button
                    type="primary"
                    onClick={handleActionClick}
                    loading={loading && loadingState?.operationType === 'update'}
                    disabled={loading || !isActionEnabled}
                    className={`w-full ${actionButtonClassName}`}
                    aria-busy={loading && loadingState?.operationType === 'update'}
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
            >
                {config?.cancelButtonText || 'Avbryt'}
            </Button>
        </div>
    );
};

export default SearchActions;