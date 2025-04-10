import React from 'react';

const InfoSection = ({title, children, className =""}) => {
    return (
        <section className={`mb-6 ${className}`} >
            <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
            <div className="bg-gray-50 rounded-lg p-4">
                {children}
            </div>
        </section>
    );
};

export default InfoSection;

