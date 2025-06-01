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
  let config: Config["partials"] | null = null; // Return value
  const deps: string[] = []; // Return value
  let loaded = false; // Flag to track partials load status

  // Resolve path to directory
  const dir = isExplicit ? directory : Path.resolve(directory, "partials");
  const dirExists = FS.existsSync(dir);

  // Is directory found?
  if (!dirExists) {
    if (isExplicit)
      // Warn user if they explicitly provided a path that is not found
      log.warn(
        `Specified "partialsDirectory" option '${directory}' not found.`,
      );
    return { config: null, deps: [] };
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
        loaded = true;
        // const name = Path.basename(file, ext);
        // log.debug(`Loaded partial '${name}' from '${path}'`);
      } catch (e) {
        log.error(`Error parsing partial file '${path}':`, e);
      }
    }
  } catch (e) {
    log.error(`Error reading partials directory '${directory}':`, e);
    return { config, deps: [...new Set(deps)] };
  }

  // Provide user feedback if folder exists but no valid files were loaded
  if (dirExists && !loaded) {
    const message = `Partials directory '${dir}' found, but no valid partial files (${extensions.join(", ")}) were loaded. Check for errors.`;
    // Warn user if they explicitly provided a path
    if (isExplicit) {
      log.warn(message);
    } else {
      log.info(message + " This may be intentional.");
    }
  }

  // log.debug(`Partials Dependencies: ${deps.toString()}`);
  // log.debug(`Partials Config: ${JSON.stringify(config)}`);

  return { config, deps: [...new Set(deps)] };
};

export default loadPartials;
