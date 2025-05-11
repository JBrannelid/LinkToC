import React from "react";

// Layout component for authentication pages (login, register, etc.)
const WelcomeLayout = ({ children }) => {
  return (
    <>
      {/* Default - Render children (register/forgott password ect) */}
      <div className="lg:hidden relative">{children}</div>

      {/* Desktop - Split screen */}
      <div className="hidden lg:grid lg:grid-cols-8 lg:min-h-screen">
        <div className="lg:col-span-5 bg-gray-100 flex flex-col justify-center items-center px-8 py-12">
          <div className="w-full max-w-md mt-20">
            <h1 className="absolute top-10 left-15 text-3xl">Equilog</h1>
            {children}
          </div>
        </div>

        {/* Right side - Image section */}
        <div className="lg:col-span-2 relative">
          <img
            src="/src/assets/images/LoginBackgroundImage.jpg"
            alt="Horses grazing in a field"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        {/* Empty space */}
        <div className="lg:col-span-1"></div>
      </div>
    </>
  );
};

export default WelcomeLayout;
