import React from 'react';

const DocumentBadge = ({ name, available }) => {
    return (
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mr-2 mb-2 ${
            available
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
        }`}>
      <span className="mr-1">
        {available ? (
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ) : (
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        )}
      </span>
            {name}
        </div>
    );
};

export default DocumentBadge;