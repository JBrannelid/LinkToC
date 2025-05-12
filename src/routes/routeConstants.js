export const ROUTES = {
  HOME: "/home",
  LOGIN: "/login",
  REGISTER: "/register",
  SELECT_STABLE: "/select-stable",
  USER_PROFILE: "/userpage/:userId",
  STABLE: "/stable/:stableId",
  STABLE_POST: "/stablePost/:stableId",
  SETTINGS: "/settings",
  RESET_PASSWORD: "/reset-password",
  FORGOT_PASSWORD: "/forgot-password",
  STABLE_ONBOARDING: "/stable-onboarding",
  NOTIFICATIONS: "/notifications",
  STABLE_HORSES: "/stable-horses/:stableId",
  MANAGE_STABLE: "/manage-stable",
  STABLE_REQUESTS: "/stable-requests",
};

// Dynamic routes with params
export const buildRoute = (route, params = {}) => {
  let path = route;
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, value);
  });
  return path;
};
