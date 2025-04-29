import React, { useState } from "react";
import Button from "../ui/Button.jsx";
import SettingIcon from "../../assets/icons/SettingIcon.jsx";

const JoinStableScreen = ({
                              onSubmit,
                              onBack,
                              isLoading,
                              loadingState,
                              error
                          }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedStable, setSelectedStable] = useState(null);

    const handleSearchQueryChange = (event) => {
        setSearchQuery(event.target.value);
    };
    const handleSearch = async (event) => {
        event.preventDefault();

        if (onSubmit && searchQuery.trim()) {
            const result = await onSubmit(searchQuery);

            if (result && result.success && result.data) {
                setSearchResults(result.data);
            }
        }
    };
    const handleSelectStable = (stable) => {
        setSelectedStable(stable);
    };
    const handleJoinStable = () => {
        if (selectedStable && onSubmit) {
            onSubmit({ stableId: selectedStable.id, action: 'join' });
        }
    };
    return (
        <div className="flex flex-col items-center" role="region" aria-labelledby="join-stable-heading">
            {/* Header section */}
            <div className="self-start mb-2 sm:mb-4">
                <SettingIcon strokeWidth={9} className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            </div>

            <h1 id="join-stable-heading" className="text-2xl sm:text-3xl text-center my-4 sm:my-6 font-heading">
                Gå med i stall
            </h1>

            {/* Image section */}
            <div className="w-full my-2 sm:my-4 px-2 sm:px-4">
                <div className="relative">
                    <img
                        src="/src/assets/images/FirstLoginImage.jpg"
                        alt="Häst i hage"
                        className="w-full rounded-lg border border-primary"
                    />
                </div>
            </div>

            {/* Search form */}
            <div className="w-full mt-6 px-2 sm:px-4">
                <form onSubmit={handleSearch} className="mb-6">
                    <div className="mb-4">
                        <label htmlFor="stableSearch" className="block text-sm mb-1 font-medium">
                            Sök efter ett befintligt stall:
                        </label>
                        <div className="flex">
                            <input
                                id="stableSearch"
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchQueryChange}
                                placeholder="Sök efter stallets namn..."
                                className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                disabled={isLoading}
                                aria-describedby={error ? "search-error" : undefined}
                            />
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="ml-2"
                                disabled={isLoading || !searchQuery.trim()}
                                loading={isLoading && loadingState?.operationType === 'fetch'}
                            >
                                Sök
                            </Button>
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div
                            id="search-error"
                            className="mt-2 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}
                </form>

                {/* Search results */}
                {searchResults.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-medium mb-2">Sökresultat</h2>
                        <ul className="space-y-2" role="listbox" aria-label="Sökresultat för stall">
                            {searchResults.map(stable => (
                                <li
                                    key={stable.id}
                                    className={`p-3 border rounded-lg cursor-pointer ${
                                        selectedStable?.id === stable.id
                                            ? 'border-primary bg-primary-50'
                                            : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                                    onClick={() => handleSelectStable(stable)}
                                    role="option"
                                    aria-selected={selectedStable?.id === stable.id}
                                >
                                    <div className="font-medium">{stable.name}</div>
                                    {stable.location && (
                                        <div className="text-sm text-gray-600">{stable.location}</div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Action buttons */}
                <div className="space-y-3 mt-8">
                    {searchResults.length > 0 && (
                        <Button
                            type="primary"
                            onClick={handleJoinStable}
                            disabled={isLoading || !selectedStable}
                            loading={isLoading && loadingState?.operationType === 'update'}
                            className="w-full"
                        >
                            {isLoading && loadingState?.operationType === 'update'
                                ? loadingState.getMessage()
                                : 'Gå med'}
                        </Button>
                    )}

                    <Button
                        type="secondary"
                        onClick={onBack}
                        disabled={isLoading}
                        className="w-full"
                    >
                        Gå tillbaka
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default JoinStableScreen;

