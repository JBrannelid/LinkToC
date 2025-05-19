import{ createContext, useContext } from 'react';

const SearchContext = createContext(undefined);

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearch must be used with a SearchProvider');
    }
    return context;
}
export { SearchContext };