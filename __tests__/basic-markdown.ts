import { markdoc } from "../src/index";

const basicMarkdown = `
# This is some basic markdown

With a paragraph.

Some text **in bold** and *in italic*.

And a [link](https://example.com).

And even a table with a nested list:

{% table %}
* Heading 1
* Heading 2
---
* * Row 1 Cell 1 Item 1
  * Row 1 Cell 1 Item 2
* Row 1 Cell 2
---
* Row 2 Cell 1
* Row 2 cell 2
{% /table %}
`;

const markdownWithFrontmatter = `---
title: A test
description: A longer idea
keywords:
  - one
  - two
---

Content. Such great content.
`;

const layoutObject = { layout: "/path/to/layout.svelte" }

const basicMarkdownObject = { content: basicMarkdown, filename: "test.md" }
const basicMarkdownWithFrontmatterObject = { content: markdownWithFrontmatter, filename: "test.md" }

test(`parses basic Markdown properly`, () => {
  expect(
    markdoc().markup(basicMarkdownObject)
  ).toMatchSnapshot();
});

test(`parses basic Markdown properly with a layout`, () => {
  expect(
    markdoc(layoutObject).markup(basicMarkdownObject)
  ).toMatchSnapshot();
});

test(`parses basic Markdown with frontmatter properly`, () => {
  expect(
    markdoc().markup(basicMarkdownWithFrontmatterObject)
  ).toMatchSnapshot();
});

test(`parses basic Markdown with frontmatter properly with a layout`, () => {
  expect(
    markdoc(layoutObject).markup(basicMarkdownWithFrontmatterObject)
  ).toMatchSnapshot();
});
