const basicMarkdown = `
This is some text

`;

export const basicMarkdoc = `
# This is some basic Markdoc

With a paragraph.

Some text **in bold** and *in italic*.

And a [link](https://example.com).

## More fancy stuff

Some \`<p>\` inline code.

And a code block:

\`\`\`javascript {% process=false %}
{{% test %}}
\`\`\`

And even a table with a nested list:

{% table %}
* Table header 1
* Table header 2
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

export const markdocWithComponent = `${basicMarkdoc}
{% button text="Hello world" /%}
`;

export const markdocWithVariable = `${basicMarkdown}
{% $product.name %}
`;

export const markdocWithFunction = `${basicMarkdown}
This text will be transformed: {% uppercase("uppercase") %}
`;

export const markdocWithPartial = `${basicMarkdown}
{% partial file="content.md" /%}
`;

export const markdocWithPartialAndVariable = `${basicMarkdown}
{% partial file="content.md" variables={ product: { name: "Abuela" } } /%}
`;
