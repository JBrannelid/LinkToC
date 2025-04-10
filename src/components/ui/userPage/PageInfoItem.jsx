import React from 'react';

const InfoItem = ({ label, value, className = '' }) => {
    return (
        <div className={`mb-2 ${className}`}>
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="text-sm text-gray-900">{value || 'Not available'}</dd>
        </div>
    );
};

export default InfoItem;