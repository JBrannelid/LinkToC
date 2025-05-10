import React from "react";
import { Navigate } from "react-router";
import { ROUTES } from "./routeConstants";
import { USER_ROLES } from "../context/AppContext";
import SettingsRouter from "../components/settings/SettingsRouter";

// Pages components
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegistrationPage from "../pages/RegistrationPage";
import StableSelectionPage from "../pages/StableSelectionPage";
import HorseProfilePage from "../pages/HorseProfilePage";
import ErrorPage from "../pages/ErrorPage";
import StablePostPage from "../pages/StablePostPage";
import UserProfilePage from "../pages/UserProfilePage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import StableOnboardingPage from "../pages/StableOnboardingPage.jsx";
import NotificationPage from "../pages/NotificationPage";
import StableManagementPage from "../pages/StableManagementPage";
import StableRequestsPage from "../pages/StableRequestsPage.jsx";

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
    requiresStable: true,
  },
  {
    path: ROUTES.HORSE_PROFILE,
    element: <HorseProfilePage />,
    requiresStable: true,
  },
  {
    path: ROUTES.USER_PROFILE,
    element: <UserProfilePage />,
    requiresStable: true,
  },
  {
    path: ROUTES.NOTIFICATIONS,
    element: <NotificationPage />,
    requiresStable: true,
  },
  {
    path: ROUTES.SETTINGS,
    element: <SettingsRouter />,
    requiresStable: false,
  },
  {
    path: ROUTES.STABLE_ONBOARDING,
    element: <StableOnboardingPage />,
    requiresStable: false,
  },
  {
    path: ROUTES.MANAGE_STABLE,
    element: <StableManagementPage />,
    requiresStable: true,
    requiredRoles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
  },
  {
    path: ROUTES.STABLE_REQUESTS,
    element: <StableRequestsPage />,
    requiresStable: false,
  },
];

// Error handling
export const errorRoute = {
  path: "*",
  element: <ErrorPage />,
};
