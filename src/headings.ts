import { Tag } from "@markdoc/markdoc";
import type { RenderableTreeNode, Schema } from "@markdoc/markdoc";

import type { MarkdocSvelteConfig, SluggerType } from "./types.ts";

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

const getSlug = (
  sluggifier: SluggerType,
  attributes: Record<string, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  children: RenderableTreeNode[],
): string => {
  if (attributes.id && typeof attributes.id === "string") {
    return attributes.id;
  }
  return sluggifier(getTextContent(children));
};
/**
 * Recursively collects all heading nodes from a Markdoc AST
 * @param node - The Markdoc AST node to process
 * @returns Array of heading objects with title, level, and other attributes
 */
export function collectHeadings(
  node: RenderableTreeNode | RenderableTreeNode[],
  sluggifier: SluggerType,
  sections: Heading[] = [],
): Heading[] {
  // Handle array of nodes
  if (Array.isArray(node)) {
    for (const child of node) {
      sections.push(...collectHeadings(child, sluggifier));
    }
    return sections;
  }

  // Handle single node
  if (typeof node === "object" && node !== null) {
    // Handle headings passed as custom components
    if (
      node.attributes?.__collectHeading === true &&
      typeof node.attributes?.level === "number"
    ) {
      sections.push({
        level: node.attributes?.level,
        title: getTextContent(node.children),
        id: getSlug(sluggifier, node.attributes, node.children),
      });
    }

    if ("name" in node) {
      const tag = node as Tag;

      // Handle basic headings
      if (tag.name.match(/^h\d$/)) {
        sections.push({
          level: parseInt(tag.name[1]),
          title: getTextContent(tag.children),
          id: getSlug(sluggifier, tag.attributes, tag.children),
        });
      }

      // Handle node children
      if (tag.children) {
        for (const child of tag.children) {
          collectHeadings(child, sluggifier, sections);
        }
      }
    }
  }

  return sections;
}

export const heading: Schema = {
  children: ["inline"],
  attributes: {
    id: { type: String },
    level: { type: Number, required: true, default: 1 },
  },
  transform(node, config: MarkdocSvelteConfig) {
    const { level, ...attributes } = node.transformAttributes(config);
    const children = node.transformChildren(config);

    const slug = getSlug(config.headingSlugger, node.attributes, children);

    const render = config.nodes?.heading?.render ?? `h${level}`;

    /**
     * TODO: THis doesn't work because render is a string even for custom components
     * 
     * When the tag has a component as its render option,
     * add an attribute to collect it as a header
     * and also the level as a prop, not an HTML attribute.
     */
    const tagProps =
      typeof render === "string"
        ? { ...attributes, id: slug }
        : {
            ...attributes,
            id: slug,
            __collectHeading: true,
            level: level as number,
          };

    return new Tag(render, tagProps, children);
  },
};
