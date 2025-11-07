import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  build: {
    // Output directory
    outDir: "dist",

    // Generate sourcemaps for debugging production builds
    sourcemap: false,

    // Reduce bundle size
    minify: "terser",

    // Terser options for better compression
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },

    // Chunk size warnings
    chunkSizeWarningLimit: 1000,

    // Rollup options for advanced bundle optimization
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // React core
          "react-vendor": ["react", "react-dom", "react-router-dom"],

          // UI libraries
          "ui-vendor": [
            "@radix-ui/react-avatar",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-label",
            "@radix-ui/react-popover",
            "@radix-ui/react-progress",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-slider",
            "@radix-ui/react-slot",
            "@radix-ui/react-switch",
            "@radix-ui/react-tabs",
            "@radix-ui/react-tooltip",
          ],

          // State management and data fetching
          "state-vendor": ["zustand", "@tanstack/react-query"],

          // Form handling
          "form-vendor": ["react-hook-form", "@hookform/resolvers", "zod"],

          // Charts and visualization
          "chart-vendor": ["recharts"],

          // Maps
          "map-vendor": ["leaflet", "react-leaflet"],

          // Utilities
          "utils-vendor": [
            "axios",
            "date-fns",
            "clsx",
            "tailwind-merge",
            "class-variance-authority",
          ],

          // Animation
          "animation-vendor": ["framer-motion"],

          // Icons
          "icon-vendor": ["lucide-react"],
        },

        // Naming pattern for chunks
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split("/").pop()
            : "chunk";
          return `assets/js/[name]-[hash].js`;
        },

        // Naming pattern for entry files
        entryFileNames: "assets/js/[name]-[hash].js",

        // Naming pattern for assets
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) {
            return `assets/[name]-[hash][extname]`;
          }

          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];

          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash].${ext}`;
          }

          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash].${ext}`;
          }

          return `assets/[name]-[hash].${ext}`;
        },
      },
    },

    // Enable CSS code splitting
    cssCodeSplit: true,

    // Asset inline limit (smaller assets will be inlined as base64)
    assetsInlineLimit: 4096, // 4kb
  },

  // Optimizations for dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
      "zustand",
      "axios",
    ],
    exclude: ["@groq/sdk"], // Exclude if causing issues
  },

  // Preview server configuration
  preview: {
    port: 4173,
    strictPort: true,
  },

  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});
