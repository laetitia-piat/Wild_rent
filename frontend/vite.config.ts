import { defineConfig } from "vitest/config"; // Utilise Vitest et non Jest
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
  server: {
    allowedHosts: true,
    host: "0.0.0.0",
    hmr: { path: "/hmr" },
    watch: { usePolling: true },
  },
   resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
