import { ROUTES  } from "../../../routes/index";
import stableSearchConfig from "./stableSearchConfig";
import horseSearchConfig from './horseSearchConfig';
import userSearchConfig from './userSearchConfig';

const routeConfigMap = {
    [ROUTES.STABLE_ONBOARDING]: stableSearchConfig,
    
    [ROUTES.HORSE_PROFILE]: horseSearchConfig,
    
    [ROUTES.USER_PROFILE]: userSearchConfig,
};

export const searchConfigs = {
    stable: stableSearchConfig,
    horse: horseSearchConfig,
    user: userSearchConfig,
};

export const getConfigForRoutes = (route) => {
    if (routeConfigMap[route]) {
        return routeConfigMap[route];
    }
    
    for (const [baseRoute, config] of Object.entries(routeConfigMap)) {
        if (route.startsWith(baseRoute) && baseRoute !== ROUTES.HOME) {
            return config;
        }
    }
    
    if (route.includes('/horses')) {
        return searchConfigs.horse;
    }
    
    if (route.includes('/users')) {
        return searchConfigs.user;
    }
    
    if(route.includes('/stable')) {
        return searchConfigs.stable;
    }
    return searchConfigs.stable;
};

export const registerSearchConfig = (key, config) => {
    searchConfigs[key] = config;
};

export const registerRouteConfig = (route, configOrKey) => {
    const config = typeof configOrKey === "string" ? searchConfigs[configOrKey] : configOrKey;
    
    if(!config) {
        console.warn(`Could not register route ${route} - config not found!`);
        return;
    }
    routeConfigMap[route] = config;
};
export default searchConfigs;
