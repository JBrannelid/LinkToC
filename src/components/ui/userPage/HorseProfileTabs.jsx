import React from 'react';
import PropTypes from 'prop-types';
import {
    PageInfoSection,
    PageInfoItem,
    PageDocumentBadge,
    PageRecordList,
} from './';
import {
    getNestedProperty,
    formatHorseAge,
} from '../../../utils/horseProfileUtils.js';

// Overview tab content
export const OverviewTab = ({ horse }) => (
    <>
        <PageInfoSection title="General Information">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PageInfoItem label="Breed" value={horse.breed} />
                <PageInfoItem label="Age" value={formatHorseAge(horse.age)} />
                <PageInfoItem label="Color" value={horse.color} />
                <PageInfoItem label="Height" value={horse.height} />
                <PageInfoItem label="Weight" value={horse.weight} />
                <PageInfoItem label="Gender" value={horse.gender} />
                <PageInfoItem label="Birth Date" value={horse.birthDate} />
                <PageInfoItem label="Discipline" value={horse.discipline} />
            </dl>
        </PageInfoSection>

        <PageInfoSection title="About">
            <p className="text-sm text-gray-700">{horse.bio || "No information available."}</p>
        </PageInfoSection>
    </>
);

// Ownership tab content
export const OwnershipTab = ({ horse }) => (
    <>
        <PageInfoSection title="Owner Information">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PageInfoItem label="Owner" value={horse.owner} />
                <PageInfoItem label="Purchase Date" value={horse.purchaseDate} />
            </dl>
        </PageInfoSection>

        <PageInfoSection title="Registration">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PageInfoItem
                    label="Registry Organization"
                    value={horse.registryOrganization}
                />
                <PageInfoItem
                    label="Registration Number"
                    value={horse.registrationNumber}
                />
                <PageInfoItem
                    label="Microchip ID"
                    value={horse.microchipId}
                />
            </dl>
        </PageInfoSection>

        <PageInfoSection title="Documents">
            <div className="flex flex-wrap">
                {Object.entries(horse.documents || {}).map(([docName, docInfo], index) => (
                    <PageDocumentBadge key={index} name={docName} {...docInfo} />
                ))}
                {Object.keys(horse.documents || {}).length === 0 &&
                    <p className="text-gray-500 italic">No documents available</p>
                }
            </div>
        </PageInfoSection>
    </>
);

// Health tab content
export const HealthTab = ({ horse }) => (
    <>
        <PageInfoSection title="Health Status">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PageInfoItem label="Current Status" value={horse.healthStatus} />
                <PageInfoItem label="Last Vet Exam" value={horse.lastVetExam} />
            </dl>
        </PageInfoSection>
        <PageInfoSection title="Veterinarian">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PageInfoItem
                    label="Name"
                    value={getNestedProperty(horse, 'veterinarian.name')}
                />
                <PageInfoItem
                    label="Practice"
                    value={getNestedProperty(horse, 'veterinarian.practice')}
                />
                <PageInfoItem
                    label="Contact"
                    value={getNestedProperty(horse, 'veterinarian.contact')}
                />
            </dl>
        </PageInfoSection>

        <PageInfoSection title="Vaccinations">
            <PageRecordList
                records={horse.vaccinations || []}
                nameField="name"
                dateField="date"
            />
        </PageInfoSection>

        <PageInfoSection title="Dental Records">
            <PageRecordList
                records={horse.dentalRecords || []}
                nameField="procedure"
                dateField="date"
            />
        </PageInfoSection>
    </>
);

// Feed tab content
export const FeedTab = ({ horse }) => (
    <>
        <PageInfoSection title="Feeding Information">
            <dl className="grid grid-cols-1 gap-4">
                <PageInfoItem label="Feed Type" value={horse.feedType} />
                <PageInfoItem label="Feed Amount" value={horse.feedAmount} />
                <PageInfoItem label="Special Diet" value={horse.specialDiet} />
            </dl>
        </PageInfoSection>

        <PageInfoSection title="Supplements">
            <ul className="list-disc pl-5 text-sm text-gray-700">
                {(horse.supplements || []).map((supplement, index) => (
                    <li key={index}>{supplement}</li>
                ))}
            </ul>
        </PageInfoSection>

        <PageInfoSection title="Feeding Notes">
            <p className="text-sm text-gray-700">{horse.feedingNotes || 'Not available'}</p>
        </PageInfoSection>

        <PageInfoSection title="Feeding Schedule">
            <p className="text-sm text-gray-700">
                {horse.feedingSchedule || 'Not available'}
            </p>
        </PageInfoSection>
    </>
);

// Insurance tab content
export const InsuranceTab = ({ horse }) => (
    <>
        <PageInfoSection title="Insurance Details">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PageInfoItem label="Provider" value={getNestedProperty(horse, 'insurance.provider')}/>
                <PageInfoItem label="Policy Number" value={getNestedProperty(horse, 'insurance.policyNumber')} />
                <PageInfoItem label="Coverage Type" value={getNestedProperty(horse, 'insurance.coverageType')} />
                <PageInfoItem label="Expiration Date" value={getNestedProperty(horse, 'insurance.expirationDate')} />
                <PageInfoItem label="Policy Status" value={getNestedProperty(horse, 'insurance.policyStatus')} />
                <PageInfoItem label="Policy Notes" value={getNestedProperty(horse, 'insurance.policyNotes')} />
            </dl>
        </PageInfoSection>
    </>
);

// Helper function to get tab configuration
export const getHorseTabs = (horse) => [
    {
        id: "overview",
        label: "Overview",
        content: <OverviewTab horse={horse} />,
    },
    {
        id: "ownership",
        label: "Ownership",
        content: <OwnershipTab horse={horse} />,
    },
    {
        id: "health",
        label: "Health",
        content: <HealthTab horse={horse} />,
    },
    {
        id: "feed",
        label: "Feed",
        content: <FeedTab horse={horse} />,
    },
    {
        id: "insurance",
        label: "Insurance",
        content: <InsuranceTab horse={horse} />,
    }
];

// PropTypes for all tab components
const horseShape = PropTypes.shape({
    name: PropTypes.string,
    breed: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    color: PropTypes.string,
    // Add other properties as needed
});

OverviewTab.propTypes = {
    horse: horseShape.isRequired,
};

OwnershipTab.propTypes = {
    horse: horseShape.isRequired,
};

HealthTab.propTypes = {
    horse: horseShape.isRequired,
};

FeedTab.propTypes = {
    horse: horseShape.isRequired,
};

InsuranceTab.propTypes = {
    horse: horseShape.isRequired,
};