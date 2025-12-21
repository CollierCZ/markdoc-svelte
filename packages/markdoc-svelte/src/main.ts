import { basename, extname } from "path";

import Markdoc from "@markdoc/markdoc";
import type { ParserArgs } from "@markdoc/markdoc";
import slug from "slug";
import type { PreprocessorGroup } from "svelte/compiler";
import YAML from "yaml";

import {
  getComponentImports,
  extractUsedSvelteComponents,
} from "./components.ts";
import { handleValidationErrors } from "./errors.ts";
import { findFirstDirectory, makePathProjectRelative } from "./files.ts";
import { collectHeadings, heading, type Heading } from "./headings.ts";
import log from "./logs.ts";
import loadPartials from "./partials.ts";
import render from "./render.ts";
import loadSchemas from "./schema.ts";
import type { MarkdocSvelteConfig, Options } from "./types.ts";

const validOptionKeys: (keyof Options)[] = [
  "comments",
  "components",
  "extensions",
  "functions",
  "headingIds",
  "layout",
  "linkify",
  "nodes",
  "partials",
  "schema",
  "tags",
  "typographer",
  "validationLevel",
  "variables",
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
        `Invalid option "${key}" provided and ignored. Check the documentation for valid options.`,
      );
    }
  }

  // Set defaults
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
  const processHeadings = options.headingIds ?? false;
  // Use custom slugger if provided, or fallback to default
  const headingSlugger =
    typeof processHeadings === "function" ? processHeadings : slug;
  const linkify = options.linkify ?? false;
  const typographer = options.typographer ?? false;
  const validationLevel = options.validationLevel || "error";

  return {
    name: "markdoc-svelte",
    markup: async ({ content, filename }) => {
      const debugLogs: string[] = [];
      // Check if file is a Markdoc file
      if (
        !filename ||
        !extensions.find((extension) => filename.endsWith(extension))
      )
        return;

      // Tokenization
      // markdown-it options https://github.com/markdown-it/markdown-it?tab=readme-ov-file#init-with-presets-and-options
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

      // Parse to AST
      const parserConfig: ParserArgs = {
        file: filename,
        location: true,
        slots: false,
      };
      const ast = Markdoc.parse(tokens, parserConfig);

      // Parse frontmatter
      const isFrontmatter = Boolean(ast.attributes.frontmatter);
      debugLogs.push(`Frontmatter detected: ${isFrontmatter}`);
      debugLogs.push(`Raw frontmatter content: ${isFrontmatter}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const frontmatter: Record<string, unknown> = isFrontmatter
        ? YAML.parse(ast.attributes.frontmatter as string)
        : {};
      debugLogs.push(`Parsed frontmatter: ${JSON.stringify(frontmatter)}`);

      // Prepare to load schemas & partials
      const dependencies: string[] = [];
      let configFromSchema: MarkdocSvelteConfig = {};
      let partialsFromSchema: MarkdocSvelteConfig["partials"] = {};
      let partialsFromPartials: MarkdocSvelteConfig["partials"] = {};

      // Discover optional schema directory
      const schemaDir = findFirstDirectory(schemaPaths);

      // Load schema and partials from resolved schema directory, if one exists
      if (schemaDir) {
        const { config, deps: schemaDeps } = await loadSchemas(schemaDir);
        configFromSchema = config;
        dependencies.push(...schemaDeps);

        const { config: partials, deps } = loadPartials(schemaDir, extensions);
        if (partials) partialsFromSchema = partials;
        dependencies.push(...deps);
      }

      // Load partials from specified partials directory, if one exists
      if (partialsPath) {
        const { config, deps } = loadPartials(partialsPath, extensions, true);
        if (config) partialsFromPartials = config;
        dependencies.push(...deps);
      }

      // Assemble full config
      const fullConfig: MarkdocSvelteConfig = {
        // Start with base config loaded from the schema directory
        // Explicitly set options overwrite the base config
        // For example, if processing headings,
        // This processor's heading comes first so it's overwritten
        nodes: {
          ...(processHeadings ? { heading } : {}), // Only include if passed as option
          ...configFromSchema.nodes,
          ...nodes,
        },
        tags: { ...configFromSchema.tags, ...tags },
        functions: { ...configFromSchema.functions, ...functions },
        partials: { ...partialsFromSchema, ...partialsFromPartials },
        // Make $frontmatter available as variable
        variables: { ...configFromSchema.variables, ...variables, frontmatter },
        headingSlugger,
      };

      // Validate Markdoc AST
      const errors = Markdoc.validate(ast, fullConfig);
      handleValidationErrors(errors, validationLevel, filename);
      if (validationLevel && validationLevel === "debug") {
        debugLogs.forEach((debugLog) => log.debug(debugLog));
      }

      // Tranform AST with loaded config
      // Needs to be awaited to handle async functions in schema (such as nodes)
      // eslint-disable-next-line @typescript-eslint/await-thenable
      const transformedContent = await Markdoc.transform(ast, fullConfig);

      // Collect headings from transformed content
      const getHeadings = (): Heading[] => {
        if (processHeadings) {
          return collectHeadings(transformedContent, headingSlugger);
        }
        return [];
      };
      const headings = getHeadings();

      // Render Markdoc AST to Svelte
      const svelteContent = render(transformedContent);

      // Define frontmatter string for Svelte
      // Extract filename without path and extension
      const baseFilename = filename
        ? basename(filename, extname(filename))
        : "";
      // Declare module context, including filename and optionally frontmatter
      const scriptModuleTag =
        `<script module>\n` +
        `\texport const slug = "${baseFilename}";\n` +
        (isFrontmatter
          ? `\texport const frontmatter = ${JSON.stringify(frontmatter)};\n` +
            `\tconst { ${Object.keys(frontmatter).join(", ")} } = frontmatter;\n`
          : "") +
        (headings.length > 0
          ? `\texport const headings = ${JSON.stringify(headings)};\n`
          : "") +
        `</script>\n`;

      // Generate component import statements
      const usedSvelteComponentNames =
        extractUsedSvelteComponents(transformedContent);
      const componentImportStatements = getComponentImports(
        usedSvelteComponentNames,
        componentsPath,
      );

      // Construct script tag content
      let allScriptImports = componentImportStatements;
      // Check if layout set explicitly
      if (layoutPath) {
        // Add a line break if there are import statements
        if (allScriptImports && allScriptImports.trim() !== "") {
          allScriptImports += "\n";
        }
        // Add the layout as an import
        allScriptImports += `\timport Layout_MARKDOC from '${layoutPath}';\n`;
      }
      // Place it all within a script tag
      const scriptTag = allScriptImports
        ? `<script>\n${allScriptImports}</script>\n`
        : "";

      // If layout is passed explicitly, add it as a wrapping component
      // If frontmatter or headings exists, pass them to the layout component
      const layoutWrapperOpen = layoutPath
        ? `<Layout_MARKDOC${isFrontmatter ? ` {...frontmatter}` : ""}${headings.length > 0 ? ` headings={headings}` : ""}>\n`
        : "";
      const layoutWrapperClose = layoutPath ? `\n</Layout_MARKDOC>` : "";

      // Assemble final Svelte code
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
