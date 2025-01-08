import MarkdocSource, { Config, validate } from "@markdoc/markdoc";
import yaml from "js-yaml";
import render from "./render";
import loadSchema from "./loader";
import { getComponentImports } from "./getComponents";
import getPartials from "./getPartials";

interface Options {
  extensions?: string[];
  layout?: string;
  validationLevel?: "debug" | "info" | "warning" | "error" | "critical";
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
  const validationLevel = options.validationLevel || "error";
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
        variables: variablesFromSchema,
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
        ...schemaWithoutPartials,
        variables: { frontmatter, ...(variables || variablesFromSchema) },
        partials:
          partialsDirectory || schemaFromPath["partials"]
            ? getPartials(partialsDirectory || schemaFromPath["partials"])
            : undefined,
      };

      // Check if Markdoc is valid
      const errorLevelsMap = new Map<Options["validationLevel"], number>([
        ["debug", 0],
        ["info", 1],
        ["warning", 2],
        ["error", 3],
        ["critical", 4],
      ]);
      const errors = MarkdocSource.validate(ast, markdocConfig);
      const breakingLevel = errorLevelsMap.get(validationLevel)!;
      const areErrorsAtBreakingLevel = errors.find(
        (error) => errorLevelsMap.get(error.error.level)! >= breakingLevel
      );
      if (areErrorsAtBreakingLevel) {
        throw new Error(
          `The file at ${filename} is invalid with ${errors.length} error${errors.length > 1 ? "s" : ""}:\n- ${errors.map((error) => error.error.message).join("\n- ")}`
        );
      }

      const transformedContent = await MarkdocSource.transform(
        ast,
        markdocConfig
      );

      const svelteContent = render(transformedContent);
      const frontmatterString = isFrontmatter
        ? `<script context="module">\n` +
          `\texport const metadata = ${JSON.stringify(frontmatter)};\n` +
          `\tconst { ${Object.keys(frontmatter as Record<string, unknown>).join(
            ", "
          )} } = metadata;\n` +
          "</script>\n"
        : "";

      const componentsString = getComponentImports(
        schemaWithoutPartials,
        "/src/lib/components"
      );
      const layoutOpenString =
        layoutPath || componentsString
          ? `
<script>
  ${layoutPath ? `import Layout_DEFAULT from '${layoutPath}';` : ""}
  ${componentsString}
</script>
${
  layoutPath ? `<Layout_DEFAULT${isFrontmatter ? ` {...metadata}` : ""}>\n` : ""
}`
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
