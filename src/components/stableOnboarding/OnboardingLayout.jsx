import React from "react";

const OnboardingLayout = ({
  imageSrc = "/src/assets/images/FirstLoginImage.jpg",
  imageAlt = "Horse in paddock",
  children,
  showImage = true,
}) => {
  return (
    <div
      className="flex flex-col items-center max-h-screen px-10 sm:px-20 md:px-30"
      role="region"
      aria-labelledby="onboarding-title"
    >
      {showImage && (
        <div className="w-full my-2 mx-2">
          <div className="relative">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full max-h-[56vh] sm:max-h-[50vh] md:max-h-[55vh] rounded-lg border border-primary object-cover"
            />
          </div>
        </div>
      )}

      <div className="w-full mt-4 sm:mt-6 mx-2 sm:mx-4">{children}</div>
    </div>
  );
};

export default OnboardingLayout;
