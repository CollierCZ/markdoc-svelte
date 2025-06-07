import type { RenderableTreeNode, Tag } from '@markdoc/markdoc';

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

/**
 * Recursively collects all heading nodes from a Markdoc AST
 * @param node - The Markdoc AST node to process
 * @returns Array of heading objects with title, level, and other attributes
 */
export function collectHeadings(node: RenderableTreeNode | RenderableTreeNode[]): Heading[] {
  const sections: Heading[] = [];
  
  // Handle array of nodes
  if (Array.isArray(node)) {
    for (const child of node) {
      sections.push(...collectHeadings(child));
    }
    return sections;
  }

  // Handle single node
  if (typeof node === 'object' && node !== null && 'name' in node) {
    const tag = node as Tag;
    if (tag.name.match(/^h\d$/)) {
      const title = tag.children[0];
      if (typeof title === 'string') {
        sections.push({
          level: parseInt(tag.name[1]),
          title,
          id: tag.attributes.id as string,
        })
      }
    }

    // Handle node children
    if (tag.children) {
      for (const child of tag.children) {
        collectHeadings(child);
      }
    }
    
  }
  
  return sections;
} 