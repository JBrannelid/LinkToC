import React from 'react';

const NotFoundState = ({ text = 'No data found' }) => {
    return (
        <div className="text-center py-10">
            <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20h.01m-7.08-7.08c3.28.65 6.58 1.08 9.9 1.08 3.32 0 6.61-.43 9.89-1.08a.75.75 0 00.63-.74v-3.61a.75.75 0 00-.63-.74 48.99 48.99 0 00-19.79 0 .75.75 0 00-.63.74v3.61c0 .35.25.66.63.74z" />
            </svg>
            <p className="text-gray-500">{text}</p>
        </div>
    );
};

export default NotFoundState;