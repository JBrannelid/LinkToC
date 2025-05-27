import React from "react";
import { createBrowserRouter } from "react-router";
import App from "../App";
import { publicRoutes, protectedRoutes, errorRoute } from "./routeConfig";
import { ROUTES, buildRoute } from "./routeConstants";
import { createProtectedRoutes } from "./routeUtils";

export { ROUTES, buildRoute };

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
