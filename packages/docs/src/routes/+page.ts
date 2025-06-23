import { error } from "@sveltejs/kit";
import type { MarkdocModule } from "markdoc-svelte";

import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
  try {
    const page = (await import(`/src/content/index.mdoc`)) as MarkdocModule;
    return { page };
  } catch {
    throw error(404);
  }
};
