import React from "react";

const AuthFormContainer = ({ children, title, subtitle }) => {
  return (
    <div className="flex justify-center px-4 py-6 w-full">
      <div className="w-full max-w-md p-4 sm:p-5 rounded-sm shadow-lg bg-white bg-opacity-70">
        {title}
        {subtitle && <p className="text-sm lg:text-base mt-2">{subtitle}</p>}

        {children}
      </div>
    </div>
  );
};

export default AuthFormContainer;
