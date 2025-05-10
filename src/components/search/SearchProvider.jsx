import {useLocation} from "react-router";
import {useCallback, useEffect, useMemo, useReducer, useState} from "react";
import {useLoadingState} from "../../hooks/useLoadingState.js";
import {getConfigForRoutes} from "./config/searchConfig.js";
import {SearchContext} from "../../context/searchContext.js";
import {createErrorMessage, getErrorMessage} from "../../utils/errorUtils.js";

const initialState = {
    query: "",
    results: [],
    loading: false,
    error: null,
    selectedItem: null,
    message: null,
    operationType: 'fetch'
};

const ACTIONS = {
    SET_QUERY: 'SET_QUERY',
    SET_RESULTS: 'SET_RESULTS',
    START_LOADING: 'START_LOADING',
    FINISH_LOADING: 'FINISH_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_MESSAGE: 'SET_MESSAGE',
    SELECT_ITEM: 'SELECT_ITEM',
    SET_SELECTED_ITEM: 'SET_SELECTED_ITEM',
    TOGGLE_ITEM_SELECTION: 'TOGGLE_ITEM_SELECTION',
    CLEAR_SELECTION: 'CLEAR_SELECTION',
    RESET_SEARCH: 'RESET_SEARCH',
    RESET_ALL: 'RESET_ALL',
    SET_OPERATION_TYPE: 'SET_OPERATION_TYPE'
};

function searchReducer(state, action) {
    switch (action.type) {

        case ACTIONS.SET_QUERY:
            return {...state, query: action.payload};

        case ACTIONS.SET_RESULTS:
            return {...state, results: action.payload};

        case ACTIONS.START_LOADING:
            return {...state, loading: true, error: null, operationType: action.payload || state.operationType};

        case ACTIONS.FINISH_LOADING:
            return {...state, loading: false}
        case ACTIONS.SET_ERROR:
            return {
                ...state,
                error: typeof action.payload === 'string' ? createErrorMessage(action.payload) : getErrorMessage(action.payload),
                loading: false
            };
        case ACTIONS.SET_MESSAGE:
            return {...state, message: action.payload};
        case ACTIONS.SELECT_ITEM:
            return {...state, selectedItem: action.payload};
        case ACTIONS.SET_SELECTED_ITEM:
            return {...state, selectedItem: action.payload};
        case ACTIONS.TOGGLE_ITEM_SELECTION:

            const {item, idField = 'id'} = action.payload;
            const itemId = item[idField];

            const isAlreadySelected = state.selectedItem &&
                state.selectedItem[idField] === itemId;
            return {
                ...state,
                selectedItem: isAlreadySelected ? null : item
            };

        case ACTIONS.CLEAR_SELECTION:
            return {...state, selectedItem: null};
        case ACTIONS.RESET_SEARCH:
            return {
                ...state,
                query: '',
                results: [],
                error: null,
                message: null,
            };

        case ACTIONS.RESET_ALL:
            return initialState;

        case ACTIONS.SET_OPERATION_TYPE:
            return {...state, operationType: action.payload};

        default:
            return state;

    }
}


