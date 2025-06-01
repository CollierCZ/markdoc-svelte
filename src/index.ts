export { markdocPreprocess } from "./main.ts";
// The markdoc alias is maintained for backward compatibility.
// It can be removed in a future major version.
export { markdocPreprocess as markdoc } from "./main.ts";
export type { MarkdocModule } from "./types.ts";

export { default as Markdoc } from "@markdoc/markdoc";
export type { Config } from "@markdoc/markdoc";