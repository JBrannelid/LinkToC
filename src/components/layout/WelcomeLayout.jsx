import React from "react";

const LOGIN_PAGE_BACKGROUND = "/src/assets/images/BgLoginDesktop.webp";
const LOGIN_BG_ALT_TEXT = "Abstract padlock background - mobile view";

const WelcomeLayout = ({ children }) => {
  return (
    <>
      {/* Main layout */}
      <div className="md:hidden min-h-screen relative overflow-hidden">
        {/* Full-size background image container */}
        <div className="absolute inset-0 z-0">
          {/* Vertical overlay for mobile */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/90 z-10"></div>
          <img
            src={LOGIN_PAGE_BACKGROUND}
            alt={LOGIN_BG_ALT_TEXT}
            className="absolute w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Content overlay  */}
        <div className="relative z-20 flex flex-col min-h-screen">
          {/* Logo/header area taking up top 40% of mobile screen */}
          <div className="flex-none h-[40vh] flex items-end justify-center pb-6">
            <div className="bg-light/20 backdrop-blur-[2px] backdrop-brightness-120 px-6 py-2 rounded-sm shadow-sm">
              <h1 className="text-3xl text-black">EQUILOG</h1>
            </div>
          </div>

          {/* Form content area */}
          <div className="flex-1 bg-white/70 backdrop-blur-sm rounded-t-3xl shadow-lg px-4 py-4">
            <div className="w-full max-w-md mx-auto">{children}</div>
          </div>
        </div>
      </div>

      {/* Desktop  */}
      <div className="hidden md:block md:min-h-screen relative overflow-hidden">
        {/* Background  */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/10 to-transparent z-10"></div>
          <img
            src={LOGIN_PAGE_BACKGROUND}
            alt={LOGIN_BG_ALT_TEXT}
            className="absolute w-full h-full object-cover"
          />
        </div>

        {/* Content  */}
        <div className="relative z-20 grid grid-cols-8 min-h-screen">
          {/* Form area that extends over the image */}
          <div className="col-span-4 bg-white/70 backdrop-blur-sm flex flex-col justify-center items-center px-8 py-12 rounded-r-3xl shadow-2xl">
            <div className="w-full max-w-md mt-20">
              <h1 className="absolute top-10 left-15 text-3xl">Equilog</h1>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomeLayout;