const SearchProvider = ({children, customConfig = null}) => {
    const location = useLocation();

    const [state, dispatch] = useReducer(searchReducer, initialState);

    const loadingState = useLoadingState(state.loading, state.operationType);

    const [isTyping, setIsTyping] = useState(false);

    const config = useMemo(() => {
        return customConfig || getConfigForRoutes(location.pathname);
    }, [customConfig, location.pathname]);

    useEffect(() => {
        dispatch({type: ACTIONS.RESET_ALL});
    }, [config?.entityType]);

    const performSearch = useCallback(async (searchQuery) => {
        if (!searchQuery.trim() || !config?.searchFn) return;

        try {
            dispatch({type: ACTIONS.START_LOADING, payload: 'fetch'});
            dispatch({type: ACTIONS.SET_MESSAGE, payload: null});

            const response = await config.searchFn(searchQuery);

            if (response?.success && Array.isArray(response.data)) {
                dispatch({type: ACTIONS.SET_RESULTS, payload: response.data});
                if (response.data.length > 0) {
                    dispatch({
                        type: ACTIONS.SET_SELECTED_ITEM,
                        payload: response.data[0]
                    });
                }
                if (response.data.length === 0 && searchQuery.trim().length > 0) {
                    dispatch({
                        type: ACTIONS.SET_MESSAGE,
                        payload: createErrorMessage(config.noResultsText || 'No results found'),
                    });
                } else {
                    dispatch({type: ACTIONS.SET_MESSAGE, payload: null});
                }
            } else if (Array.isArray(response)) {
                dispatch({type: ACTIONS.SET_RESULTS, payload: response});

                if (response.length > 0) {
                    dispatch({
                        type: ACTIONS.SET_SELECTED_ITEM,
                        payload: response[0]
                    });
                }

                if (response.length === 0 && searchQuery.trim().length > 0) {
                    dispatch({
                        type: ACTIONS.SET_MESSAGE,
                        payload: createErrorMessage(config.noResultsText || 'No results found')
                    });
                } else {
                    dispatch({type: ACTIONS.SET_MESSAGE, payload: null});
                }
            } else {
                console.warn('Unexpected search response format: ', response);
                dispatch({type: ACTIONS.SET_RESULTS, payload: []});
                if (searchQuery.trim().length > 0) {
                    dispatch({
                        type: ACTIONS.SET_MESSAGE,
                        payload: createErrorMessage(config.noResultsText || 'No results found'),
                    });
                } else {
                    dispatch({type: ACTIONS.SET_MESSAGE, payload: null});
                }
            }
        } catch (error) {
            console.error('Search error details:', {
                error,
                message: error.message,
                stack: error.stack,
                config: config
            });
            dispatch({
                type: ACTIONS.SET_ERROR,
                payload: error
            });
        } finally {
            dispatch({type: ACTIONS.FINISH_LOADING});
        }
    }, [config]);

    const debouncedSearch = useCallback((
            () => {
                let timeoutId;
                return (value) => {
                    clearTimeout(timeoutId);
                    setIsTyping(true);
                    timeoutId = setTimeout(() => {
                        setIsTyping(false);
                        performSearch(value);
                    }, 1000);
                };
            })(),
        [performSearch]);

    const handleInputChange = (event) => {
        const newQuery = event.target.value;
        if (state.error) {
            dispatch({type: ACTIONS.SET_ERROR, payload: null})
        }
        dispatch({type: ACTIONS.SET_QUERY, payload: newQuery});
        dispatch({type: ACTIONS.SET_MESSAGE, payload: null});
        if (newQuery.trim()) {
            setIsTyping(true);
            debouncedSearch(newQuery);
        } else {
            setIsTyping(false);
            dispatch({type: ACTIONS.SET_RESULTS, payload: []});

        }
    };
    const setSelectedItem = (item) => {
        if (!item) return;
        dispatch({
            type: ACTIONS.SET_SELECTED_ITEM,
            payload: item
        });
    };
    const handleItemFocus = (item) => {
        if (!item) return;
        dispatch({
            type: ACTIONS.SET_SELECTED_ITEM || ACTIONS.SELECT_ITEM,
            payload: item
        });
    }

    const handleSelectItem = (item) => {
        if (!item) return;
        dispatch({
            type: ACTIONS.TOGGLE_ITEM_SELECTION,
            payload: {
                item,
                idField: config?.idField || 'id',
            }
        });
    };

    const setOperationType = (type) => {
        dispatch({type: ACTIONS.SET_OPERATION_TYPE, payload: type});
    };

    const handleAction = async (actionFn, operationType = 'update') => {
        if (!actionFn) return;

        try {
            dispatch({type: ACTIONS.START_LOADING, payload: operationType});
            return await actionFn();
        } catch (error) {
            dispatch({
                type: ACTIONS.SET_ERROR,
                payload: error.message || 'An error occurred'
            });
        } finally {
            dispatch({type: ACTIONS.FINISH_LOADING});
        }
    };
    const executeActionForSelectedItem = useCallback(() => {
        if (state.selectedItem) {
            
            return handleAction(() => {
                if (onAction) {
                    onAction(state.selectedItem);
                }
            }, 'update');
        }
        return Promise.resolve();
    }, [state.selectedItem, handleAction]);
    const isItemSelected = (item) => {
        if (!item) return false;

        const itemId = item[config?.idField || 'id'];
        
        return state.selectedItem && state.selectedItem[config?.idField || 'id'] === itemId;
    };

    const clearSelection = () => {
        dispatch({type: ACTIONS.CLEAR_SELECTION})
    };

    const resetSearch = () => {
        dispatch({type: ACTIONS.RESET_SEARCH});
        clearSelection();
    };

    const contextValue = {
        ...state,
        config,
        loadingState,
        isTyping,
        handleItemFocus,
        handleInputChange,
        handleSelectItem,
        setSelectedItem,
        handleAction,
        setOperationType,
        isItemSelected,
        clearSelection,
        resetSearch,
        executeActionForSelectedItem,
        selectionMode: config?.selectionMode || 'single',
    };

    return (
        <SearchContext.Provider value={{
            ...contextValue,
            error: typeof state.error === 'string' ? createErrorMessage(state.error) : state.error,
        }}
        >
            {state.error && (
                <div className="sr-only" role="alert" aria-live="assertive">
                    {typeof state.error === 'object' ? state.error.text : state.error}
                </div>
            )}
            {children}
        </SearchContext.Provider>
    );
};

export default SearchProvider;