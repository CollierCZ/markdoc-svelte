# markdown-svelte

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

## Options

You can choose to customize how the Markdoc file is processed.

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

The layout is automatically passed frontmatter from your Markdoc file if it's in YAML format.
The data from the frontmatter are then available in the layout.
The content is passed to a `<slot />` tag.

So this Markdoc file:

```markdown
---
title: A great page
---

With great content
```

Can be rendered with this layout:

```javascript
<script lang="ts">
  export let title = ''
</script>

<h1>{title}</h1>

<slot />
```
