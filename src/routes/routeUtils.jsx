import React from "react";
import ProtectedRoute from "./ProtectedRoute";

// Converts a route config into a protected route by wrapping it in <ProtectedRoute>, applying stable checks if required
export const createProtectedRoute = (routeConfig) => {
  const { element, requiresStable, ...rest } = routeConfig;

  return {
    ...rest,
    element: (
      <ProtectedRoute requiresStable={requiresStable}>{element}</ProtectedRoute>
    ),
  };
};

export const createProtectedRoutes = (routes) => {
  return routes.map(createProtectedRoute);
};

export const isRouteActive = (routePath, currentPath) => {
  // /route/:id", check the base part
  if (routePath.includes("/:")) {
    return currentPath.startsWith(routePath.split("/:")[0]);
  }
  // For exact paths
  return currentPath.startsWith(routePath);
};
