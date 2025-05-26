import React, { Suspense } from "react";
import { Navigate } from "react-router";
import { ROUTES } from "./routeConstants";
import PageLoader from "../components/ui/PageLoader";
import ErrorPage from "../pages/ErrorPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import { USER_ROLES } from "../utils/userUtils";

// Pages import with lazy loading
const RegistrationPage = React.lazy(() => import("../pages/RegistrationPage"));
const StableSelectionPage = React.lazy(() =>
  import("../pages/StableSelectionPage")
);
const HorseProfilePage = React.lazy(() => import("../pages/HorseProfilePage"));
const StablePostPage = React.lazy(() => import("../pages/StablePostPage"));
const ListUserStablePage = React.lazy(() =>
  import("../pages/ListUserStablePage")
);
const ResetPasswordPage = React.lazy(() =>
  import("../pages/ResetPasswordPage")
);
const ForgotPasswordPage = React.lazy(() =>
  import("../pages/ForgotPasswordPage")
);
const StableOnboardingPage = React.lazy(() =>
  import("../pages/StableOnboardingPage.jsx")
);
const NotificationPage = React.lazy(() => import("../pages/NotificationPage"));
const StableManagementPage = React.lazy(() =>
  import("../pages/StableManagementPage")
);
const StableRequestsPage = React.lazy(() =>
  import("../pages/StableRequestsPage.jsx")
);
const StableHorsePage = React.lazy(() =>
  import("../pages/StableHorsePage.jsx")
);
const UserProfilePage = React.lazy(() =>
  import("../pages/UserProfilePage.jsx")
);
const HorseManagementPage = React.lazy(() =>
  import("../pages/HorseManagementPage")
);
const SettingsRouter = React.lazy(() =>
  import("../components/settings/SettingsRouter")
);

// Wrap component with React-Suspense
const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>{Component}</Suspense>
);

// Public Routes
export const publicRoutes = [
  {
    path: ROUTES.LOGIN,
    element: withSuspense(<LoginPage />),
  },
  {
    path: ROUTES.REGISTER,
    element: withSuspense(<RegistrationPage />),
  },
  {
    path: ROUTES.RESET_PASSWORD,
    element: withSuspense(<ResetPasswordPage />),
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: withSuspense(<ForgotPasswordPage />),
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
    element: withSuspense(<HomePage />),
    requiresStable: true,
  },
  {
    path: ROUTES.SELECT_STABLE,
    element: withSuspense(<StableSelectionPage />),
    requiresStable: false,
  },
  {
    path: ROUTES.STABLE_POST,
    element: withSuspense(<StablePostPage />),
    requiresStable: true,
  },
  {
    path: ROUTES.STABLE_MEMBERS,
    element: withSuspense(<ListUserStablePage />),
    requiresStable: true,
  },
  {
    path: ROUTES.NOTIFICATIONS,
    element: withSuspense(<NotificationPage />),
    requiresStable: true,
  },
  {
    path: ROUTES.SETTINGS,
    element: withSuspense(<SettingsRouter />),
    requiresStable: false,
  },
  {
    path: ROUTES.STABLE_ONBOARDING,
    element: withSuspense(<StableOnboardingPage />),
    requiresStable: false,
  },
  {
    path: ROUTES.STABLE_HORSES,
    element: withSuspense(<StableHorsePage />),
    requiresStable: true,
  },
  {
    path: ROUTES.MANAGE_STABLE,
    element: withSuspense(<StableManagementPage />),
    requiresStable: true,
    requiredRoles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
  },
  {
    path: ROUTES.MANAGE_HORSES,
    element: withSuspense(<HorseManagementPage />),
    requiresStable: true,
    requiredRoles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
  },
  {
    path: ROUTES.STABLE_REQUESTS,
    element: withSuspense(<StableRequestsPage />),
    requiresStable: false,
  },
  // Remove duplicate NOTIFICATIONS route
  {
    path: ROUTES.USER_PROFILE,
    element: withSuspense(<UserProfilePage />),
    requiresStable: true,
  },
  // Remove duplicate USER_PROFILE route
  {
    path: ROUTES.HORSE_PROFILE,
    element: withSuspense(<HorseProfilePage />),
    requiresStable: true,
  },
];

// Error handling
export const errorRoute = {
  path: "*",
  element: withSuspense(<ErrorPage />),
};
