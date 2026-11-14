import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  base: "/lotorium/",
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/node_modules/gsap/")) return "scroll-animation";
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id))
            return "react-vendor";
        },
      },
    },
  },
});
