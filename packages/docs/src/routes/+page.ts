import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { MarkdocModule } from "markdoc-svelte";

export const load: PageLoad = async () => {
  try {
    const page = (await import(`/src/content/index.mdoc`)) as MarkdocModule;
    return { page };
  } catch {
    throw error(404);
  }
};