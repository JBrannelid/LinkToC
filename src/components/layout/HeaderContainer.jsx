import React from "react";
import { useLocation } from "react-router";
import Header from "./Header";
import { ROUTES } from "../../routes/index.jsx";

// A wrapper component that applies the appropriate background to the header
const HeaderContainer = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Check if current path should have primary-light bg for header
  const routesWithPrimaryLightBg =
    currentPath === ROUTES.SETTINGS ||
    currentPath.startsWith("/userpage/") ||
    currentPath.startsWith("/horse-page/") ||
    currentPath.startsWith("/stable-requests") ||
    currentPath.startsWith("/select-stable") ||
    currentPath.startsWith("/stable-horses") ||
    currentPath.startsWith("/stable-members") ||
    currentPath.startsWith("/manage-horses") ||
    currentPath.startsWith("/manage-stable");

  const backgroundClass = routesWithPrimaryLightBg ? "bg-primary-light" : "";

  return (
    <div className={backgroundClass}>
      <Header />
    </div>
  );
};

export default HeaderContainer;
