import React from "react";

const OnboardingLayout = ({
  imageSrc = "/src/assets/images/FirstLoginImage.jpg",
  imageAlt = "Horse in paddock",
  children,
  showImage = true,
}) => {
  return (
    <div
      className="flex flex-col items-center w-full px-4 sm:px-6 md:px-8"
      role="region"
      aria-labelledby="onboarding-title"
    >
      {showImage && (
        <div className="my-2 mx-2">
          <div className="relative">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="max-h-[50vh] sm:max-h-[55vh] md:max-h-[50vh] rounded-lg border border-primary object-cover mx-auto"
            />
          </div>
        </div>
      )}

      <div className="w-full mt-4 sm:mt-6 mx-2 sm:mx-4">{children}</div>
    </div>
  );
};

export default OnboardingLayout;
