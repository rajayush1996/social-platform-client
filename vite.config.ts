import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
   base: '/', 
  server: {
    host: "::",
    port: 8085,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/videojs-ima")) {
            return "videojs-ima";
          }

          if (id.includes("node_modules/videojs-contrib-ads")) {
            return "videojs-contrib-ads";
          }

          return undefined;
        },
      },
    },
  },
}));
