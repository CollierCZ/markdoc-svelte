import type { RenderableTreeNode } from "@markdoc/markdoc";
import { normalizePath } from "vite";

/**
 * Traverses the Markdoc RenderableTreeNode AST to find all Svelte component names
 * that are actively used. It identifies components by their name starting with an
 * uppercase letter, as per convention, assuming Markdoc.transform has already
 * resolved these names from the schema's 'render' attributes.
 *
 * @param node - The RenderableTreeNode to traverse.
 * @returns A Set of unique Svelte component names used in the tree.
 */
export const extractUsedSvelteComponents = (
  node: RenderableTreeNode | null | undefined,
): Set<string> => {
  const usedComponents = new Set<string>();

  const traverse = (currentNode: RenderableTreeNode | null | undefined) => {
    // If current node can't be a component, skip it
    if (!currentNode || typeof currentNode === 'string' || typeof currentNode === 'number' || typeof currentNode === 'boolean')
      return;

    // Recursively work through children of arrays until get to objects
    if (Array.isArray(currentNode)) {
      for (const child of currentNode) {
        traverse(child);
      }
      return;
    }

    // Check if this RenderableTreeNode object itself represents a Svelte component.
    // 'currentNode.name' here is the name of the component/tag to be rendered.
    // Convention: if node.name starts with an uppercase letter, it's a Svelte component.
    if (currentNode.name && typeof currentNode.name === 'string' && /\p{Lu}/u.test(currentNode.name)) {
      usedComponents.add(currentNode.name);
    }

    // Recursively process children.
    if (currentNode.children && Array.isArray(currentNode.children)) {
      for (const child of currentNode.children) {
        traverse(child as RenderableTreeNode | null | undefined);
      }
    }
  }

  traverse(node);
  return usedComponents;
};

/**
 * Generates Svelte import statements for a given set of Svelte component names.
 *
 * @param usedSvelteComponentNames - A Set of Svelte component names that need import statements.
 * @param componentDirPath - The directory path where Svelte components are located.
 *                           This can be any path format that Svelte/SvelteKit supports.
 * @returns A string containing all generated Svelte import statements.
 */
export const getComponentImports = (
  usedSvelteComponentNames: Set<string>,
  componentDirPath: string,
): string => {
  let importStatements = "";
  for (const componentName of usedSvelteComponentNames) {
    // Use Vite's normalizePath for proper cross-platform path handling
    const componentPath = normalizePath(
      `${componentDirPath}/${componentName}.svelte`
    );

    // Generate the import statement
    importStatements += `\timport ${componentName} from '${componentPath}';\n`;
  }
  return importStatements;
};
