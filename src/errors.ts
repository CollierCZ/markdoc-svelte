import type { ValidateError } from "@markdoc/markdoc";

import log from "./logs.ts";
import type { ValidationLevel } from "./types";

/**
 * Map Markdoc error levels to a numeric value for comparison, higher number means more severe
 * Set breaking level to throw Error based on validation level
 */
const errorLevelsMap = new Map<ValidateError["error"]["level"], number>([
  ["debug", 0],
  ["info", 1],
  ["warning", 2],
  ["error", 3],
  ["critical", 4],
]);

/**
 * Handles Markdoc validation errors.
 * Logs non-breaking errors and throws an error if breaking errors are found
 * based on the configured validation level.
 *
 * @param errors - The array of validation errors from Markdoc.validate.
 * @param validationLevel - The configured level at which to throw an error.
 * @param filename - The name of the file being processed (for logging).
 * @throws Error if any errors are at or above the specified validationLevel.
 */
export function handleValidationErrors(
  errors: ValidateError[],
  validationLevel: ValidationLevel,
  filename: string,
): void {
  if (!errors || errors.length === 0) {
    return; // No errors to handle
  }

  const breakingLevel = errorLevelsMap.get(validationLevel)!; // Use '!' as we control the input type

  const breakingErrors: ValidateError[] = [];
  const nonBreakingErrors: ValidateError[] = [];

  for (const error of errors) {
    const errorLevel = error.error.level;
    const errorLevelValue = errorLevelsMap.get(errorLevel);

    if (errorLevelValue !== undefined && errorLevelValue >= breakingLevel) {
      breakingErrors.push(error);
    } else {
      nonBreakingErrors.push(error);
    }
  }

  // Log non-breaking errors
  for (const error of nonBreakingErrors) {
    const { type, lines, error: errorDetails } = error;
    // Ensure lines has at least one element for the start line
    const startLine = lines[0];
    const endLine = lines[1];
    const locString = `${filename}:${startLine}${startLine !== endLine ? `-${endLine}` : ""}`;

    const message = `(${type}) ${errorDetails.message} at ${locString}`;

    switch (errorDetails.level) {
      case "debug":
        log.debug(message);
        break;
      case "info":
        log.info(message);
        break;
      case "warning":
        log.warn(message);
        break;
      // 'error' and 'critical' levels when they are below the breakingLevel
      case "error":
      case "critical":
      default:
        log.error(message); // Log higher levels as errors
        break;
    }
  }

  // Throw if breaking errors exist
  if (breakingErrors.length > 0) {
    const summary = `Markdoc validation failed in ${filename}. Found ${breakingErrors.length} error${breakingErrors.length > 1 ? "s" : ""} at or above configured level "${validationLevel}".`;

    log.error(summary);

    // Create a more readable list of breaking errors for the message
    const detailedErrorMessage = breakingErrors
      .map((error) => {
        const { type, lines, error: errorDetails } = error;
        const startLine = lines[0];
        const endLine = lines[1];
        const locString = `${filename}:${startLine}${startLine !== endLine ? `-${endLine}` : ""}`;
        return `${errorDetails.level.toUpperCase()} (${type}): ${errorDetails.message} at ${locString}`;
      })
      .join("\n");

    const errorMessage = `${summary}\n\n${detailedErrorMessage}\n\n`;
    log.error(errorMessage);

    throw new Error(errorMessage);
  }
}
