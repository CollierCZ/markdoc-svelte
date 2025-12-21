// From Markdown-it Utils EscapeHtml
// https://github.com/markdown-it/markdown-it/blob/master/lib/common/utils.mjs

const HTML_SVELTE_ESCAPE_TEST_RE = /[&<>"{}]/;
const HTML_SVELTE_ESCAPE_REPLACE_RE = /[&<>"{}]/g;

const HTML_SVELTE_REPLACEMENTS = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "{": "&lcub;", // Escape '{' for Svelte
  "}": "&rcub;", // Escape '}' for Svelte
};

const replaceUnsafeChar = (match: string): string => {
  const key = match as keyof typeof HTML_SVELTE_REPLACEMENTS;
  return HTML_SVELTE_REPLACEMENTS[key] ?? match;
};

/**
 * Escapes characters unsafe for HTML attributes and text content.
 * Also escapes '{' and '}' characters using HTML entities
 * to prevent Svelte from interpreting them as template syntax.
 *
 * @param str The string to escape.
 * @returns The escaped string.
 */
export const escapeHtml = (str: string): string => {
  // Ensure input is a string, handle null/undefined gracefully
  if (HTML_SVELTE_ESCAPE_TEST_RE.test(str)) {
    return str.replace(HTML_SVELTE_ESCAPE_REPLACE_RE, replaceUnsafeChar);
  }
  return str;
};
