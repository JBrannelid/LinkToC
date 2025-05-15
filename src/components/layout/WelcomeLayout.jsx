import React from "react";

const WelcomeLayout = ({ children }) => {
  return (
    <>
      {/* Mobile layout - unchanged */}
      <div className="lg:hidden relative">{children}</div>

      {/* Desktop - Overlay design with image fade */}
      <div className="hidden lg:block lg:min-h-screen relative overflow-hidden">
        {/* Background image with gradient fade effect */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/10 to-transparent z-10"></div>
          <img
            src="/src/assets/images/BgLoginDesktop.jpg"
            alt="Abstract padlock background"
            className="absolute w-full h-full object-cover "
          />
        </div>

        {/* Content overlay */}
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
