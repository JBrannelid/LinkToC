import React, {useState} from "react";

export const Tabs = ({ tabs, defaultTab, className ='' }) => {
    const [activeTab, setActiveTab] = useState(defaultTab || (tabs[0] && tabs[0].id));
    
    return( 
        <div className={`${className}`}>
            <div className={`border-b border-gray-200`}>
                <nav className="flex overflow-x-auto" aria-labelledby={tabs[0].id}>
                    {tabs.map(tab => (
                        <button
                        key={tab.id}
                        onClick={() => {setActiveTab(tab.id)}}
                        className={`whitespace-nowrap py-3 px-4 font-medium text-sm border-b-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                            activeTab === tab.id
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
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