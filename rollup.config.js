import dts from "rollup-plugin-dts";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default [
  {
    input: "src/index.ts",
    output: [
      { 
        file: "dist/main.cjs.js", 
        format: "cjs", 
        sourcemap: true,
        exports: "named"
      },
      { 
        file: "dist/main.mjs", 
        format: "esm", 
        sourcemap: true,
        exports: "named"
      },
    ],
    external: ["@markdoc/markdoc", "fs", "path", "svelte", "vite", "yaml"],
    plugins: [
      typescript({
        sourceMap: true,
        inlineSources: true
      }), 
      nodeResolve(),
      terser()
    ],
  },
  {
    input: "src/index.ts",
    output: [{ file: "dist/main.d.ts" }],
    plugins: [dts(), nodeResolve()],
  },
];
