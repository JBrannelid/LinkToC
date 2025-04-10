import React from 'react';
import { CardContainer, CardHeader, CardBody, CardFooter, CardTitle, CardSubtitle, CardImage } from './';

export const ProfileCard = ({
                                name,
                                breed,
                                discipline,
                                imageUrl,
                                placeholderImageUrl,
                                healthStatus,
                                children,
                                onDetailsClick
                            }) => {
    return (
        <CardContainer className="h-full flex flex-col">
            <CardImage
                src={imageUrl}
                alt={`${name} - ${breed} horse`}
                fallbackSrc={placeholderImageUrl}
                className="h-48 sm:h-64"
            />
            <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardSubtitle>{breed} • {discipline}</CardSubtitle>
            </CardHeader>
            <CardBody className="flex-grow">
                <div className="mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium
            ${healthStatus === 'Excellent' ? 'bg-green-100 text-green-800' :
              healthStatus === 'Good' ? 'bg-blue-100 text-blue-800' :
                  healthStatus === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
          }`}>
            {healthStatus}
          </span>
                </div>
                {children}
            </CardBody>
            <CardFooter>
                <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    onClick={onDetailsClick}
                    aria-label={`View details for ${name}`}
                >
                    View Details
                </button>
            </CardFooter>
        </CardContainer>
    );
};