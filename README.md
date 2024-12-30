# markdoc-svelte

Preprocess [Markdoc](https://markdoc.io/) files for use in Svelte Kit sites.

## Use

Add the `.md` extension and the `markdoc` preprocessor to your Svelte Kit configuration:

```javascript
import { markdoc } from "markdoc-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".md"],
  preprocess: [markdoc()],
};
```

## Add custom schema

Markdoc allows you to configure various options for parsing:

- [Functions](https://markdoc.dev/docs/functions)
- [Nodes](https://markdoc.dev/docs/nodes)
- [Partials](https://markdoc.dev/docs/partials)
- [Tags](https://markdoc.dev/docs/tags)
- [Variables](https://markdoc.dev/docs/variables)

To include these options in your preprocessing, pass them in the configuration.
You can do this in two ways:

- Pass each individually as an option.
- Create a schema directory to include files that define each option for you.
  Include that directory in the [markdown-svelte configuration](#schema-path).

In each case, imports happen before bundling, so import files as relative paths to JavaScript files with the extension.
Use JavaScript files or run Node.js with a tool such as [tsx](https://tsx.is/) to use TypeScript.

### Functions

Use Markdoc [functions](https://markdoc.dev/docs/functions) to transform content.
Include them as a file or directory in your [Markdoc schema directory](#schema-path)
or in the markdoc-svelte configuration.

```javascript
import { markdoc } from "markdoc-svelte";

const uppercase = {
  transform(parameters) {
    const string = parameters[0];

    return typeof string === "string" ? string.toUpperCase() : string;
  },
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    markdoc({
      functions: { uppercase },
    }),
  ],
};
```

### Nodes

Use Markdoc [nodes](https://markdoc.dev/docs/nodes) to customize how standard Markdown elements are rendered.
Include them as a file or directory in your [Markdoc schema directory](#schema-path)
or in the markdoc-svelte configuration.

Imports happen before bundling, so import files as relative paths to JavaScript files with the extension.

```javascript
import { markdoc } from "markdoc-svelte";
import { link } from "./markdown/link.js";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    markdoc({
      nodes: { link },
    }),
  ],
};
```

### Partials

Use Markdoc [partials](https://markdoc.dev/docs/partials) to reuse blocks of content in various places.
Include them in a directory in your [Markdoc schema directory](#schema-path)
or define a partials directory as a relative path in the markdoc-svelte configuration.

```javascript
import { markdoc } from "markdoc-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    markdoc({
      partials: "./markdoc/partials",
    }),
  ],
};
```

### Tags

Use Markdoc [tags](https://markdoc.dev/docs/tags) to extend Markdown elements to do more.
Include them as a file or directory in your [Markdoc schema directory](#schema-path)
or in the markdoc-svelte configuration.

Imports happen before bundling, so import files as relative paths to JavaScript files with the extension.

```javascript
import { markdoc } from "markdoc-svelte";
import { button } from "./markdown/button.js";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    markdoc({
      nodes: { button },
    }),
  ],
};
```

### Variables

Use Markdoc [variables](https://markdoc.dev/docs/variables) to customize content during the build.
Include them as a file in your [Markdoc schema directory](#schema-path)
or in the markdoc-svelte configuration.

```javascript
import { markdoc } from "markdoc-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    markdoc({
      variables: { flags: { best_feature_flag: true } },
    }),
  ],
};
```

## Code blocks

Markdoc tags are processed as the first thing.
This allows you to do things like use Markdoc variables inside code blocks.
But sometimes you want to include text like `{% %}` inside a code block.

To mark a single code block to not be processed for tags,
add a attribute to the block:

````markdown
```markdown {% process = false %}
Use variables in your code: `{% product_name %}`
```
````

To set this as the default option, create a custom `fence` node and set a different default
([example](https://github.com/markdoc/markdoc/issues/503#issuecomment-2079771178)).

## Frontmatter

Frontmatter added as YAML is automatically parsed.
So you could add frontmatter like the following:

```markdown
---
title: A great page
---

With great content
```

You can then access it in your layouts:

```svelte
<script lang="ts">
  let {
    children,
    title = '',
  } = $props()
</script>

<h1>{ title }</h1>

<!-- Article content -->
{@render children?.()}
```

And in your content:

```markdown
---
title: Using the Next.js plugin
description: Integrate Markdoc into your Next.js app
---

# {% $frontmatter.title %}
```

## Options

You can choose to customize how Markdoc files are processed.

### Extensions

By default, files ending in `.markdoc` and `.md` are preprocessed.
To use other extensions, add them to the `extensions` array in the options:

```javascript
import { markdoc } from "markdoc-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".markdoc", ".md"],
  preprocess: [
    markdoc({
      extensions: [".svelte", ".markdoc", ".md"],
    }),
  ],
};
```

### Layout

To give your processed Markdoc a layout, pass the path to the layout file:

```javascript
import { markdoc } from "markdoc-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".md"],
  preprocess: [
    markdoc({
      layout: "/path/to/layout.svelte",
    }),
  ],
};
```

[Frontmatter](#frontmatter) in YAML format is automatically passed to your layout as props.
The content is passed as children that can then be rendered.

```svelte
<script lang="ts">
  let {
    children,
    title = '',
  } = $props()
</script>

<h1>{ title }</h1>

<!-- Article content -->
{@render children?.()}
```

### Schema path

To define Markdoc options, you can use a directory that holds multiple options.
You can define each option as a single file or a directory with an `index.js` file that exports the option.
Except for partials, which is a directory holding Markdoc files.

Example structure:

```tree
markdoc
├── functions.js
├── nodes
│   ├── heading.js
│   ├── index.js
│   └── callout.js
├── partials
│   ├── content.markdoc
│   └── more-content.markdoc
├── tags.js
└── variables.js
```

By default, the preprocessor looks for your Markdoc schema definition in a `./markdoc` directory at the app root.
To use a different path, define the directory in the options as a relative path.

```javascript
import { markdoc } from "markdoc-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    markdoc({
      schema: "./path/to/schema/directory",
    }),
  ],
};
```

### Markdoc config options

In addition to the option to include Markdoc configuration as a single directory,
you can pass each option individually:

- [Functions](#functions)
- [Nodes](#nodes)
- [Partials](#partials)
- [Tags](#tags)
- [Variables](#variables)
