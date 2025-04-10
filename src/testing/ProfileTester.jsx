import React from 'react';
import {ProfilePage} from "../components/ui/userPage/HorseProfilePage.jsx";

// Function to add ID to the horse data
const addIdToHorse = (horse) => {
    return {
        id: `H${Math.floor(Math.random() * 10000)}`,
        ...horse
    };
};

const ProfileTester = () => {
    const horse = addIdToHorse({
        "name": "Midnight Star",
        "breed": "Arabian",
        "age": 7,
        "color": "Black",
        "height": "15.2 hands",
        "weight": "950 lbs",
        "gender": "Gelding",
        "birthDate": "April 15, 2018",
        "owner": "Jane Smith",
        "discipline": "Dressage",
        "registration": "AHA #123456",
        "microchipId": "985121054367289",
        "registryOrganization": "Arabian Horse Association",
        "registrationNumber": "AHA123456",
        "purchaseDate": "June 10, 2020",
        "bio": "Midnight Star is a talented and spirited Arabian with exceptional movement. He loves trail rides and has competed successfully in several local dressage events.",
        "healthStatus": "Excellent",
        "veterinarian": {
            "name": "Dr. Emily Johnson",
            "practice": "Equine Health Center",
            "contact": "(555) 123-4567"
        },
        "lastVetExam": "March 15, 2023",
        "feedType": "Premium Grain Mix & Timothy Hay",
        "feedAmount": "5 lbs grain daily, free choice hay",
        "supplements": [
            "Joint supplement",
            "Vitamin E",
            "Omega-3 oil"
        ],
        "specialDiet": "No molasses",
        "feedingNotes": "Feed twice daily, morning and evening. Add supplements to morning feed only.",
        "insurance": {
            "provider": "Equine Insurance Co.",
            "policyNumber": "EQ-98765432",
            "coverageType": "Major Medical & Mortality",
            "expirationDate": "December 31, 2023"
        },
        "vaccinations": [
            {
                "name": "Flu/Rhino",
                "date": "January 15, 2023"
            },
            {
                "name": "West Nile",
                "date": "March 1, 2023"
            },
            {
                "name": "Rabies",
                "date": "March 1, 2023"
            },
            {
                "name": "Tetanus",
                "date": "March 1, 2023"
            }
        ],
        "dentalRecords": [
            {
                "procedure": "Routine Float",
                "date": "February 12, 2023"
            },
            {
                "procedure": "Wolf Tooth Extraction",
                "date": "August 5, 2022"
            }
        ],
        "documents": {
            "Registration Papers": true,
            "Purchase Contract": true,
            "Health Certificate": true,
            "Coggins Test": true,
            "Insurance Policy": false
        }
    });

    // Mock data fetching function
    const getData = async (id) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        if (id === horse.id) {
            return horse;
        }

        throw new Error('Horse not found');
    };

    return (
        <ProfilePage
            id={horse.id}
            name={horse.name}
            imageUrl="" // Empty to test the fallback
            description={horse.bio}
            metadata={{
                breed: horse.breed,
                age: horse.age,
                discipline: horse.discipline
            }}
            stats={{
                health: horse.healthStatus,
                lastExam: horse.lastVetExam
            }}
            onDetailsClick={getData}
            loadingText="Loading horse profile..."
            notFoundText="No horse data found"
            placeholderImageUrl="/src/assets/images/profilePlaceholder.jpg"
        />
    );
};

export default ProfileTester;