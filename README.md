# markdoc-svelte

Process Markdown files into Svelte components using [Markdoc](https://markdoc.dev/). Use Markdoc defaults out of the box, or configure each Markdoc Schema to your needs.

## Table of Contents
- [Install](#install)
- [Basic Markdown Example](#basic-markdown-example)
- [Frontmatter](#frontmatter)
- [Customize Markdoc](#customize-markdoc)
  - [Configuration Methods](#configuration-methods)
  - [Markdoc Schema](#markdoc-schema)
  - [Relative Imports](#relative-imports)
  - [Configuration Folder](#configuration-folder)
- [Preprocessor Options](#preprocessor-options)
- [Advanced](#advanced)
  - [Markdoc Limitations](#markdoc-limitations)
  - [@sveltejs/enhanced-img](#sveltejsenhanced-img)

## Install

Install markdoc-svelte in your SvelteKit project. Markdoc is already included as a dependency so you don't need to install it separately.

```bash
$ npm install markdoc-svelte
```

Amend the SvelteKit config in `svelte.config.js`. Add the markdown extensions to preprocess. Add the markdoc-svelte preprocessor.

```javascript
import { markdocPreprocess } from "markdoc-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".mdoc", ".md"],
  preprocess: [
    markdocPreprocess(),
    vitePreprocess(),
  ],
};
```

## Basic Markdown Example

Create a folder for your Markdown files: `src/markdown/content.md`.

```markdown
---
title: Hello World
---

# Hello World
This is a markdown file that will be processed by markdoc-svelte.

![Alt text](/path/to/image.jpg)
```

Dynamically import them into a catchall route in `src/routes/[...catchall]/+page.ts`:

```typescript
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { MarkdocModule } from 'markdoc-svelte';

export const load: PageLoad = async ({ params }) => {
  const slug = params.catchall;
  try {
    const markdown = (await import(`$lib/markdown/${slug}.md`)) as MarkdocModule;
    return { markdown };
  } catch {
    throw error(404, `Markdown file not found for slug "${slug}"`);
  }
};
```

Render the imported Markdown file as a Svelte component in `src/routes/[...catchall]/+page.svelte`:

```svelte
<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>{data.markdown.frontmatter?.title ?? 'Undefined title'}</title>
</svelte:head>

<data.markdown.default />
```

Now visit `/content` to see the rendered Markdown file.

## Frontmatter

Define optional YAML frontmatter in your Markdown document. And it will be available from the `$frontmatter` variable.

```markdown
---
title: My Page
description: A great page
published: 2025-01-01
---

# {% $frontmatter.title %}

## {% $frontmatter.description %}

Published on {% $frontmatter.published %}
```

Frontmatter is also exported as a dictionary from the `frontmatter` property of the imported Markdoc module. Access it in your Svelte component:

```svelte
<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>{data.markdown.frontmatter?.title ?? 'Undefined title'}</title>
  <meta name="description" content={data.markdown.frontmatter?.description ?? 'Undefined description'} />
</svelte:head>

<header>
    <p>Published on {data.markdown.frontmatter?.published ?? 'unknown'}</p>
</header>
<data.markdown.default />
```


## Customize Markdoc

### Configuration Methods

You can customize your Markdoc schema in two ways:

1. **For simple changes**, pass config directly to the preprocessor options.
2. **For more complex changes**, create a configuration folder with schema definitions.

Note: When using the same name, configuration schema passed to the preprocessor options overwrites that loaded from the configuration folder.

### Markdoc Schema

Customize your Markdown document with Markdoc. Pass your Markdoc Config objects to the preprocessor.

- [Nodes](https://markdoc.dev/docs/nodes)
- [Tags](https://markdoc.dev/docs/tags)
- [Functions](https://markdoc.dev/docs/functions)
- [Variables](https://markdoc.dev/docs/variables)
- [Partials](https://markdoc.dev/docs/partials)

For example, to create a custom 'callout' Tag, you can pass this to the preprocessor in `svelte.config.js`:

```javascript
import { markdocPreprocess } from "markdoc-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    markdocPreprocess({
        tags: {
            callout: {
                render: 'Callout', // Svelte component to render
                children: ['paragraph', 'tag', 'list'],
                attributes: {
                    type: {
                        type: String,
                        default: 'note',
                        matches: ['caution', 'check', 'note', 'warning'],
                        errorLevel: 'critical'
                    },
                    title: {
                        type: String
                    }
                }
            }
        }
    })
  ],
  // ...
};
```

Then create a Svelte component for the 'callout' Tag in `src/lib/components/Callout.svelte`:

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

Now you can use the 'callout' Tag in your Markdown document in `src/markdown/content.md`:

```markdown
---
title: Hello World
---

# Hello World
This is a markdown file that will be processed by markdoc-svelte.

![Alt text](/path/to/image.jpg)

{% callout type="caution" title="Hello" %}
  This is a caution callout.
{% /callout %}
```

### Relative Imports

You can use relative imports to import Markdoc schema and partials. Both .js and .ts files are supported.

For example, create custom Functions in `src/lib/functions.js`:

```javascript
/** @type {import('markdoc-svelte').Config['functions']} */
const functions = {
  includes: {
    transform(parameters) {
      const [array, value] = Object.values(parameters);

      return Array.isArray(array) ? array.includes(value) : false;
    }
  },
  uppercase: {
    transform(parameters) {
      const string = parameters[0];

      return typeof string === 'string' ? string.toUpperCase() : string;
    }
  }
};

export default functions;
```

Then import the functions file and pass it to the preprocessor in `svelte.config.js`:

```javascript
import { markdocPreprocess } from 'markdoc-svelte';
import functions from './src/lib/functions.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    markdocPreprocess({ 
        functions: functions,
        variables: {
            countries: ['AR', 'US']
        } 
    })
  ],
  // ...
};
```

Now you can use the custom functions in your Markdown document in `src/markdown/content.md`:

```markdown
---
title: Hello World
---

# Hello World
This is a markdown file that will be processed by markdoc-svelte.

![Alt text](/path/to/image.jpg)

{% if includes($countries, "AR") %} 🇦🇷 {% /if %}
{% if includes($countries, "AU") %} 🇦🇺 {% /if %}
{% if includes($countries, "ES") %} 🇪🇸 {% /if %}
{% if includes($countries, "JP") %} 🇯🇵 {% /if %}
{% if includes($countries, "NG") %} 🇳🇬 {% /if %}
{% if includes($countries, "US") %} 🇺🇸 {% /if %}
```

### Configuration Folder

For complex configurations, you can create a folder with all your Markdoc schemas. 

By default, the preprocessor will automatically load the schema from `./markdoc` or `./src/markdoc` directories.

You can define each schema part as a single file or a directory with an index.ts or index.js file that exports it. Except for partials, which is a directory holding Markdoc files. All files are optional.

Example structure:

```
| markdoc/
|-- nodes.ts
|-- tags/
|   |-- marquee.ts
|   |-- decorate.ts
|   |-- index.ts
|-- functions.ts
|-- variables.ts
|-- partials/
|   |-- content.mdoc
|   |-- post.mdoc
```

For example, we can create custom nodes in `markdoc/nodes.ts`:

```typescript
import type { Config } from 'markdoc-svelte';
import { Markdoc } from 'markdoc-svelte';

const nodes: Config['nodes'] = {
    image: {
        render: 'EnhancedImage',
        attributes: {
            ...Markdoc.nodes.image.attributes, // Include the default image attributes
        }
    },
  },
  // ...
};
```

Or we can create an index file to export all our cusotm tags from `markdoc/tags/index.ts`:

```typescript
import image from './image';
import link from './link';
import paragraph from './paragraph';

const nodes: Config['nodes'] = {
  image,
  link,
  paragraph
};

export default nodes;
```

Partials are loaded from the `markdoc/partials` directory.

For example, partials like:

```
| markdoc/
|-- partials/
|   |-- content.mdoc
|   |-- post.mdoc
```

Can be included in your Markdown document in `src/markdown/content.md`:

```markdown
---
title: Hello World
---

# Hello World
This is a markdown file that will be processed by markdoc-svelte.

![Alt text](/path/to/image.jpg)

{% partial file="content.mdoc" %}

{% partial file="post.mdoc" %}
```

## Preprocessor Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `extensions` | string[] | `[".mdoc", ".md"]` | Files to process with Markdoc |
| `schema` | string | `["./markdoc", "./src/markdoc"]` | Schema directory path |
| `nodes` | Config['nodes'] | - | Nodes config |
| `tags` | Config['tags'] | - | Tags config |
| `variables` | Config['variables'] | - | Variables config |
| `functions` | Config['functions'] | - | Functions config |
| `partials` | string | - | Partials directory path |
| `components` | string | `"$lib/components"` | Svelte components directory for custom nodes and tags |
| `layout` | string | - | Default layout for all processed Markdown files |
| `comments` | boolean | `true` | Enable Markdown comments |
| `linkify` | boolean | `false` | Auto-convert URLs to links |
| `typographer` | boolean | `false` | Enable typography replacements |
| `validationLevel` | string | `"error"` | Validation strictness level | 

## Advanced

### Markdoc Limitations

Markdoc has a few Markdown syntax limitations, see [Markdoc FAQ](https://markdoc.dev/docs/faq).

### @sveltejs/enhanced-img

To use the [enhanced-img plugin](https://svelte.dev/docs/kit/images#sveltejs-enhanced-img) with Markdown images, you can customize the default images Node with a custom Svelte component. For example in `markdoc/nodes.ts`:

```typescript
import type { Config } from 'markdoc-svelte';
import { Markdoc } from 'markdoc-svelte';

const nodes: Config['nodes'] = {
    image: {
        render: 'EnhancedImage',
        attributes: {
            ...Markdoc.nodes.image.attributes // Include the default image attributes
        }
    },
  },
  // ...
};
```

Then in `src/lib/components/EnhancedImage.svelte`:

```svelte
<script lang="ts">
    // Glob import all Markdown images
    const imageModules = import.meta.glob(
    '$lib/images/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp,svg}',
        {
            eager: true,
            query: {
                enhanced: true
            }
        }
    ) as Record<string, { default: string }>;

    const { src, alt, ...restProps } = $props();

    // Find the image module that matches the src
    const matchingPath = Object.keys(imageModules).find((path) => path.endsWith(src));
    const image = matchingPath ? imageModules[matchingPath].default : undefined;
</script>

{#if image}
    // Render the image with the enhanced-img plugin
    <enhanced:img src={image} {alt} {...restProps} />
{:else}
    <img src={src} {alt} {...restProps} />
{/if}
```