import {useLocation} from "react-router";
import {useCallback, useEffect, useMemo, useReducer} from "react";
import {useLoadingState} from "../../hooks/useLoadingState.js";
import {createErrorMessage} from "../../utils/errorUtils.js";
import {getConfigForRoutes} from "./config/searchConfig.js";

const initialState = {
    query: "",
    results: [],
    loading: false,
    error: null,
    selectedItems: [],
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
            return {...state, error: action.payload, loading: false};
        case ACTIONS.SET_MESSAGE:
            return {...state, message: action.payload};
        case ACTIONS.SELECT_ITEM:
            return {...state, selectedItem: action.payload};
        case ACTIONS.TOGGLE_ITEM_SELECTION:
            const {item, idField, selectionMode} = action.payload;
            const itemId = item[idField || 'id'];

            if (selectionMode === 'multiple') {
                const isSelected = state.selectedItems.some(
                    selectedItem => selectedItem[idField || 'id'] === itemId
                );

                return {
                    ...state,
                    selectedItems: isSelected
                        ? state.selectedItems.filter(selectedItem => selectedItem[idField || 'id'] !== itemId)
                        : [...state.selectedItems, item]
                };
            } else {

                return {...state, selectedItem: item};
            }

        case ACTIONS.CLEAR_SELECTION:
            return {...state, selectedItem: null, selectedItems: []};
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

                if (response.data.length === 0) {
                    dispatch({
                        type: ACTIONS.SET_MESSAGE,
                        payload: createErrorMessage(config.noResultsText || 'No results found'),
                    });
                }
            } else if (Array.isArray(response)) {
                dispatch({type: ACTIONS.SET_RESULTS, payload: response});

                if (response.length === 0) {
                    dispatch({
                        type: ACTIONS.SET_MESSAGE,
                        payload: createErrorMessage(config.noResultsText || 'No results found')
                    });
                }
            } else {
                console.warn('Unexpected search response format: ', response);
                dispatch({type: ACTIONS.SET_RESULTS, payload: []});
                dispatch({
                    type: ACTIONS.SET_MESSAGE,
                    payload: createErrorMessage(config.noResultsText || 'No results found'),
                });
            }
        } catch (error) {
            console.error('Search error:', error);
            dispatch({
                type: ACTIONS.SET_ERROR,
                payload: error.message || config.errorText || 'An error occured during search',
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
                    timeoutId = setTimeout(() => performSearch(value), 300);
                };
            })(),
        [performSearch]);

    const handleInputChange = (event) => {
        const newQuery = event.target.value;
        dispatch({type: ACTIONS.SET_QUERY, payload: newQuery});

        if (newQuery.trim()) {
            debouncedSearch(newQuery);
        } else {
            dispatch({type: ACTIONS.SET_RESULTS, payload: []});
            dispatch({type: ACTIONS.SET_MESSAGE, payload: null});
        }
    };

    const handleSelectItem = (item) => {
        if (!item) return;
        dispatch({
            type: ACTIONS.TOGGLE_ITEM_SELECTION,
            payload: {
                item,
                idField: config?.idField || 'id',
                selectionMode: config?.selectionMode || 'single',
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

    const isItemSelected = (item) => {
        if (!item) return false;

        const itemId = item[config?.idField || 'id'];

        if (config?.selectionMode === 'multiple') {
            return state.selectedItems.some(
                selectedItem => selectedItem[config?.idField || 'id'] === itemId
            );
        }
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
        handleInputChange,
        handleSelectItem,
        handleAction,
        setOperationType,
        isItemSelected,
        clearSelection,
        resetSearch,
        selectionMode: config?.selectionMode || 'single',
    };

    return (
        <SearchContext.Provider value={contextValue}>
            {children}
        </SearchContext.Provider>
    );
};

export default SearchProvider;