import MarkdownIt from "markdown-it";

const { escapeHtml } = MarkdownIt().utils;

const BRACKET_ESCAPE_TEST_RE = /[{}]/;
const BRACKET_ESCAPE_REPLACE_RE = /[{}]/g;
const BRACKET_REPLACEMENTS = {
  "{": "&lcub;",
  "}": "&rcub;",
};

const replaceUnsafeChar = (character: string): string => {
  if (character === "{" || character === "}") {
    return BRACKET_REPLACEMENTS[character];
  }
  return character;
};

export const escapeMarkdocBrackets = (
  str: string,
  includeOtherHtml = true
): string => {
  if (BRACKET_ESCAPE_TEST_RE.test(str)) {
    return str.replace(BRACKET_ESCAPE_REPLACE_RE, replaceUnsafeChar);
  }
  return includeOtherHtml ? escapeHtml(str) : str;
};

const BRACKET_UNESCAPE_TEST_RE = /(&lcub;|&rcub;)/;
const BRACKET_UNESCAPE_REPLACE_RE = /(&lcub;|&rcub;)/g;

const replaceEscapedBracket = (escapedBracket: string) => {
  return (
    Object.keys(BRACKET_REPLACEMENTS).find(
      // @ts-ignore
      (key) => BRACKET_REPLACEMENTS[key] === escapedBracket
    ) || ""
  );
};

export const unescapeMarkdocBrackets = (str: string) => {
  if (BRACKET_UNESCAPE_TEST_RE.test(str)) {
    return str.replace(BRACKET_UNESCAPE_REPLACE_RE, replaceEscapedBracket);
  }
  return str;
};
