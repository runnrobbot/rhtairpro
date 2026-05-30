import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Rolldown (Vite 8) requires manualChunks as a function
        manualChunks(id) {
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/react-router-dom/") || id.includes("node_modules/react-router/")) {
            return "vendor-router";
          }
          if (id.includes("node_modules/firebase/")) {
            // Split Firebase into sub-packages
            if (id.includes("/auth")) return "vendor-firebase-auth";
            if (id.includes("/firestore")) return "vendor-firebase-firestore";
            return "vendor-firebase-core";
          }
          if (id.includes("node_modules/lucide-react/")) {
            return "vendor-lucide";
          }
        },
      },
    },
  },
});
