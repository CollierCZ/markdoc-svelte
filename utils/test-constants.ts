export const basicMarkdoc = `
# This is some basic Markdoc

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

export const markdocWithFrontmatter = `---
title: A test
description: A longer idea
keywords:
  - one
  - two
---

Content. Such great content.
`;