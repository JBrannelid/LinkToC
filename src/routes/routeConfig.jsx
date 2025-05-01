import React from "react";
import { Navigate } from "react-router";
import { ROUTES } from "./routeConstants";

// Pages components
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegistrationPage from "../pages/RegistrationPage";
import StableSelectionPage from "../pages/StableSelectionPage";
import HorseProfilePage from "../pages/HorseProfilePage";
import ErrorPage from "../pages/ErrorPage";
import SettingsPage from "../pages/SettingsPage";
import StablePostPage from "../pages/StablePostPage";
import UserProfilePage from "../pages/UserProfilePage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import NotificationPage from "../pages/NotificationPage";

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
    path: ROUTES.RESET_PASSWORD,
    element: <ResetPasswordPage />,
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: <ForgotPasswordPage />,
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
    path: ROUTES.STABLE_POST,
    element: <StablePostPage />,
    requiresStable: false,
  },
  {
    path: ROUTES.HORSE_PROFILE,
    element: <HorseProfilePage />,
    requiresStable: true,
  },
  {
    path: ROUTES.SETTINGS,
    element: <SettingsPage />,
    requiresStable: true,
  },
  {
    path: ROUTES.USER_PROFILE,
    element: <UserProfilePage />,
    requiresStable: true,
  },
  {
    path: ROUTES.NOTOFICATIONS,
    element: <NotificationPage />,
    requiresStable: true,
  },
];

// Error handling
export const errorRoute = {
  path: "*",
  element: <ErrorPage />,
};
