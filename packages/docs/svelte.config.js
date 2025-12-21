import adapter from "@sveltejs/adapter-static";
import { sveltePreprocess } from "svelte-preprocess";
import { markdocPreprocess } from "markdoc-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".mdoc"],
  preprocess: [
    markdocPreprocess({
      extensions: [".mdoc"],
      headingIds: true,
      schema: "./markdoc",
      typographer: true,
    }),
    sveltePreprocess(),
  ],
  kit: {
    adapter: adapter({
      fallback: "404.html",
    }),
  },
};

export default config;
