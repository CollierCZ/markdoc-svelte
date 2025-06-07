import type { Config } from "@markdoc/markdoc";
import type { Component } from "svelte";

import type { Heading } from "./headings";

/**
 * The validation levels for the preprocessor.
 */
export type ValidationLevel =
  | "debug"
  | "info"
  | "warning"
  | "error"
  | "critical";

/**
 * Configuration options for the Markdoc preprocessor
*/
export interface Options {
  /**
   * File extensions to preprocess.
   * @default [".mdoc", ".md"]
   */
  extensions?: string[];
  /**
   * Specify a directory to import folders or files to use as Markdoc Schemas.
   * Path is relative to Svelte project root.
   * @default ["./markdoc", "./src/markdoc"]
   */
  schema?: string;
  /**
   * Import an object of nodes to use as Markdoc Nodes.
   * Overwrites nodes with the same name from 'schema' directory.
   * @default undefined
   */
  nodes?: Config["nodes"];
  /**
   * Import an object of tags to use as Markdoc Tags.
   * Overwrites tags with the same name from 'schema' directory.
   * @default undefined
   */
  tags?: Config["tags"];
  /**
   * Import an object of variables to use as Markdoc Variables.
   * Overwrites variables with the same name from 'schema' directory.
   * @default undefined
   */
  variables?: Config["variables"];
  /**
   * Import an object of functions to use as Markdoc Functions.
   * Overwrites functions with the same name from 'schema' directory.
   * @default undefined
   */
  functions?: Config["functions"];
  /**
   * Specify a directory to import files with 'extensions' as Markdoc Partials.
   * Default is to load partials from 'schema' directory.
   * Overwrites partials with the same name from 'schema' directory.
   * Path is relative to Svelte project root.
   * @default undefined
   */
  partials?: string;
  /**
   * Specify a directory to import Svelte components to customize Markdoc Nodes and Tags.
   * Use import paths and aliases that Svelte can resolve.
   * @default "$lib/components"
   */
  components?: string;
  /**
   * Specify a Svelte component to use as a layout for the Markdoc file.
   * Use import paths and aliases that Svelte can resolve.
   * @default undefined
   */
  layout?: string;
  /**
   * Enable adding Markdown comments to your documents.
   * @default true
   */
  comments?: boolean;
  /**
   * Enable autoconvert URL-like text to links.
   * @default false
   */
  linkify?: boolean;
  /**
   * Enable some language-neutral replacement + quotes beautification.
   * @default false
   */
  typographer?: boolean;
  /**
   * Sets the level invalid parsing will throw a preprocess error.
   * @default "error"
   */
  validationLevel?: ValidationLevel;
}

/**
 * Represents the structure of an imported Markdoc module.
 */
export interface MarkdocModule {
  /**
   * The default Svelte component exported by the Markdoc file.
   */
  default: Component;
  /**
   * The slug of the Markdoc file.
   */
  slug: string;
  /**
   * Optional frontmatter extracted from the Markdoc file.
   */
  frontmatter?: { [key: string]: string };
  /**
   * Optional list of headings from the Markdoc file.
   */
  headings?: Heading[];
}

