import dts from "rollup-plugin-dts";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

export default [
  {
    input: "src/index.ts",
    output: [
      { file: "dist/main.cjs.js", format: "cjs", sourcemap: true },
      { file: "dist/main.mjs", format: "esm", sourcemap: true },
    ],
    external: ["fs", "js-yaml", "@markdoc/markdoc", "markdown-it", "path"],
    plugins: [typescript(), nodeResolve(), terser()],
  },
  {
    input: "src/index.ts",
    output: [{ file: "dist/main.d.ts" }],
    plugins: [dts(), nodeResolve()],
  },
];
