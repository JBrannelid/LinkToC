import React from "react";
import { createBrowserRouter } from "react-router";
import App from "../App";
import { publicRoutes, protectedRoutes, errorRoute } from "./routeConfig";
import { createProtectedRoutes } from "./routeUtils";
import { ROUTES, buildRoute } from "./routeConstants";

export { ROUTES, buildRoute };
export { default as ProtectedRoute } from "./ProtectedRoute";

// Create and export the router configuration
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
export const router = createAppRouter();
