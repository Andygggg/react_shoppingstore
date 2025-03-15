import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/react_shoppingstore/" : "/",
  plugins: [react()],
  build: {
    outDir: "dist",
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
