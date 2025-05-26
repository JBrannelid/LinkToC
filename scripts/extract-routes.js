import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your routeConstants.js file - adjust based on your file structure
const routeConstantsPath = path.resolve("src/routes/routeConstants.js");

export function extractRoutes() {
  try {
    // Check if the file exists
    if (!fs.existsSync(routeConstantsPath)) {
      console.warn(`Route constants file not found at ${routeConstantsPath}`);
      return null;
    }

    const content = fs.readFileSync(routeConstantsPath, "utf8");

    // Extract ROUTES object using regex
    const routesMatch = content.match(/export const ROUTES = {([^}]*)}/s);
    if (!routesMatch || !routesMatch[1]) {
      console.warn("Could not extract routes, using default public routes");
      return null;
    }

    // Parse the ROUTES object
    const ROUTES = {};
    const routePairs = routesMatch[1].split(",").map((pair) => pair.trim());

    routePairs.forEach((pair) => {
      if (!pair) return;

      // Split by colon and handle potential quotes
      const parts = pair.split(":").map((part) => part.trim());
      if (parts.length !== 2) return;

      const key = parts[0].replace(/['"]/g, "");
      const value = parts[1].replace(/['"]/g, "");

      ROUTES[key] = value;
    });

    return ROUTES;
  } catch {
    return null;
  }
}
