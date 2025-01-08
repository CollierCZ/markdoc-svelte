import type {
  RenderableTreeNode,
  RenderableTreeNodes,
  Scalar,
} from "@markdoc/markdoc";
import MarkdownIt from "markdown-it";
import { escapeMarkdocBrackets } from "./utils";

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

    // Return only the opening tag if the tag is void (can't have content)
    if (voidElements.has(name.toString())) return `${openingTag} />`;

    if (typeof children === "number" || typeof children === "boolean")
      return `${openingTag}></${name}>`;

    // If the node has actual children, process them
    if (children?.length) {
      const escapeChildrenToString = (
        arrayOfChildren:
          | string
          | {
              [key: string]: Scalar;
            }
          | RenderableTreeNode[]
      ): string => {
        if (typeof arrayOfChildren === "string")
          return escapeMarkdocBrackets(arrayOfChildren);
        if (Array.isArray(arrayOfChildren)) {
          return arrayOfChildren
            .map((child) =>
              escapeMarkdocBrackets(
                child?.toString().replace("\n", "") || "" // Don't break the string in the middle // Make sure we end up with strings, not null or undefined
              )
            )
            .join("\n"); // Put the line breaks back in
        }
        return "";
      };
      if (name === "code") {
        return `${openingTag}>${escapeChildrenToString(children)}</${name}>`;
      }
      if (name === "pre") {
        return `${openingTag}><code>${escapeChildrenToString(children)}</code></${name}>`;
      } else return `${openingTag}>${render(children)}</${name}>`;
    }

    return `${openingTag}></${name}>`;
  };

  return getOutput();
};

export default render;
