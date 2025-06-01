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
 * If it is an array, converts each child to a string, removes all newlines,
 * applies Markdoc bracket escaping, and joins them.
 * For other types, returns an empty string.
 */
const escapeChildrenToString = (
  content: string | RenderableTreeNode[] | { [key: string]: Scalar },
): string => {
  if (typeof content === "string") {
    const result = escapeHtml(content);
    return result;
  }
  if (Array.isArray(content)) {
    const processedChildren = content.map((child) => {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      const childString = child?.toString() || "";
      const noNewlines = childString.replace(/\n/g, "");
      const escaped = escapeHtml(noNewlines);
      return escaped;
    });
    const result = processedChildren.join("\n");
    return result;
  }
  return "";
};

/**
 * Renders a Markdoc node tree into an HTML string.
 */
const render = (node: RenderableTreeNodes): string => {
  // Early return for strings.
  if (typeof node === "string") {
    return node;
  }

  // If node is an array, join together the rendered contents.
  if (Array.isArray(node)) {
    return node.map(render).join("");
  }

  // Fallback for null or non-objects.
  if (node === null || typeof node !== "object") {
    return "";
  }

  // Destructure properties.
  const { name, attributes, children = [] } = node;

  // If there’s no tag name, directly render the children.
  if (!name) {
    return render(children);
  }

  // Ensure the tag name is a string.
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const tagName = String(name);
  // Process tag attributes and escape their values.
  const attributesList = Object.entries(attributes ?? {}).reduce(
    (acc, [key, value]) => acc + ` ${key}="${escapeHtml(String(value))}"`,
    "",
  );
  const openingTag = `<${tagName}${attributesList}`;

  // For void elements (self‑closing).
  if (voidElements.has(tagName)) {
    return `${openingTag} />`;
  }

  // If children is a number or boolean, produce an empty content element.
  if (typeof children === "number" || typeof children === "boolean") {
    return `${openingTag}></${tagName}>`;
  }

  // Process children.
  if (children && (Array.isArray(children) ? children.length : true)) {
    // Special handling for code and pre elements.
    if (tagName === "code") {
      const escapedContent = escapeChildrenToString(children);
      return `${openingTag}>${escapedContent}</${tagName}>`;
    }
    if (tagName === "pre") {
      const escapedContent = escapeChildrenToString(children);
      return `${openingTag}><code>${escapedContent}</code></${tagName}>`;
    }
    // Otherwise, recursively render children.
    return `${openingTag}>${render(children)}</${tagName}>`;
  }

  // Fallback: no children provided.
  return `${openingTag}></${tagName}>`;
};

export default render;
