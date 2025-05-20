const fs = require('fs');
const path = require('path');

// Configuration
const domain = 'http://localhost:5173'; // Update with your actual domain when ready
const outputPath = path.resolve('public/sitemap.xml');
const routeConstantsPath = path.resolve('src/routes/routeConstants.js');

// Get today's date for lastmod
const today = new Date().toISOString().split('T')[0];

// Extract routes from route constants file
function extractRoutes() {
    try {
        // Check if the file exists
        if (!fs.existsSync(routeConstantsPath)) {
            console.warn(`Route constants file not found at ${routeConstantsPath}`);
            return null;
        }

        const content = fs.readFileSync(routeConstantsPath, 'utf8');

        // Extract ROUTES object using regex
        const routesMatch = content.match(/export const ROUTES = {([^}]*)}/s);
        if (!routesMatch || !routesMatch[1]) {
            console.warn('Could not extract routes, using default public routes');
            return null;
        }

        // Parse the ROUTES object
        const ROUTES = {};
        const routePairs = routesMatch[1].split(',').map(pair => pair.trim());

        routePairs.forEach(pair => {
            if (!pair) return;

            // Split by colon and handle potential quotes
            const parts = pair.split(':').map(part => part.trim());
            if (parts.length !== 2) return;

            const key = parts[0].replace(/['"]/g, '');
            const value = parts[1].replace(/['"]/g, '');

            ROUTES[key] = value;
        });

        console.log('Successfully extracted routes:', Object.keys(ROUTES).length);
        return ROUTES;
    } catch (error) {
        console.error('Error extracting routes:', error);
        return null;
    }
}

// Generate the sitemap
function generateSitemap() {
    try {
        console.log('Generating sitemap...');

        // Define your public routes
        let routes = extractRoutes();
        const publicRoutes = routes ?
            [routes.LOGIN, routes.REGISTER, routes.RESET_PASSWORD, routes.FORGOT_PASSWORD, '/'] :
            ['/login', '/register', '/reset-password', '/forgot-password', '/'];

        // Create URL entries for static routes
        const staticUrls = publicRoutes.map(route => ({
            loc: `${domain}${route}`,
            lastmod: today,
            changefreq: 'monthly',
            priority: route === '/' ? 1.0 : 0.8
        }));

        // Generate XML
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

        // Create directory if it doesn't exist
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Write to file
        fs.writeFileSync(outputPath, sitemap);
        console.log(`Sitemap generated at ${outputPath} with ${staticUrls.length} URLs`);
    } catch (error) {
        console.error('Error generating sitemap:', error);
        process.exit(1);
    }
}

// Run the generator
generateSitemap();