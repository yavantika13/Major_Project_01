import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Backend (Member 2) localhost:5000 par chale to /api calls proxy ho jayengi
    proxy: { "/api": "http://localhost:5000" },
  },
});
