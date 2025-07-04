import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // react_shoppingstore github deploy
  base: process.env.NODE_ENV === "production" ? "/" : "/",
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console']: []
  },
  server: {
    open: true,
    host: "127.0.0.1",
    port: 8078,
    proxy: undefined,
    cors: true,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
});
