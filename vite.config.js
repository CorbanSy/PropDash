//levlpro-mvp\vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],

  // Dynamic base: "/" for dev, "/PropDash" (or env var) for production build
  base:
    command === "build"
      ? process.env.VITE_BASE_PATH || "/PropDash"
      : "/",

  // Add this to use port 5173 (already allowed by Supabase)
  server: {
    port: 5173,
  },
}));