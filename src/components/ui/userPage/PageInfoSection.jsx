import React from 'react';

export const UserPageInfoSection = ({title, children, className ="", id}) => {
    return (
        <section className={`mb-6 ${className}`} id={id}>
            <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
            <div className="bg-gray-50 rounded-lg p-4">
                {children}
            </div>
        </section>
    );
};