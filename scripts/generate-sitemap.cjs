import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractRoutes } from './extract-routes.js';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const domain = 'http://localhost:5173'; // Update with your actual domain when ready
const outputPath = path.resolve('public/sitemap.xml');

// Get today's date for lastmod
const today = new Date().toISOString().split('T')[0];

// Generate the sitemap
async function generateSitemap() {
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
(async () => {
    await generateSitemap();
})();