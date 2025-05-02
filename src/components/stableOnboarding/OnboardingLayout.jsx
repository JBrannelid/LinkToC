import React from "react";

const OnboardingLayout = ({
    imageSrc = "/src/assets/images/FirstLoginImage.jpg",
    imageAlt = "Horse in paddock",
    children,
    showImage = true,
    }) => {
    return(
        <div
        className="flex flex-col items-center"
        role="region"
        aria-labelledby="onboarding-title">

            {showImage && (
                <div className="w-full my-2 mx-2 sm:my-4 sm:mx-4">
                    <div className="relative">
                        <img
                            src={imageSrc}
                            alt={imageAlt}
                            className="w-full rounded-lg border border-primary"
                        />
                    </div>
                </div>
            )}
            
            <div className="w-full mt-4 sm:mt-6 mx-2 sm:mx-4">
                {children}
            </div>
        </div>      
    );
};

export default OnboardingLayout;