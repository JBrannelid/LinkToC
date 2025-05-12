import {ROUTES} from "../../../routes/index";
import {
    createStableSearchConfig,
    createHorseSearchConfig,
    createUserSearchConfig
} from './entityBuilder.js';

const stableSearchConfig = createStableSearchConfig();
const horseSearchConfig = createHorseSearchConfig();
const userSearchConfig = createUserSearchConfig();
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

    if (route.includes('/stable')) {
        return searchConfigs.stable;
    }
    return searchConfigs.stable;
};
export default searchConfigs;
