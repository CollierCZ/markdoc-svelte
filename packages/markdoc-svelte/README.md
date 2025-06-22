# markdoc-svelte

<span class="badge-npmversion"><a href="https://npmjs.org/package/markdoc-svelte" title="View this project on NPM"><img src="https://img.shields.io/npm/v/markdoc-svelte.svg" alt="NPM version" /></a></span>

Process Markdown and Markdoc files into Svelte components using [Markdoc](https://markdoc.dev/).
Use Markdoc defaults out of the box or configure Markdoc schema to your needs.

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

## Docs

See full examples and more options at the [`markdown-svelte` docs].
