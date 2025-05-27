import React from "react";
import { createBrowserRouter } from "react-router";
import App from "../App";
import { publicRoutes, protectedRoutes, errorRoute } from "./routeConfig";
import { ROUTES, buildRoute } from "./routeConstants";
import { createProtectedRoutes } from "./routeUtils";

// eslint-disable-next-line react-refresh/only-export-components
export { ROUTES, buildRoute };

// Create and export the router configuration
// eslint-disable-next-line react-refresh/only-export-components
export const createAppRouter = () => {
  return createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: errorRoute.element,
      children: [...publicRoutes, ...createProtectedRoutes(protectedRoutes)],
    },
  ]);
};

// Export a pre-configured router instance
// eslint-disable-next-line react-refresh/only-export-components
export const router = createAppRouter();
