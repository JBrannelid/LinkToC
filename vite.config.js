import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";
import tailwindcss from "@tailwindcss/vite";

// Build project by code-split the application for better performance
export default defineConfig({
  base: "/",
  assetsInclude: ["**/*.woff", "**/*.woff2"],
  plugins: [
    react(),
    tailwindcss(),
    // gzip for better support across browsers
    compression({
      algorithm: "gzip",
      ext: ".gz",
      filter: /\.(js|css|html|svg)$/i,
      threshold: 1024,
      deleteOriginFile: false,
      compressionOptions: { level: 6 }, // compression level 6 out of 9
      verbose: true,
      disable: false,
    }),
    // brotliCompress - better performance with compatible browsers
    compression({
      algorithm: "brotliCompress",
      ext: ".br",
      filter: /\.(js|css|html|svg|json)$/i,
      compressionOptions: { level: 4 }, // Compression level 4 out of 11
      threshold: 1024,
      deleteOriginFile: false,
      verbose: true,
      disable: false,
    }),
  ],
  // Configure the development server to use compression
  server: {
    middlewareMode: false,
    cors: true,
    hmr: true,
    compress: true,
  },
  define: {
    "process.env": process.env,
  },
  build: {
    rollupOptions: {
      manualChunks: {
        vendor: ["react", "react-router", "react-hook-form"],
        ui: ["../components/ui/"],
      },
    },
    cssCodeSplit: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 800,
    minify: "terser",
    terserOptions: {
      // Remove console message in production
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
