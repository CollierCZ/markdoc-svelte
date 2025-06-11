export const commonMark = `# Heading Level 1
  ## Heading Level 2
  ### Heading Level 3
  #### Heading Level 4
  ##### Heading Level 5
  ###### Heading Level 6

  ## Stext Heading
  This is a heading specifically for testing **strong text** (stext) within a heading.

  This is a paragraph. It contains some text content to demonstrate how paragraphs work in Markdown.

  ---

  This is a horizontal rule (HR) using three dashes.

  ***

  This is a horizontal rule (HR) using three asterisks.

  ___

  This is a horizontal rule (HR) using three underscores.

  ![Alt text for the image](https://example.com/image.jpg "Image Title")

  \`\`\`javascript
  // Fenced code block with Markdoc brackets {} and multiple lines
  const obj = { key: 'value' };
  console.log(\`Hello, {world}! Template: $\{obj.key}\`);
  function test() {
    return { nested: true };
  }
  \`\`\`

  > This is a blockquote.
  > It can span multiple lines.

  1. Ordered list item 1
  2. Ordered list item 2
    - Unordered sublist item 1
    - Unordered sublist item 2
  3. Ordered list item 3

  - Unordered list item 1
  - Unordered list item 2
    1. Ordered sublist item 1
    2. Ordered sublist item 2
  - Unordered list item 3

  This is **strong text**.
  This is *emphasized text*.
  This is ~~strikethrough text~~.

  This is a [link](https://example.com "Link Title") to an external website.
  This is a [link with tricky chars in title](https://example.com/tricky "Title with < > & \\" ' characters") testing attribute escaping.

  Here is some \`inline code\` within a sentence.
  Here is inline code with brackets: \`{ example: true }\`.

  This is a line of text.
  This is another line of text after a hard break.

  This is a line of text with a soft break
  and it continues on the next line.

  ### Tabs
  Here is a line with a tab:
  \tThis line starts with a tab character.

  ### Special Characters
  Here are some special characters:
  \`! @ # $ % ^ & * ( ) - _ + = { } [ ] | \ : ; " ' < > , . ? / ~\`

  ### Backslash-Escaped Characters
  Here are some backslash-escaped characters:
  \\ Backslash
  \` Backtick
  \* Asterisk
  \_ Underscore
  \{ Curly brace open
  \} Curly brace close
  \[ Square bracket open
  \] Square bracket close
  \( Parenthesis open
  \) Parenthesis close
  \# Hash
  \+ Plus
  \- Minus
  \. Period
  \! Exclamation mark

  ### Valid HTML Entities or Numeric Characters
  Here are some valid HTML entities and numeric characters:
  &copy; (©)
  &reg; (®)
  &#169; (© using numeric code)
  &#174; (® using numeric code)
  &amp; (&)
  &lt; (<)
  &gt; (>)
  &quot; (")
  &apos; (')

  ### Indented Code Block
      // This is an indented code block with Markdoc brackets {}
      function greet() {
          const config = { enabled: true };
          console.log("Hello from {indented} code block!", config);
      }

  ### HTML Block
  <div>
    <p>This is a block of raw HTML.</p>
    <p>It will render as HTML if supported.</p>
  </div>

  ### Indented Code Fence
      \`\`\`
      // This is an indented code fence with {brackets}
      console.log("Indented {code} fence example");
      \`\`\`

  ### Inline Code Example in Another Block
  Here is an example of inline code within a blockquote:

  > This is a blockquote with \`inline code\` and \`{ bracketed: code }\` inside it.
`;

export const markdocBuiltInTags = `### Basic table
  {% table %}
  * Heading 1
  * Heading 2
  ---
  * Row 1 Cell 1
  * Row 1 Cell 2
  ---
  * Row 2 Cell 1
  * Row 2 cell 2
  {% /table %}

  ### Table with rich content
  {% table %}
  * Foo
  * Bar
  * Baz
  ---
  *
    \`\`\`
    puts "Some code here."
    \`\`\`
  *
    {% if %}
    * Bulleted list in table
    * Second item in bulleted list
    {% /if %}
  * Text in a table
  ---
  *
    A "loose" list with

    multiple line items
  * Test 2
  * Test 3
  ---
  * Test 1
  * A cell that spans two columns {% colspan=2 %}
  {% /table %}

  ### Table without headings
  {% table %}
  ---
  * foo
  * bar
  ---
  * foo
  * bar
  {% /table %}

  ### Table with col and row span
  {% table %}
  ---
  * foo
  * bar
  ---
  * foo {% colspan=2 %}
  {% /table %}

  ### Table with text alignment
  {% table %}
  * Column 1 {% align="center" %}
  * Column 2
  * Column 3 {% align="right" %}
  ---
  * foo
  * bar
  * baz
  ---
  * foo
  * bar {% align="right" %}
  * baz
  ---
  * foo {% align="center" %}
  * bar
  * baz
  {% /table %}
`;

export const noFrontmatter = `# Regular Markdown Content`;

export const withFrontmatter = `---
title: Test Title
author: Test Author
tags: [test, markdoc]
---

# Content with Frontmatter
# {% $frontmatter.title %}
Author: {% $frontmatter.author %}
Tags: {% $frontmatter.tags %}
Published: {% default($frontmatter.published, "Not specified") %}
`;

export const noComponents = `# Regular Content`;

export const multipleComponents = `{% custom-component title="Welcome" description="This is a test component" %}
This is the content inside the custom component.
It can contain **markdown** and other elements.
{% /custom-component %}

{% another-component status="active" count=5 %}
This is content inside another component.
It shows the status and count values.
{% /another-component %}
`;

export const withLayoutAndFrontmatter = `---
title: Layout Test
description: Testing layout with frontmatter
---
# Page with a Layout
This content should be wrapped by a layout.
Description: {% $frontmatter.description %}
`;

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

export const invalidMarkdoc = `
# Invalid Markdoc Example

{% $undefinedVariable %}

Some content here that should trigger validation errors

{% table %}
* Header 1
* Header 2
---
* Cell 1
* Cell 2
{% /table %}

Using an undefined variable should be a warning, not critical
`;

export const markdocWithComments = `
# Test Document

<!-- This is a comment about the heading -->

Some content here.

<!-- 
  This is a multi-line comment
  with some additional information
-->

More content after the comment.
`;
