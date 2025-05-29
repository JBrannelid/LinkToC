// eslint-disable-next-line import/no-unresolved
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import compression from "vite-plugin-compression";

export default defineConfig({
  base: "/",
  assetsInclude: [
    "**/*.woff",
    "**/*.woff2",
    "**/*.png",
    "**/*.jpg",
    "**/*.jpeg",
    "**/*.svg",
    "**/*.gif",
    "**/*.webp", // WebP support
  ],
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
    tailwindcss(),
    compression({
      algorithm: "gzip",
      ext: ".gz",
      filter: /\.(js|css|html|svg|webp)$/i,
      threshold: 1024,
      deleteOriginFile: false,
      compressionOptions: { level: 6 },
      verbose: true,
      disable: false,
    }),
    compression({
      algorithm: "brotliCompress",
      ext: ".br",
      filter: /\.(js|css|html|svg|json|webp)$/i,
      compressionOptions: { level: 4 },
      threshold: 1024,
      deleteOriginFile: false,
      verbose: true,
      disable: false,
    }),
  ],
  server: {
    middlewareMode: false,
    cors: true,
    hmr: true,
    compress: true,
  },
  build: {
    target: "esnext",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]",
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-router": ["react-router"],
          "vendor-forms": ["react-hook-form"],
        },
      },
    },
    cssCodeSplit: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    minify: "esbuild",
  },
});
