import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";
import tailwindcss from "@tailwindcss/vite";

// Build project by code-split the application for better performance
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tailwindcss(),
    // gzip for better support across browsers and good balance between compression ratio and speed
    compression({
      algorithm: "gzip",
      ext: ".gz",
      filter: /\.(js|css|html|svg)$/i,
      threshold: 1024, // Only compress files larger than 1KB
      deleteOriginFile: false, // Keep original files alongside compressed ones
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        // Codesplit React and Lucide-icons reduce initial loading time
        manualChunks: {
          // Core React dependencies
          "react-core": ["react", "react-dom"],
          // Icons
          "lucide-icons": ["lucide-react"],
        },
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
