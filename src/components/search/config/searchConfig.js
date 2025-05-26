import {
    createStableSearchConfig,
} from './entityBuilder.js';
import {ROUTES} from "../../../routes/index";

const stableSearchConfig = createStableSearchConfig();
const routeConfigMap = {
    [ROUTES.STABLE_ONBOARDING]: stableSearchConfig,

};

export const searchConfigs = {
    stable: stableSearchConfig,
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


    if (route.includes('/stable')) {
        return searchConfigs.stable;
    }
    return searchConfigs.stable;
};
export default searchConfigs;
