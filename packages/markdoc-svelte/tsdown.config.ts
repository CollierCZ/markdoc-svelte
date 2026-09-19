import { defineConfig } from "tsdown";

export default defineConfig({
  entry: { main: "src/index.ts" },
  format: ["cjs", "esm"],
  deps: {
    neverBundle: ["@markdoc/markdoc", "fs", "path", "svelte", "vite", "yaml"],
  },
  sourcemap: true,
  minify: true,
  dts: true,
  outputOptions: { exports: "named" },
});
