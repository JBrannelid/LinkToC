import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import compression from "vite-plugin-compression";

// Build project by code-split the application for better performance
export default defineConfig({
  base: "/",
  assetsInclude: ["**/*.woff", "**/*.woff2"],
  server: {
    host: "0.0.0.0",
    allowedHosts: ["g10-main.cc25.chasacademy.dev"], // Lägg till din domän här
    middlewareMode: false,
    cors: true,
    hmr: true,
    compress: true,
  },
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
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Group React and core dependencies
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react-router")
          ) {
            return "vendor-react";
          }

          // Group form-related dependencies
          if (id.includes("node_modules/react-hook-form")) {
            return "vendor-forms";
          }

          // Group UI components
          if (id.includes("/components/ui/")) {
            return "ui-components";
          }

          // Group form components
          if (id.includes("/components/forms/")) {
            return "form-components";
          }
        },
      },
    },
    cssCodeSplit: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
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
