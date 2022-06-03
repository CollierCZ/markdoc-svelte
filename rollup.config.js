import dts from "rollup-plugin-dts";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";

export default [
  {
    input: "src/main.ts",
    output: [
      { file: "dist/main.cjs.js", format: "cjs", sourcemap: true },
      { file: "dist/main.es.js", format: "es", sourcemap: true },
    ],
    external: ["fs", "js-yaml", "@markdoc/markdoc", "markdown-it", "path"],
    plugins: [terser(), typescript()],
  },
  {
    input: "src/main.ts",
    output: [
      { file: "dist/main.es.d.ts", format: "es" },
      { file: "dist/main.cjs.d.ts", format: "cjs" },
    ],
    plugins: [dts(), nodeResolve()],
  },
];
