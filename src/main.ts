import MarkdocSource, { Config, validate } from "@markdoc/markdoc";
import yaml from "js-yaml";
import render from "./render";
import loadSchema from "./loader";
import { getComponentImports } from "./getComponents";
import getPartials from "./getPartials";

interface Options {
  extensions?: string[];
  layout?: string;
  schema?: string;
  functions?: Config["functions"];
  nodes?: Config["nodes"];
  partials?: string;
  tags?: Config["tags"];
  variables?: Config["variables"];
}

interface PreprocessorReturn {
  code: string;
  data?: Record<string, unknown>;
  map?: string;
}

interface Preprocessor {
  markup: (args: {
    content: string;
    filename: string;
  }) => Promise<PreprocessorReturn | undefined>;
}

/**
 * A Svelte preprocessor for Markdoc files
 */
export const markdoc = (options: Options = {}): Preprocessor => {
  const layoutPath = options.layout;
  const schemaPath = options.schema;
  const extensions = options.extensions || [".markdown", ".md"];
  const {
    functions,
    nodes,
    partials: partialsDirectory,
    tags,
    variables,
  } = options;

  return {
    markup: async ({ content = "", filename = "" }) => {
      if (!extensions.find((extension) => filename.endsWith(extension))) return;

      const ast = MarkdocSource.parse(content);

      const isFrontmatter = Boolean(ast.attributes.frontmatter);
      const frontmatter = isFrontmatter
        ? (yaml.load(ast.attributes.frontmatter) as Record<string, unknown>)
        : {};

      const schemaFromPath = await loadSchema(schemaPath);

      const {
        partials: partialsDirectoryFromSchema,
        ...schemaFromPathWithoutPartials
      } = schemaFromPath;

      // Include schema parts passed as options
      // But ignore if undefined
      // Leave out partials until directory processed
      const schemaWithoutPartials = {
        ...schemaFromPathWithoutPartials,
        ...(functions && { functions }),
        ...(nodes && { nodes }),
        ...(tags && { tags }),
      };

      const markdocConfig = {
        variables: { frontmatter, ...variables },
        ...schemaWithoutPartials,
        partials:
          partialsDirectory || schemaFromPath["partials"]
            ? getPartials(partialsDirectory || schemaFromPath["partials"])
            : undefined,
      };

      // TODO validate and do something with it
      //const errors = MarkdocSource.validate(ast, markdocConfig);

      const transformedContent = MarkdocSource.transform(ast, markdocConfig);

      const svelteContent = render(transformedContent);
      const frontmatterString = isFrontmatter
        ? `<script context="module">\n` +
          `\texport const metadata = ${JSON.stringify(frontmatter)};\n` +
          `\tconst { ${Object.keys(frontmatter as Record<string, unknown>).join(
            ", ",
          )} } = metadata;\n` +
          "</script>\n"
        : "";

      const layoutOpenString = layoutPath
        ? "<script>\n" +
          `\timport Layout_DEFAULT from '${layoutPath}';\n` +
          getComponentImports(schemaWithoutPartials, "/src/lib/components") +
          "</script>\n" +
          `<Layout_DEFAULT${isFrontmatter ? ` {...metadata}` : ""}>\n`
        : "";

      const layoutCloseString = layoutPath ? "</Layout_DEFAULT>\n" : "";

      const code =
        frontmatterString +
        layoutOpenString +
        svelteContent +
        layoutCloseString;

      return {
        code: code,
        data: frontmatter,
      };
    },
  };
};
