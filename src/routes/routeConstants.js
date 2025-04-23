export const ROUTES = {
  HOME: "/home",
  LOGIN: "/login",
  REGISTER: "/register",
  SELECT_STABLE: "/select-stable",
  HORSE_PROFILE: "/horsepage/:horseId",
  USER_PROFILE: "/userpage/:userId",
  STABLE: "/stable/:stableId",
};

// Dynamic routes with params
export const buildRoute = (route, params = {}) => {
  let path = route;
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, value);
  });
  return path;
};
