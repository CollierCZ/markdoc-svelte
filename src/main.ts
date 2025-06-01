import { basename, extname } from "path";

import Markdoc from "@markdoc/markdoc";
import type { Config, ParserArgs } from "@markdoc/markdoc";
import type { PreprocessorGroup } from "svelte/compiler";
import YAML from "yaml";

import { getComponentImports, extractUsedSvelteComponents } from "./components.ts";
import { handleValidationErrors } from "./errors.ts";
import { findFirstDirectory, makePathProjectRelative } from "./files.ts";
import log from "./logs.ts";
import loadPartials from "./partials.ts";
import render from "./render.ts";
import loadSchemas from "./schema.ts";
import type { Options } from "./types";

const validOptionKeys: (keyof Options)[] = [
  "extensions",
  "schema",
  "nodes",
  "tags",
  "variables",
  "functions",
  "partials",
  "components",
  "layout",
  "comments",
  "linkify",
  "typographer",
  "validationLevel",
];

/**
 * Creates a Svelte preprocessor for Markdoc files
 * @param {Options} options - Configuration options for the Markdoc preprocessor
 * @returns {PreprocessorGroup} A Svelte preprocessor for Markdoc files
 */
export const markdocPreprocess = (options: Options = {}): PreprocessorGroup => {
  // Warn about invalid options
  for (const key in options) {
    if (!validOptionKeys.includes(key as keyof Options)) {
      log.warn(
        `Invalid option "${key}" provided and ignored.  Please check the documentation for valid options.`,
      );
    }
  }

  // --- Set defaults ---
  const extensions =
    options.extensions && options.extensions.length > 0
      ? options.extensions
      : [".mdoc", ".md"];
  const schemaPaths = options.schema
    ? [makePathProjectRelative(options.schema)]
    : ["./markdoc", "./src/markdoc"];
  const nodes = options.nodes;
  const tags = options.tags;
  const variables = options.variables;
  const functions = options.functions;
  const partialsPath = options.partials
    ? makePathProjectRelative(options.partials)
    : undefined;
  const componentsPath = options.components || "$lib/components";
  const layoutPath = options.layout;
  const allowComments = options.comments ?? true;
  const linkify = options.linkify ?? false;
  const typographer = options.typographer ?? false;
  const validationLevel = options.validationLevel || "error";

  return {
    name: "markdoc-svelte",
    markup: async ({ content, filename }) => {
      // --- Check if file is a Markdoc file ---
      if (
        !filename ||
        !extensions.find((extension) => filename.endsWith(extension))
      )
        return;

      // --- Tokenization ---
      // Markdown-It options https://github.com/markdown-it/markdown-it?tab=readme-ov-file#init-with-presets-and-options
      const markdownItConfig = {
        linkify,
        typographer,
      };
      const tokenizer = new Markdoc.Tokenizer({
        allowIndentation: true,
        allowComments: allowComments,
        ...markdownItConfig,
      });
      const tokens = tokenizer.tokenize(content);

      // --- Parse to AST ---
      const parserConfig: ParserArgs = {
        file: filename, // Debugging
        location: true, // Debugging
        slots: false, // TODO: Add support for slots?
      };
      const ast = Markdoc.parse(tokens, parserConfig);

      // --- Parse Frontmatter ---
      const isFrontmatter = Boolean(ast.attributes.frontmatter);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const frontmatter: Record<string, unknown> = isFrontmatter
        ? YAML.parse(ast.attributes.frontmatter as string)
        : {};

      // --- Prepare to load Schemas & Partials ---
      const dependencies: string[] = [];
      let configFromSchema: Config = {};
      let partialsFromSchema: Config["partials"] = {};
      let partialsFromPartials: Config["partials"] = {};

      // --- Discover optional schema directory ---
      const schemaDir = findFirstDirectory(schemaPaths);

      // --- Load Schemas and Partials from resolved schema directory ---
      if (schemaDir) {
        const { config, deps: schemaDeps } = await loadSchemas(schemaDir);
        configFromSchema = config;
        dependencies.push(...schemaDeps);

        const { config: partials, deps } = loadPartials(schemaDir, extensions);
        if (partials) partialsFromSchema = partials;
        dependencies.push(...deps);
      }

      // --- Load Partials from specified partials directory ---
      if (partialsPath) {
        const { config, deps } = loadPartials(partialsPath, extensions, true);
        if (config) partialsFromPartials = config;
        dependencies.push(...deps);
      }

      // --- Assemble full config ---
      const fullConfig: Config = {
        // Start with base config loaded from the schema directory
        // Merge in config passed as options
        nodes: { ...configFromSchema.nodes, ...nodes },
        tags: { ...configFromSchema.tags, ...tags },
        functions: { ...configFromSchema.functions, ...functions },
        // Make $frontmatter available as variable
        variables: { ...configFromSchema.variables, ...variables, frontmatter },
        // Merge partials: explicitly set partials overwrrite auto-loaded ones
        partials: { ...partialsFromSchema, ...partialsFromPartials },
      };

      // --- Validate Markdoc AST ---
      const errors = Markdoc.validate(ast, fullConfig);
      handleValidationErrors(errors, validationLevel, filename);

      // --- Tranform AST with loaded config ---
      const transformedContent = Markdoc.transform(ast, fullConfig);

      // --- Render Markdoc AST to Svelte ---
      const svelteContent = render(transformedContent);

      // --- Define frontmatter string for Svelte ---
      // Extract filename without path and extension
      const baseFilename = filename ? basename(filename, extname(filename)) : '';
            // Always declare module context, include filename and optionally frontmatter
      const scriptModuleTag = 
        `<script module>\n` +
        `\texport const slug = "${baseFilename}";\n` +
        (isFrontmatter 
          ? `\texport const frontmatter = ${JSON.stringify(frontmatter)};\n` +
            `\tconst { ${Object.keys(frontmatter).join(", ")} } = frontmatter;\n`
          : '') +
        `</script>\n`;

      // --- Generate component import statements ---
      const usedSvelteComponentNames = extractUsedSvelteComponents(transformedContent);
      const componentImportStatements = getComponentImports(usedSvelteComponentNames, componentsPath);

      // --- Construct script tag content ---
      let allScriptImports = componentImportStatements;
      if (layoutPath) {
        if (allScriptImports && allScriptImports.trim() !== "") {
          allScriptImports += "\n";
        }
        allScriptImports += `\timport Layout_MARKDOC from '${layoutPath}';\n`;
      }

      const scriptTag = allScriptImports ? `<script>\n${allScriptImports}</script>\n` : "";

      // --- Define layout wrapper strings ---
      // Pass frontmatter to the layout component if it exists
      const layoutWrapperOpen = layoutPath
        ? `<Layout_MARKDOC${isFrontmatter ? ` {...frontmatter}` : ""}>\n`
        : "";
      const layoutWrapperClose = layoutPath ? `\n</Layout_MARKDOC>` : "";

      // --- Assemble final Svelte code ---
      const code =
        scriptModuleTag +
        scriptTag +
        layoutWrapperOpen +
        svelteContent +
        layoutWrapperClose;
      
      return {
        code: code,
        dependencies,
      };
    },
  };
};
