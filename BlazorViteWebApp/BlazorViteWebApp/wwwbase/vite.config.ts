import { defineConfig } from "vite";

const path = require('path')

export default defineConfig({
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    },
  },
  build: {
    emptyOutDir: false,
    minify: "terser",
    outDir: "../wwwroot",
     
  },
});
