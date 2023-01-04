import type { RenderableTreeNodes } from "@markdoc/markdoc";
import MarkdownIt from "markdown-it";

const { escapeHtml } = MarkdownIt().utils;

// Elements with no closing tag
// https://html.spec.whatwg.org/#void-elements
const voidElements = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "source",
  "track",
  "wbr",
]);

const render = (node: RenderableTreeNodes): string => {
  if (typeof node === "string") return node;

  if (Array.isArray(node)) return node.map(render).join("");

  if (node === null || typeof node !== "object") return "";

  const { name, attributes, children = [] } = node;

  if (!name) return render(children);

  const getOutput = () => {
    // Add attributes to tag
    const attributesList = Object.entries(attributes ?? {}).reduce(
      (previous, [key, value]) =>
        `${previous} ${key}="${escapeHtml(String(value))}"`,
      ""
    );
    const openingTag = `<${name}${attributesList}`;

    // Return only opening tag if the tag is void (can't have content)
    if (voidElements.has(name.toString())) return `${openingTag} />`;

    if (typeof(children) === "number" || typeof(children) === "boolean") return `${openingTag}></${name}>`

    const outputContent = children?.length ? render(children) : "";

    return `${openingTag}>${outputContent}</${name}>`;
  };

  return getOutput();
};

export default render;
