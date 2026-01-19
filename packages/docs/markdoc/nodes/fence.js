import Markdoc from "@markdoc/markdoc";
import { getSingletonHighlighter } from "shiki";

const fence = {
  render: "CodeBlock",
  attributes: {
    content: {
      type: String,
    },
    language: {
      type: String,
    },
    process: {
      ...Markdoc.nodes.fence.attributes.process,
      default: false,
    },
  },
  async transform(node, config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);
    const code = children.length > 0 ? children.join() : attributes.content;

    const codeWithoutEmptyLastLine = code.replace(/\n$/, "");

    // Prerender the code on the server to improve performance
    const highlighter = async (highCode, highLang) => {
      const langToLoad = highLang || "text";
      const highlighterTool = await getSingletonHighlighter({
        themes: ["nord"],
        langs: [langToLoad],
      });
      await highlighterTool.loadTheme("nord");
      const html = highlighterTool.codeToHtml(highCode, {
        lang: langToLoad,
        theme: "nord",
      });
      return html;
    };
    const codeHtml = await highlighter(
      codeWithoutEmptyLastLine,
      attributes.language,
    );

    return new Markdoc.Tag(this.render, {
      code: codeWithoutEmptyLastLine,
      codeHtml,
      lang: attributes.language,
    });
  },
};

export default fence;
