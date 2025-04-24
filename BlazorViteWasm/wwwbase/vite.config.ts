import { defineConfig } from "vite";

export default defineConfig({
  build: {
    emptyOutDir: false,
    minify: "terser",
    outDir: "../wwwroot",
     
  },
});
