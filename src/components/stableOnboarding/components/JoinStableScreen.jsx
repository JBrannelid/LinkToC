import React, { useState } from "react";
import Button from "../ui/Button.jsx";
import SettingIcon from "../../assets/icons/SettingIcon.jsx";
import {LucideArrowBigLeft} from "lucide-react";

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
            onSubmit({
                stableId: selectedStable.id,
                stableName: selectedStable.name,
                action: 'join'
            });
        }
    };

    return (
       <div>
           <form onSubmit={handleSearch} className="mb-6">
               <div className="mb-4">
                   <label 
                       htmlFor="stableSearch"
                       className="block text-sm mb-1 font-medium">
                       Search for existing stable:
                   </label>
                   <div className="flex flec-col sm:flex-row space-y-2 sm:space-y-0">
                       <input
                           id="stableSearch" 
                           type="text"
                           value={searchQuery}
                       onChange={handleSearchQueryChange}
                       placeholder="Enter Stable Name..."
                       className="w-full sm:flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                       disabled={isLoading}
                       aria-describedby={error ? "search error" : undefined}/>
                       
                   </div>
               </div>
           </form>
       </div>
    );
};

export default JoinStableScreen;

