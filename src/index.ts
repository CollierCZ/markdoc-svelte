import MarkdocSource from "@markdoc/markdoc";
import yaml from "js-yaml";
import render from "./render";

interface Options {
  layout?: string;
}

export const markdoc = (options: Options = {}) => {
  const layoutPath = options.layout;

  return {
    markup: ({ content = "", filename = "" }) => {
      if (!filename.includes(".md")) return;

      const ast = MarkdocSource.parse(content);

      const frontmatter = ast.attributes.frontmatter
        ? yaml.load(ast.attributes.frontmatter)
        : {};
      const transformedContent = MarkdocSource.transform(ast, {
        variables: { frontmatter },
      });

      const svelteContent = render(transformedContent);
      const frontmatterString =
        `<script context="module">\n` +
        `\texport const metadata = ${JSON.stringify(frontmatter)};\n` +
        `\tconst { ${Object.keys(frontmatter as Record<string, unknown>).join(
          ", "
        )} } = metadata;\n` +
        "</script>\n";

      const layoutOpenString = layoutPath
        ? "<script>\n" +
          `\timport Layout_MDSVEX_DEFAULT from '${layoutPath}';\n` +
          "</script>\n" +
          "<Layout_MDSVEX_DEFAULT {...metadata}>\n"
        : "";

      const layoutCloseString = layoutPath ? "</Layout_MDSVEX_DEFAULT>\n" : "";

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
