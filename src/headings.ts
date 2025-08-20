import { Tag } from "@markdoc/markdoc";
import type { RenderableTreeNode } from "@markdoc/markdoc";
import slugify from "slugify";

export interface Heading {
  /**
   * The heading level (1-6)
   */
  level: number;
  /**
   * The heading text content
   */
  title: string;
  /**
   * The heading id attribute
   */
  id?: string;
}

const getTextContent = (children: RenderableTreeNode[]): string => {
  return children.reduce((text: string, child): string => {
    if (typeof child === "string" || typeof child === "number") {
      return text + child;
    } else if (typeof child === "object" && Tag.isTag(child)) {
      return text + getTextContent(child.children);
    }
    return text;
  }, "");
};

const getSlug = (tag: Tag): string => {
  if (tag.attributes.id && typeof tag.attributes.id === "string") {
    return tag.attributes.id;
  }
  return slugify(getTextContent(tag.children), {
    lower: true,
    strict: true,
  }) as string;
};
/**
 * Recursively collects all heading nodes from a Markdoc AST
 * @param node - The Markdoc AST node to process
 * @returns Array of heading objects with title, level, and other attributes
 */
export function collectHeadings(
  node: RenderableTreeNode | RenderableTreeNode[],
  sections: Heading[] = [],
): Heading[] {
  // Handle array of nodes
  if (Array.isArray(node)) {
    for (const child of node) {
      sections.push(...collectHeadings(child));
    }
    return sections;
  }

  // Handle single node
  if (typeof node === "object" && node !== null && "name" in node) {
    const tag = node as Tag;
    if (tag.name.match(/^h\d$/)) {
      sections.push({
        level: parseInt(tag.name[1]),
        title: getTextContent(tag.children),
        id: getSlug(tag),
      });
    }

    // Handle node children
    if (tag.children) {
      for (const child of tag.children) {
        collectHeadings(child, sections);
      }
    }
  }

  return sections;
}
