import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      "e8ff2ee9-39a4-4f27-a792-741d3900a3b5.lovableproject.com"
    ],
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      crypto: 'crypto-browserify',
    },
  },
  define: {
    global: 'globalThis',
  },
  assetsInclude: ['**/*.csv', '**/*.xlsx', '**/*.xls'],
}));
