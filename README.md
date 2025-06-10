# markdoc-svelte

<span class="badge-npmversion"><a href="https://npmjs.org/package/markdoc-svelte" title="View this project on NPM"><img src="https://img.shields.io/npm/v/markdoc-svelte.svg" alt="NPM version" /></a></span>

Process Markdown and Markdoc files into Svelte components using [Markdoc](https://markdoc.dev/).
Use Markdoc defaults out of the box or configure Markdoc schema to your needs.

## Table of Contents

- [Install](#install)
- [Basic example](#basic-example)
- [Frontmatter](#frontmatter)
- [Customize Markdoc](#customize-markdoc)
  - [Direct definitions](#direct-definitions)
  - [Configuration folder](#configuration-folder)
  - [Relative imports](#relative-imports)
- [Preprocessor Options](#preprocessor-options)
  - [Functions](#functions)
  - [Nodes](#nodes)
  - [Partials](#partials)
  - [Tags](#tags)
  - [Typographer](#typographer)
  - [Validation level](#validation-level)
  - [Variables](#variables)
- [Advanced](#advanced)
  - [Markdoc limitations](#markdoc-limitations)
  - [@sveltejs/enhanced-img](#sveltejsenhanced-img)

## Install

Install `markdoc-svelte` in your SvelteKit project.

```bash
npm install markdoc-svelte
```

Amend your SvelteKit config in `svelte.config.js` to:

- Process files with the extensions you choose (such as `.mdoc` and `.md`).
- Include the preprocessor.

```javascript
import { markdocPreprocess } from "markdoc-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".mdoc", ".md"],
  preprocess: [markdocPreprocess()],
};
```

## Basic example

Create a directory to hold your markdoc files: `src/lib/markdoc`

In that directory (at `src/lib/markdown/content.md`), add an example with basic Markdown syntax:

```markdown
---
title: Hello World
---

# Hello World

This is a file that is processed by `markdoc-svelte`.

![Alt text](/path/to/image.jpg)
```

Dynamically import all files in the directory using a catchall route at `src/routes/[...catchall]/+page.ts`:

```typescript
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { MarkdocModule } from "markdoc-svelte";

export const load: PageLoad = async ({ params }) => {
  const slug = params.catchall;
  try {
    const page = (await import(`$lib/markdown/${slug}.md`)) as MarkdocModule;
    return { page };
  } catch {
    throw error(404, `No corresponding file found for the slug "${slug}"`);
  }
};
```

Render the imported file as a Svelte component in a file at `src/routes/[...catchall]/+page.svelte`:

```svelte
<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>{data.page.frontmatter?.title ?? 'Undefined title'}</title>
</svelte:head>

<data.page.default />
```

Run your dev server and visit `/content` to see the rendered file.

## Frontmatter

Optionally define YAML frontmatter in your file.
Then use it in your content with the `$frontmatter` variable.

```markdown
---
title: Why I switched to Markdoc
description: What the benefits of Markdoc are and how to take advantage of them.
---

# {% $frontmatter.title %}
```

You can also access the frontmatter in your Svelte page components.
Get it from the data you defined in `+page.ts`:

```svelte
<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>{data.page.frontmatter?.title ?? 'Default title'}</title>
  <meta name="description" content={data.page.frontmatter?.description ?? 'Default description'} />
</svelte:head>

<data.page.default />
```

## Customize Markdoc

To add additional features to the syntax of your files, customize your Markdoc schema.
You can add the following extensions:

- [Nodes](#nodes)
- [Tags](#tags)
- [Variables](#variables)
- [Functions](#functions)
- [Partials](#partials)

You can customize schema in two ways:

- **For a single extension** or simple extensions, pass directly to the preprocessor options.
- **For multiple extensions at once** or more complex configurations,
  create a configuration folder with schema definitions.

For each extension (such as `nodes`),
schema definitions passed directly overwrite configuration from a folder.

### Direct definitions

To define any of the extension points directly,
pass it to the preprocessor options as the name of the extension.
For example, to define a `$site.name` variable, pass the following:

```javascript
import { markdocPreprocess } from "markdoc-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".mdoc"],
  preprocess: [
    markdocPreprocess({
      variables: {
        site: {
          name: "Markdoc Svelte",
        },
      },
    }),
  ],
};
```

### Configuration folder

For multiple extensions or more complex configurations, create a folder with your entire Markdoc schema.

By default, the preprocessor looks for a schema in the `./markdoc` and `./src/markdoc` directories.

Define each extension point as a single file
or as a directory with an `index.ts` or `index.js` file that exports it.
Partials must be a directory holding Markdoc files.

All extension points are optional.

Example structure:

```
markdoc
├── functions.ts
├── nodes
│   ├── heading.ts
│   ├── index.ts
│   └── callout.ts
├── partials
│   ├── content.mdoc
│   └── more-content.mdoc
├── tags.ts
└── variables.ts
```

For example, create custom nodes in `markdoc/nodes.ts`:

```typescript
import type { Config } from "markdoc-svelte";
import { Markdoc } from "markdoc-svelte";

const nodes: Config["nodes"] = {
  image: {
    render: "EnhancedImage",
    attributes: {
      ...Markdoc.nodes.image.attributes, // Include the default image attributes
    },
  },
};

export default nodes;
```

Or create an index file to export all custom nodes from `markdoc/nodes/index.ts`
(remember to use [relative imports](#relative-imports)):

```typescript
import image from "./image.ts";
import link from "./link.ts";
import paragraph from "./paragraph.ts";
import type { Config } from "markdoc-svelte";

const nodes: Config["nodes"] = {
  image,
  link,
  paragraph,
};

export default nodes;
```

### Relative imports

You can use relative imports to import definitions from either `.js` or `.ts` files.
Just remember to include the file extension.

For example, if you define custom functions in `src/lib/functions.js`,
add them to your schema as follows:

```javascript
import { markdocPreprocess } from "markdoc-svelte";
import functions from "./src/lib/functions.js";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    markdocPreprocess({
      functions: functions,
    }),
  ],
};
```

## Preprocessor Options

| Option            | Type                | Default                          | Description                                                               |
| ----------------- | ------------------- | -------------------------------- | ------------------------------------------------------------------------- |
| `comments`        | boolean             | `true`                           | Enable [Markdown comments](https://spec.commonmark.org/0.30/#example-624) |
| `components`      | string              | `"$lib/components"`              | Svelte components directory for custom nodes and tags                     |
| `extensions`      | string[]            | `[".mdoc", ".md"]`               | Files to process with Markdoc                                             |
| `functions`       | Config['functions'] | -                                | [Functions config](#functions)                                            |
| `layout`          | string              | -                                | Default layout for all processed Markdown files                           |
| `linkify`         | boolean             | `false`                          | Auto-convert bare URLs to links                                           |
| `nodes`           | Config['nodes']     | -                                | [Nodes config](#nodes)                                                    |
| `partials`        | string              | -                                | [Partials](#partials) directory path                                      |
| `schema`          | string              | `["./markdoc", "./src/markdoc"]` | Schema directory path                                                     |
| `tags`            | Config['tags']      | -                                | [Tags config](#tags)                                                      |
| `typographer`     | boolean             | `false`                          | Enable [typography replacements](#typographer)                            |
| `validationLevel` | ValidationLevel     | `"error"`                        | [Validation strictness level](#validation-level)                          |
| `variables`       | Config['variables'] | -                                | [Variables config](#variables)                                            |

### Functions

[Functions](https://markdoc.dev/docs/functions) enable you to add custom utilities to Markdown
so you can transform content and variables.

For example, you could add a function for transforming strings to uppercase to `markdoc/functions.ts`:

```javascript
import type { Config } from "markdoc-svelte";

const functions: Config["functions"] = {
  uppercase: {
    transform(parameters) {
      const string = parameters[0];

      return typeof string === "string" ? string.toUpperCase() : string;
    },
  },
};

export default functions;
```

Then you can use the custom function in a Markdown file:

```markdown
---
title: Hello World
---

This is a {% uppercase(markdown) %} file that is processed by `markdoc-svelte`.
```

### Nodes

[Nodes](https://markdoc.dev/docs/nodes) are elements built into Markdown from the CommonMark specification.
Customizing nodes enables you to change how existing elements from Markdown are rendered using Svelte components.
The components are automatically loaded from the components directory defined in your configuration.

For example, you might want to customize how images are displayed using the `@sveltejs/enhanced-img` plugin.
First, define a custom node in `markdoc/nodes.ts`:

```typescript
import type { Config } from "markdoc-svelte";
import { markdocPreprocess } from "markdoc-svelte";

const nodes: Config["nodes"] = {
  image: {
    render: "EnhancedImage",
    attributes: {
      // Include the default image attributes
      ...Markdoc.nodes.image.attributes,
    },
  },
};
```

Then add an EnhancedImage component in `src/lib/components/EnhancedImage.svelte`:

```svelte
<script lang="ts">
  // Glob import all Markdown images
  const imageModules = import.meta.glob(
  '$lib/images/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp,svg}',
    {
      eager: true,
      query: {
          enhanced: true,
      },
    }
  ) as Record<string, { default: string }>;

  const { src, alt, ...restProps } = $props();

  // Find the image module that matches the src
  const matchingPath = Object.keys(imageModules).find((path) => path.endsWith(src));
  const image = matchingPath ? imageModules[matchingPath].default : undefined;
</script>

{#if image}
  <!-- Render the image with the enhanced-img plugin -->
  <enhanced:img src={image} {alt} {...restProps} />
{:else}
  <img src={src} {alt} {...restProps} />
{/if}
```

Now your EnhancedImage component handles images added through standard Markdown syntax:

```markdown
![A cat sleeping on a balcony](awesome-cat.png)
```

### Partials

[Partials](https://markdoc.dev/docs/partials) are ways to reuse content across files (through [transclusion](https://en.wikipedia.org/wiki/Transclusion)).
The partials defined in your configuration must be a directory of Markdoc files.

For example, you could have a file structure like the following:

```
| markdoc/
|-- partials/
|   |-- content.mdoc
|   └── post.mdoc
```

These files can be included in other files as follows:

```markdown
---
title: Hello World
---

# Hello World

This is a file that is processed by `markdoc-svelte`.

{% partial file="content.mdoc" %}

{% partial file="post.mdoc" %}
```

### Tags

[Tags](https://markdoc.dev/docs/tags) are ways to extend Markdown syntax to do more.
You can add functionality through Svelte components

For example, you might want to create a custom Callout tag to highlight information on a page
(these are also known as admonitions).
First, define the tag in `markdoc/tags.ts`:

```javascript
import type { Config } from "markdoc-svelte";

const tags: Config["tags"] = {
  callout: {
    // The Svelte component to render the tag
    render: "Callout",
    // What tags it can have as children
    children: ["paragraph", "tag", "list"],
    // Define the type of callout through an attribute
    attributes: {
      type: {
        type: String,
        default: "note",
        matches: ["caution", "check", "note", "warning"],
        errorLevel: "critical",
      },
      title: {
        type: String,
      },
    },
  },
};

export default tags;
```

Then create a Callout component for tag in `src/lib/components/Callout.svelte`:

```svelte
<script lang="ts">
  let { title, type, children } = $props();
</script>

<div class={`callout-${type}`}>
  <div class="content">
    <div class="copy">
      <span class="title">{title}</span>
      <span>{@render children()}</span>
    </div>
  </div>
</div>
```

Then you can use the Callout tag in a Markdoc file:

```markdown
---
title: Hello World
---

{% callout type="caution" title="Hello" %}
This is a caution callout.
{% /callout %}
```

### Typographer

Choose whether to turn on typographic replacements from [markdown-it](https://github.com/markdown-it/markdown-it).
See the options in action at the [markdown-it demo](https://markdown-it.github.io/)
(select or deselect `typographer`).
Defaults to false.

### Validation level

The preprocessor validates whether the Markdoc is valid.
By default, it throws an error on files for issues at the `error` or `critical` level.
To debug, you can set the level to a lower level to stop the build for any errors at that level or above.
Possible values in ascending order: `debug`, `info`, `warning`, `error`, `critical`.

### Variables

[Variables](https://markdoc.dev/docs/variables) are ways to customize your documents at runtime.
This way the Markdoc content stays the same, but the generated HTML can vary,
such as if you're publishing the same content to various sites.

For example, you might define a `$site.name` variable in `markdoc/variables.ts`:

```javascript
import type { Config } from "markdoc-svelte";

const variables: Config["variables"] = {
  site: {
    name: "Markdoc Svelte",
  },
}

export default variables
```

Then you can use the variable in a Markdoc file:

```markdown
---
title: Hello World
---

This is published on the {% $site.name %} site.
```

## Advanced

### Markdoc limitations

Markdoc has a few Markdown syntax limitations, see [Markdoc FAQ](https://markdoc.dev/docs/faq).

### @sveltejs/enhanced-img

To use the [enhanced-img plugin](https://svelte.dev/docs/kit/images#sveltejs-enhanced-img) with Markdown images, you can customize the default images Node with a custom Svelte component.
