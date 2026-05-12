import Markdoc from "@markdoc/markdoc";
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

const isBasicHeading = (tagName: string) => tagName.match(/^h\d$/);

const getTextContent = (children: RenderableTreeNode[]): string => {
  return children.reduce((text: string, child): string => {
    if (typeof child === "string" || typeof child === "number") {
      return text + child;
    } else if (typeof child === "object" && Markdoc.Tag.isTag(child)) {
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

export interface HeadingsObject {
  headings: Heading[];
  node: RenderableTreeNode;
}

/**
 * Recursively collects all heading nodes from tree
 * after transform (to resolve variables and the like)
 * @param topNode - The top-level renderable tree node of the document
 * @param sluggifier - The function to create an ID if not present
 * @returns Array of heading objects with title, level, and other attributes and nodes without extraneous attributes
 */
export function collectHeadings(
  topNode: RenderableTreeNode,
  sluggifier: SluggerType,
): HeadingsObject {
  // If document empty, don't continue
  if (!Markdoc.Tag.isTag(topNode)) return { headings: [], node: topNode };
  if (!topNode?.children) return { headings: [], node: topNode };

  return topNode.children.reduce(
    (acc, child, index) => {
      // If not a tag, don't continue
      if (!Markdoc.Tag.isTag(child)) return acc;
      const headingList = acc.headings;

      // Only process tags marked as needing it
      if (
        child.attributes?.__collectHeading === true &&
        typeof child.attributes?.level === "number"
      ) {
        const { __collectHeading, level, ...otherChildAttributes } =
          child.attributes;
        headingList.push({
          level,
          title: getTextContent(child.children),
          id: getSlug(sluggifier, child.attributes, child.children),
        });
        const newChild = {
          ...child,
          attributes: {
            ...otherChildAttributes,
            ...(isBasicHeading(child.name) ? {} : { level }),
          },
        };

        const updatedChildren = [...acc.node.children];
        updatedChildren[index] = newChild;
        return {
          headings: headingList,
          node: { ...acc.node, children: updatedChildren },
        };
      }
      return acc;
    },
    {
      headings: [] as Heading[],
      node: topNode,
    },
  );
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

    const slug = config.headingSlugger
      ? getSlug(config.headingSlugger, node.attributes, children)
      : getTextContent(children);

    const render = config.nodes?.heading?.render ?? `h${level}`;

    /**
     * Pass level along and manually mark the tag
     * as being a heading to collect.
     */
    const tagProps = {
      ...attributes,
      id: slug,
      __collectHeading: true,
      level: level as number,
    };

    return new Markdoc.Tag(render, tagProps, children);
  },
};
