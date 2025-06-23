import FS from "fs";
import Path from "path";

import type { Config } from "@markdoc/markdoc";
import Markdoc from "@markdoc/markdoc";

import log from "./logs.ts";

/**
 * Loads Markdoc partials from a specified directory.
 *
 * @param directory - The absolute, normalized path to the directory containing partial files.
 * @param extensions - An array of file extensions (e.g., ['.mdoc', '.md']) to consider as partials.
 * @param isExplicit - A boolean indicating if `directory` was set explicitly by the user. (default: false)
 * @returns An object with two properties:
 * - config: The loaded Markdoc partials configuration (or null if none found).
 * - deps: An array of absolute file paths as dependencies for Svelte preprocessor.
 */
const loadPartials = (
  directory: string,
  extensions: string[],
  isExplicit: boolean = false,
): {
  config: Config["partials"] | null;
  deps: string[];
} => {
  let config: Config["partials"] | null = null;
  const deps: string[] = [];
  let partialsLoaded = false; // Flag to track partials load status

  // Resolve path to directory
  const dir = isExplicit ? directory : Path.resolve(directory, "partials");

  // Check if directory exists
  const dirExists = FS.existsSync(dir);
  if (!dirExists) {
    // If passed a directory path, warn that it wasn't found
    if (isExplicit)
      log.warn(
        `Specified "partialsDirectory" option '${directory}' not found.`,
      );
    return { config: config, deps: deps };
  }

  // Directory exists, try loading and parsing files incrementally
  try {
    const files = FS.readdirSync(dir);
    for (const file of files) {
      const path = Path.posix.join(dir, file);
      const ext = Path.extname(file);
      // Check for valid file and extension
      try {
        const stats = FS.statSync(path);

        // Ignore if not valid
        if (!stats.isFile() || !extensions.includes(ext)) {
          continue;
        }
      } catch (e) {
        log.error(`Error reading '${path}', skipping.`, e);
        continue;
      }
      // Parse valid files as Markdoc
      try {
        const content = FS.readFileSync(path, "utf8");
        if (!config) config = {};
        config[file] = Markdoc.parse(content);
        deps.push(path);
        partialsLoaded = true;
      } catch (e) {
        log.error(`Error parsing partial file '${path}':`, e);
      }
    }
  } catch (e) {
    log.error(`Error reading partials directory '${directory}':`, e);
    return { config, deps: [...new Set(deps)] };
  }

  // Provide feedback if folder exists but no valid files were loaded
  if (dirExists && !partialsLoaded) {
    const message = `Partials directory '${dir}' found, but no valid partial files (with the extensions ${extensions.join(", ")}) were loaded. Check for errors.`;
    // Warn if explicitly provided a path
    if (isExplicit) {
      log.warn(message);
    } else {
      log.info(message + " This may be intentional.");
    }
  }

  return { config, deps: [...new Set(deps)] };
};

export default loadPartials;
