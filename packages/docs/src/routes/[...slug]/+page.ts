import { error, type HttpError } from "@sveltejs/kit";
import type { MarkdocModule } from "markdoc-svelte";

interface Pages {
  [pagePath: string]: () => Promise<MarkdocModule>;
}

export const load = async ({ params }) => {
  const slug = params.slug;
  try {
    // Get all of the pages in the content directory
    const allPages = import.meta.glob("/src/content/**/*.mdoc") as Pages;

    // Find the one that matches the slug in the URL
    const matchingPage = Object.keys(allPages).find((pagePath) => {
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
    throw error(
      404,
      `Could not find content at this address: ${slug}`,
    ) as HttpError;
  }
};
