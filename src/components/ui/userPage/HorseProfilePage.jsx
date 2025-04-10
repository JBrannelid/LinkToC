import React, { useState, useEffect } from 'react';
import {
    PageContainer, PageBody, PageTitle, 
    PageProfileCard, ProfileTabs, PageInfoSection, PageInfoItem, LoadingState,
    NotFoundState, PageDocumentBadge, PageRecordList, 
} from './';

export const ProfilePage = ({
                                id,
                                imageUrl,
                                onDetailsClick,
                                loadingText = "Loading profile...",
                                notFoundText = "No profile data found",
                                placeholderImageUrl,
                            }) => {
    const [horse, setHorse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await onDetailsClick(id);
                setHorse(data);
                console.log(horse);
                setError(false);
            } catch (err) {
                console.error("Error fetching horse data:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, onDetailsClick]);

    if (loading) {
        return <LoadingState text={loadingText} />;
    }

    if (error || !horse) {
        return <NotFoundState text={notFoundText} />;
    }

    const tabs = [
        {
            id: 'overview',
            label: 'Overview',
            content: (
                <div>
                    <PageInfoSection title="General Information">
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <PageInfoItem label="Breed" value={horse.breed} />
                            <PageInfoItem label="Age" value={`${horse.age} years`} />
                            <PageInfoItem label="Color" value={horse.color} />
                            <PageInfoItem label="Height" value={horse.height} />
                            <PageInfoItem label="Weight" value={horse.weight} />
                            <PageInfoItem label="Gender" value={horse.gender} />
                            <PageInfoItem label="Birth Date" value={horse.birthDate} />
                            <PageInfoItem label="Discipline" value={horse.discipline} />
                        </dl>
                    </PageInfoSection>

                    <PageInfoSection title="About">
                        <p className="text-sm text-gray-700">{horse.bio}</p>
                    </PageInfoSection>
                </div>
            )
        },
        {
            id: 'ownership',
            label: 'Ownership',
            content: (
                <div>
                    <PageInfoSection title="Owner Information">
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <PageInfoItem label="Owner" value={horse.owner} />
                            <PageInfoItem label="Purchase Date" value={horse.purchaseDate} />
                        </dl>
                    </PageInfoSection>

                    <PageInfoSection title="Registration">
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <PageInfoItem label="Registry Organization" value={horse.registryOrganization} />
                            <PageInfoItem label="Registration Number" value={horse.registrationNumber} />
                            <PageInfoItem label="Microchip ID" value={horse.microchipId} />
                        </dl>
                    </PageInfoSection>

                    <PageInfoSection title="Documents">
                        <div className="flex flex-wrap">
                            {Object.entries(horse.documents || {}).map(([name, available]) => (
                                <PageDocumentBadge key={name} name={name} available={available} />
                            ))}
                        </div>
                    </PageInfoSection>
                </div>
            )
        },
        {
            id: 'health',
            label: 'Health',
            content: (
                <div>
                    <PageInfoSection title="Health Status">
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <PageInfoItem label="Current Status" value={horse.healthStatus} />
                            <PageInfoItem label="Last Vet Exam" value={horse.lastVetExam} />
                        </dl>
                    </PageInfoSection>

                    <PageInfoSection title="Veterinarian">
                        <dl className="grid grid-cols-1 gap-2">
                            <PageInfoItem label="Name" value={horse.veterinarian.name} />
                            <PageInfoItem label="Practice" value={horse.veterinarian.practice} />
                            <PageInfoItem label="Contact" value={horse.veterinarian.contact} />
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
                </div>
            )
        },
        {
            id: 'feed',
            label: 'Feed',
            content: (
                <div>
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
                        <p className="text-sm text-gray-700">{horse.feedingNotes}</p>
                    </PageInfoSection>
                </div>
            )
        },
        {
            id: 'insurance',
            label: 'Insurance',
            content: (
                <div>
                    <PageInfoSection title="Insurance Details">
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <PageInfoItem label="Provider" value={horse.insurance.provider} />
                            <PageInfoItem label="Policy Number" value={horse.insurance.policyNumber} />
                            <PageInfoItem label="Coverage Type" value={horse.insurance.coverageType} />
                            <PageInfoItem label="Expiration Date" value={horse.insurance.expirationDate} />
                        </dl>
                    </PageInfoSection>
                </div>
            )
        }
    ];

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-1">
                    <PageProfileCard
                        name={horse.name}
                        breed={horse.breed}
                        discipline={horse.discipline}
                        imageUrl={imageUrl || ''}
                        placeholderImageUrl={placeholderImageUrl}
                        healthStatus={horse.healthStatus}
                        onDetailsClick={() => {}}
                    >
                        <p className="text-sm text-gray-600 line-clamp-3">{horse.bio}</p>
                    </PageProfileCard>
                </div>
                <div className="md:col-span-2">
                    <PageContainer>
                        <PageBody>
                            <PageTitle className="mb-4">{horse.name} - Profile</PageTitle>
                            <ProfileTabs tabs={tabs} defaultTab="overview" />
                        </PageBody>
                    </PageContainer>
                </div>
            </div>
        </div>
    );
};