import React, {useState} from "react";
import {classNames} from "../../../utils/horseProfileUtils.js";

const Tabs = ({ tabs, defaultTab, className ='' }) => {
    const [activeTab, setActiveTab] = useState(defaultTab || (tabs[0] && tabs[0].id));
    
    return( 
        <div className={`${className}`}>
            <div className={`border-b border-gray-200`}>
                <nav className="flex overflow-x-auto" aria-labelledby={tabs[0].id}>
                    {tabs.map(tab => (
                        <button
                        key={tab.id}
                        onClick={() => {setActiveTab(tab.id)}}
                        className={classNames(
                            activeTab === tab.id
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                        )}
                        aria-current={activeTab === tab.id ? 'page' : undefined}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        id={`tab-${tab.id}`}
                        aria-controls={`tabpanel-${tab.id}`}
                        >
                            {tab.label}
                            </button>
                        ))}
                </nav>
            </div>
            <div className="py-4">
                {tabs.map(tab => (
                    <div
                    key={tab.id}
                    role="tabpanel"
                    id={`tabpanel-${tab.id}`}
                    aria-labelledby={`tab-${tab.id}`}
                    className={activeTab === tab.id ? 'block' : 'hidden'}>
                        {tab.content}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tabs;