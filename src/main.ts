import MarkdocSource from "@markdoc/markdoc";
import yaml from "js-yaml";
import render from "./render";
import loadSchema from "./loader";

interface Options {
  extensions?: string[];
  layout?: string;
  schema?: string;
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
 *
 * options – An object with the following optional properties:
 *
 * - `extensions` - An array of file extensions to process
 * - `layout` - The path to a layout for your Markdoc files
 * - `schema` - The path to your custom schema for Markdoc tags, nodes, and so on
 *
 */
export const markdoc = (options: Options = {}): Preprocessor => {
  const layoutPath = options.layout;
  const schemaPath = options.schema;
  const extensions = options.extensions || [".md"];

  return {
    markup: async ({ content = "", filename = "" }) => {
      if (!extensions.find((extension) => filename.endsWith(extension))) return;

      const ast = MarkdocSource.parse(content);

      const isFrontmatter = Boolean(ast.attributes.frontmatter);
      const frontmatter = isFrontmatter
        ? (yaml.load(ast.attributes.frontmatter) as Record<string, unknown>)
        : {};

      const schema = await loadSchema(schemaPath);

      const transformedContent = MarkdocSource.transform(ast, {
        variables: { frontmatter },
        ...schema,
      });

      const svelteContent = render(transformedContent);
      const frontmatterString = isFrontmatter
        ? `<script context="module">\n` +
          `\texport const metadata = ${JSON.stringify(frontmatter)};\n` +
          `\tconst { ${Object.keys(frontmatter as Record<string, unknown>).join(
            ", "
          )} } = metadata;\n` +
          "</script>\n"
        : "";

      const layoutOpenString = layoutPath
        ? "<script>\n" +
          `\timport Layout_DEFAULT from '${layoutPath}';\n` +
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
