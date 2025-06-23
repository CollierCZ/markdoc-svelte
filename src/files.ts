import FS from "fs";
import Path from "path";

import { normalizePath } from "vite";

import log from "./logs.ts";

/**
 * Converts a path starting with "/" to a project-relative path starting with "./".
 *
 * @param path The path that might start with "/"
 * @returns The path converted to be project-relative if it started with "/"
 */
export const makePathProjectRelative = (path: string): string => {
  if (path.startsWith("/")) {
    return "." + path; // Convert "/markdoc" to "./markdoc"
  }
  return path;
};

// Helper to normalize path separators using Vite's normalizePath
export const normalizeAbsolutePath = (absolutePath: string): string => {
  // Ensure the input is treated as absolute before normalizing
  const resolvedPath = Path.resolve(absolutePath);
  return normalizePath(resolvedPath);
};

/**
 * Finds the first directory that exists from a list of potential paths.
 * @param potentialPaths An array of relative or absolute paths to check.
 * @returns The absolute, normalized path of the first directory found, or null if none exist.
 */
export const findFirstDirectory = (potentialPaths: string[]): string | null => {
  for (let relativeOrAbsolutePath of potentialPaths) {
    relativeOrAbsolutePath = makePathProjectRelative(relativeOrAbsolutePath);

    // Resolve the path to ensure it's absolute for existsSync check
    const potentialAbsolutePath = Path.resolve(relativeOrAbsolutePath);
    if (FS.existsSync(potentialAbsolutePath)) {
      // Check if it's actually a directory
      try {
        const stats = FS.statSync(potentialAbsolutePath);
        if (stats.isDirectory()) {
          // Normalize the path for consistency before returning
          return normalizeAbsolutePath(potentialAbsolutePath);
        }
      } catch (e) {
        // Ignore errors like permission issues, treat as non-existent
        log.error(
          `Error checking stats for '${potentialAbsolutePath}', skipping.`,
          e,
        );
      }
    }
  }
  return null; // No existing directory found
};
