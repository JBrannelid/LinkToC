import React from "react";
import SettingIcon from "../../assets/icons/SettingIcon.jsx";
import ModalHeader from "../layout/ModalHeader.jsx";

const OnboardingLayout = ({
    title,
    imageSrc = "/src/assets/images/FirstLoginImage.jpg",
    imageAlt = "Horse in paddock",
    children,
    }) => {
    return(
        <div
        className="flex flex-col items-center"
        role="region"
        aria-labelledby="onboarding-title">
            <ModalHeader 
                title={title}
                id="onboarding-title"
                showSettingBtn={true}
                settingBtn={<SettingIcon strokeWidth={9} className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />}
            settingAriaLabel="Open Settings"
            className="w-full"/>
            
            <div className="w-full my-2 mx-2 sm:my-4 sm:mx-4">
                <div className="relative">
                    <img src={imageSrc} 
                         alt={imageAlt}
                    className="w-full rounded-lg border border-primary"/>
                </div>
            </div>
            
            <div className="w-full mt-4 sm:mt-6 mx-2 sm:mx-4">
                {children}
            </div>
        </div>      
    );
};

export default OnboardingLayout;