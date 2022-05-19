import { terser } from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: [
    { file: "dist/main.cjs.js", format: "cjs", sourcemap: true },
    { file: "dist/main.es.js", format: "es", sourcemap: true },
  ],
  external: ["js-yaml", "@markdoc/markdoc", "markdown-it"],
  plugins: [terser(), typescript()],
};
