import type {
  RenderableTreeNode,
  RenderableTreeNodes,
  Scalar,
} from "@markdoc/markdoc";

import { escapeHtml } from "./escape.ts";

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

/**
 * Escapes children content for code and pre blocks.
 * If content is a string, escapes Markdoc brackets.
 * If it is an array, converts each child to a string, removes all new lines,
 * applies Markdoc bracket escaping, and joins them back into a string.
 * For other types, returns an empty string.
 */
const escapeChildrenToString = (
  content: string | RenderableTreeNode[] | { [key: string]: Scalar }
): string => {
  if (typeof content === "string") {
    return escapeHtml(content);
  }
  if (Array.isArray(content)) {
    const processedChildren = content.map((child) => {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      const childString = child?.toString() || "";
      const noNewlines = childString.replace(/\n/g, "");
      const escaped = escapeHtml(noNewlines);
      return escaped;
    });
    return processedChildren.join("\n");
  }
  return "";
};

/**
 * Renders a Markdoc node tree into an HTML string.
 */
const render = (node: RenderableTreeNodes): string => {
  // Strings don't require any further processing.
  if (typeof node === "string") return node;

  // If node is an array, join the rendered children.
  if (Array.isArray(node)) return node.map(render).join("");

  // Fallback for null or non-objects.
  if (node === null || typeof node !== "object") return "";

  // Destructure properties.
  const { name, attributes, children = [] } = node;

  // If there’s no tag name, directly render the children.
  if (!name) return render(children);

  // Ensure the tag name is a string.
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const tagName = String(name);
  // Process tag attributes and escape their values.
  const attributesList = Object.entries(attributes ?? {}).reduce(
    (accumulator, [key, value]) =>
      accumulator + ` ${key}="${escapeHtml(String(value))}"`,
    ""
  );
  const openingTag = `<${tagName}${attributesList}`;

  // For void (self‑closing) elements.
  if (voidElements.has(tagName)) return `${openingTag} />`;

  // If children is a number or boolean, return an empty content element.
  if (typeof children === "number" || typeof children === "boolean")
    return `${openingTag}></${tagName}>`;

  // Process children.
  if (children && (Array.isArray(children) ? children.length : true)) {
    // Code elements don't need further processing
    // Just escape characters Svelte brackets
    if (tagName === "code") {
      return `${openingTag}>${escapeChildrenToString(children)}</${tagName}>`;
    }
    // Pre elements are like code elements, just with an extra added tag
    if (tagName === "pre") {
      return `${openingTag}><code>${escapeChildrenToString(children)}</code></${tagName}>`;
    }
    // Other elements need their children recursively rendered
    return `${openingTag}>${render(children)}</${tagName}>`;
  }

  // Fallback for no children.
  return `${openingTag}></${tagName}>`;
};

export default render;
