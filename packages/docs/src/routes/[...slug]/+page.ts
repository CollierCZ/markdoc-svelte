import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { MarkdocModule } from "markdoc-svelte";

interface Pages {
  ["pagePath"]: MarkdocModule;
}

export const load: PageLoad = async ({ params }) => {
  const slug = params.slug;
  try {
    // Get all of the pages in the content directory
    const allPages = import.meta.glob("/src/content/**/*.mdoc");

    // Find the one that matches the slug in the URL
    const matchingPage = Object.keys(allPages).find((pagePath: string) => {
      const slugFromPath = pagePath
        .replace("/src/content/", "")
        .replace(".mdoc", "");
      return slug === slugFromPath;
    });

    // If no pages match, throw a 404 error
    if (!matchingPage) throw new Error();

    // Get the data from the matching page
    const page = await allPages[matchingPage]();

    return { page };
  } catch {
    throw error(404, `Could not find content at this address: ${slug}`);
  }
};
