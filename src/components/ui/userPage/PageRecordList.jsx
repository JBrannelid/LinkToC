import React from 'react';

const RecordList = ({ records, dateField, nameField, labelField }) => {
    return (
        <ul className="divide-y divide-gray-200">
            {records.map((record, index) => (
                <li key={index} className="py-2">
                    <div className="flex justify-between">
                        <div className="text-sm font-medium text-gray-900">{record[nameField]}</div>
                        <div className="text-sm text-gray-500">{record[dateField]}</div>
                    </div>
                    {labelField && record[labelField] && (
                        <div className="text-sm text-gray-500">{record[labelField]}</div>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default RecordList;