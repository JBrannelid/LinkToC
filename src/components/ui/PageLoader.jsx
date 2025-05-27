import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const PageLoader = () => (
  <div className="flex justify-center items-center h-screen">
    <LoadingSpinner size="large" className="text-primary" />
  </div>
);

export default PageLoader;
