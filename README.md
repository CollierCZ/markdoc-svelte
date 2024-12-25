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

```javascript
<script lang="ts">
  export let title = ''
</script>

<h1>{title}</h1>

<slot />
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

You can choose to customize how the Markdoc file is processed.

### Extensions

By default, files ending in `.md` are preprocessed.
To use other extensions, add them to the `extensions` array in the options:

```javascript
import { markdoc } from "markdoc-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".markdoc", ".md"],
  preprocess: [
    markdoc({
      extensions: [".markdoc", ".md"],
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

[Frontmatter](#frontmatter) in YAML format is automatically passed to your layout.
The content is passed to a `<slot />` tag.

### Schema path

By default, the preprocessor looks for your Markdoc schema definition in a `/markdoc/` directory at the app root.
To use a different path, define the directory in the options:

```javascript
import { markdoc } from "markdoc-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".md"],
  preprocess: [
    markdoc({
      schema: "/path/to/schema/directory",
    }),
  ],
};
```


TODO: code blocks if you have `{% %}` in them
* either {% process= false %}
* or https://github.com/markdoc/markdoc/issues/503