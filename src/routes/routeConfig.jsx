import React from "react";
import { Navigate } from "react-router";
import { ROUTES } from "./routeConstants";

// Pages components
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegistrationPage from "../pages/RegistrationPage";
import StableSelectionPage from "../pages/StableSelectionPage";
import ProfilePage from "../pages/ProfileTester";
import ErrorPage from "../pages/ErrorPage";

// Public Routes
export const publicRoutes = [
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.REGISTER,
    element: <RegistrationPage />,
  },
  {
    path: "/",
    element: <Navigate to={ROUTES.LOGIN} replace />,
  },
];

// Protected Routes
export const protectedRoutes = [
  {
    path: ROUTES.HOME,
    element: <HomePage />,
    requiresStable: true,
  },
  {
    path: ROUTES.SELECT_STABLE,
    element: <StableSelectionPage />,
    requiresStable: false,
  },
  {
    path: ROUTES.HORSE_PROFILE,
    element: <ProfilePage />,
    requiresStable: true,
  },
];

// Error handling
export const errorRoute = {
  path: "*",
  element: <ErrorPage />,
};
